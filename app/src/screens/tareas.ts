import { formatShort } from '../../../shared/dates.ts';
import type { Tarea } from '../../../shared/types.ts';
import { findSubject } from '../lib/content.ts';
import type { ScreenFn } from '../lib/ctx.ts';
import { getTaskChecks, setTaskCheck } from '../lib/db.ts';
import { h, plural } from '../lib/dom.ts';
import { dot, empty, header } from '../lib/ui.ts';

export const renderTareas: ScreenFn = async (route, ctx) => {
  const checks = await getTaskChecks();
  const focus = route.query.get('tarea');
  const tareas = ctx.index.tareas.filter((t) => !t.archivada);
  const isDone = (t: Tarea) => t.pasos.every((p) => checks.get(`${t.id}/${p.id}`));
  const pending = tareas.filter((t) => !isDone(t));
  const done = tareas.filter(isDone);

  const node = h('div', { class: 'screen' }, header('Tareas', { subtitle: pending.length ? `${plural(pending.length, 'tarea', 'tareas')} en marcha` : undefined }));
  if (!tareas.length) {
    node.append(empty('No hay tareas', 'Pide a Claude Code «divide estudiar el tema 2 de Álgebra» (skill dividir-tarea) y aparecerán aquí.'));
    return { node, title: 'Tareas' };
  }
  for (const t of pending) node.append(taskCard(t, checks, ctx, focus === t.id || pending.length === 1 || pending[0] === t));
  if (done.length) {
    node.append(h('details', { class: 'archived' }, h('summary', null, `Terminadas (${done.length})`), done.map((t) => taskCard(t, checks, ctx, false))));
  }
  if (focus) queueMicrotask(() => document.getElementById(`tarea-${focus}`)?.scrollIntoView({ block: 'start' }));
  return { node, title: 'Tareas' };
};

function taskCard(t: Tarea, checks: Map<string, boolean>, ctx: Parameters<ScreenFn>[1], open: boolean): HTMLElement {
  const subj = t.asignatura ? findSubject(ctx.index, t.asignatura) : undefined;
  const meta = h('p', { class: 'muted small' });
  const bar = h('span');
  const updateMeta = () => {
    const n = t.pasos.filter((p) => checks.get(`${t.id}/${p.id}`)).length;
    const minLeft = t.pasos.filter((p) => !checks.get(`${t.id}/${p.id}`)).reduce((a, p) => a + p.minutos, 0);
    meta.textContent = `${n}/${t.pasos.length} pasos${minLeft ? ` · quedan ≈ ${minLeft} min` : ' · ¡terminada!'}${t.fechaLimite ? ` · para el ${formatShort(t.fechaLimite)}` : ''}`;
    bar.style.width = `${(n / t.pasos.length) * 100}%`;
    list.querySelectorAll('li').forEach((li) => li.classList.remove('next'));
    const firstPending = t.pasos.findIndex((p) => !checks.get(`${t.id}/${p.id}`));
    if (firstPending >= 0) list.children[firstPending]?.classList.add('next');
  };
  const list = h('ol', { class: 'checklist steps' });
  for (const p of t.pasos) {
    const key = `${t.id}/${p.id}`;
    const cb = h('input', { type: 'checkbox', checked: checks.get(key) ? true : undefined, 'aria-label': 'Paso hecho' }) as HTMLInputElement;
    const li = h(
      'li',
      { class: checks.get(key) ? 'done' : '' },
      h('label', { class: 'check' }, cb),
      h('div', { class: 'grow' }, p.enlace ? h('a', { class: 'item-text', href: p.enlace }, p.texto) : h('p', { class: 'item-text' }, p.texto), p.detalle ? h('p', { class: 'muted small' }, p.detalle) : null),
      h('span', { class: 'pill' }, `${p.minutos} min`),
    );
    cb.addEventListener('change', async () => {
      li.classList.toggle('done', cb.checked);
      checks.set(key, cb.checked);
      updateMeta();
      await setTaskCheck(key, cb.checked);
    });
    list.append(li);
  }
  const card = h(
    'details',
    { class: 'card task', id: `tarea-${t.id}`, open: open ? true : undefined },
    h('summary', null, h('div', { class: 'grow' }, h('p', { class: 'item-meta' }, subj ? [dot(subj.color), h('span', null, subj.abreviatura)] : null), h('p', { class: 'strong' }, t.titulo), meta, h('div', { class: 'bar' }, bar))),
    list,
  );
  updateMeta();
  return card;
}
