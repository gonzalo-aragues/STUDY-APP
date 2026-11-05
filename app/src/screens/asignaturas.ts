import { daysBetween, formatShort } from '../../../shared/dates.ts';
import type { AsignaturaIndex, EjercicioIndex, Nivel, TemaIndex } from '../../../shared/types.ts';
import { findSubject, loadSubjectCards, loadTema, nextExam } from '../lib/content.ts';
import type { Ctx, ScreenFn } from '../lib/ctx.ts';
import { getAllCardStates, getTaskChecks, setTaskCheck } from '../lib/db.ts';
import { h, plural, svg } from '../lib/dom.ts';
import { ICONS } from '../lib/icons.ts';
import { href } from '../lib/router.ts';
import { countdownLabel, empty, genericBanner, header, semestreLabel } from '../lib/ui.ts';

export const renderAsignaturas: ScreenFn = async (route, ctx) => {
  const [, slug, tema, tab] = route.path;
  if (slug && tema) return renderTema(ctx, slug, tema, tab === 'ejercicios' ? 'ejercicios' : 'explicacion');
  if (slug) return renderSubject(ctx, slug);
  return renderList(ctx);
};

function subjectRow(a: AsignaturaIndex, ctx: Ctx): HTMLElement {
  const ex = nextExam(a, ctx.today());
  const days = ex ? daysBetween(ctx.today(), ex) : null;
  const ready = a.temas.filter((t) => t.url).length;
  return h(
    'a',
    { class: 'card subject-row', href: href(`asignaturas/${a.slug}`), style: `--c:${a.color}` },
    h('span', { class: 'subject-badge' }, a.abreviatura.slice(0, 5)),
    h(
      'div',
      { class: 'grow' },
      h('p', { class: 'strong' }, a.nombre),
      h('p', { class: 'muted small' }, a.temas.length ? `${plural(a.temas.length, 'tema', 'temas')}${ready < a.temas.length ? ` (${ready} con material)` : ''} · ${plural(a.numTarjetas, 'tarjeta', 'tarjetas')}` : 'Sin temas todavía'),
    ),
    days !== null ? h('span', { class: 'pill', title: `Examen ${ex}` }, countdownLabel(days)) : null,
    svg(ICONS.chevron, 'icon chev'),
  );
}

async function renderList(ctx: Ctx) {
  const node = h('div', { class: 'screen' }, header('Asignaturas'));
  const active = ctx.index.asignaturas.filter((a) => a.estado === 'activa');
  const archived = ctx.index.asignaturas.filter((a) => a.estado === 'archivada');
  if (!active.length) node.append(empty('No hay asignaturas', 'Créalas con la skill nueva-asignatura en Claude Code.'));
  node.append(h('div', { class: 'list' }, active.map((a) => subjectRow(a, ctx))));
  if (archived.length) {
    const bySem = new Map<string, AsignaturaIndex[]>();
    for (const a of archived) bySem.set(a.semestre, [...(bySem.get(a.semestre) ?? []), a]);
    node.append(
      h(
        'details',
        { class: 'archived' },
        h('summary', null, `Archivadas (${archived.length})`),
        [...bySem.entries()].sort((x, y) => y[0].localeCompare(x[0])).map(([sem, list]) => [h('p', { class: 'kicker' }, semestreLabel(sem)), h('div', { class: 'list' }, list.map((a) => subjectRow(a, ctx)))]),
      ),
    );
  }
  return { node, title: 'Asignaturas' };
}

async function renderSubject(ctx: Ctx, slug: string) {
  const a = findSubject(ctx.index, slug);
  if (!a) return { node: h('div', { class: 'screen' }, header('No encontrada', { back: href('asignaturas') }), empty('Esa asignatura no existe', slug)) };
  const today = ctx.today();
  const exams = a.examenes.filter((e) => e.fecha >= today);
  const node = h(
    'div',
    { class: 'screen', style: `--c:${a.color}` },
    header(a.nombre, {
      back: href('asignaturas'),
      subtitle: [semestreLabel(a.semestre), a.estado === 'archivada' ? 'archivada' : null, exams.length ? `examen ${formatShort(exams[0].fecha)} (${countdownLabel(daysBetween(today, exams[0].fecha)).toLowerCase()})` : null].filter(Boolean).join(' · '),
    }),
  );
  if (a.numTarjetas) {
    node.append(h('a', { class: 'btn primary block', href: href('repasar', { asignatura: a.slug }) }, svg(ICONS.repasar), `Repasar ${a.abreviatura} (${a.numTarjetas} tarjetas)`));
  }
  if (!a.temas.length) {
    node.append(empty('Sin temas todavía', `Deja tus apuntes en asignaturas/${a.slug}/apuntes/ y pide a Claude Code «genera el material del tema 1 de ${a.abreviatura}».`));
  }
  const [cards, states, checks] = await Promise.all([loadSubjectCards(a), getAllCardStates(), getTaskChecks()]);
  const progress = new Map<string, TemaProgress>();
  for (const t of a.temas) {
    const tc = cards.filter((c) => c.tema === t.slug);
    progress.set(t.slug, {
      vistas: tc.filter((c) => states.has(c.id)).length,
      maduras: tc.filter((c) => (states.get(c.id)?.stability ?? 0) >= 21).length,
      ejercicios: Array.from({ length: t.numEjercicios }).filter((_, i) => checks.get(`ej/${a.slug}/${t.slug}/${i + 1}`)).length,
    });
  }
  const list = h('ol', { class: 'temas' });
  a.temas.forEach((t, i) => list.append(temaRow(a, t, i, progress.get(t.slug))));
  node.append(list);
  return { node, title: a.nombre };
}

interface TemaProgress {
  vistas: number; // cards seen at least once
  maduras: number; // stability >= 21 days
  ejercicios: number; // exercises ticked as done
}

function progressBars(t: TemaIndex, p: TemaProgress | undefined): HTMLElement | null {
  if (!p || !t.url) return null;
  const bar = (label: string, n: number, total: number) =>
    total
      ? h('div', { class: 'mini' }, h('span', { class: 'muted small' }, `${label} ${n}/${total}`), h('div', { class: 'bar' }, h('span', { style: `width:${(n / total) * 100}%` })))
      : null;
  return h('div', { class: 'tema-progress' }, bar('Tarjetas', p.vistas, t.numTarjetas), bar('Ejercicios', p.ejercicios, t.numEjercicios));
}

function temaRow(a: AsignaturaIndex, t: TemaIndex, i: number, p?: TemaProgress): HTMLElement {
  const generic = t.fuente && /^gen[eé]rico/i.test(t.fuente);
  return h(
    'li',
    { class: 'card tema-row' },
    h('div', { class: 'tema-head' }, h('span', { class: 'tema-num' }, String(i + 1)), h('div', { class: 'grow' }, h('p', { class: 'strong' }, t.titulo), h('p', { class: 'muted small' }, t.url ? [plural(t.numEjercicios, 'ejercicio', 'ejercicios'), ' · ', plural(t.numTarjetas, 'tarjeta', 'tarjetas'), generic ? h('span', { class: 'tag tag-warn' }, 'genérico') : null] : 'Pendiente de generar'))),
    t.url
      ? h(
          'div',
          { class: 'row gap wrap tema-actions' },
          t.tieneExplicacion ? h('a', { class: 'btn small', href: href(`asignaturas/${a.slug}/${t.slug}`) }, 'Explicación') : null,
          t.numEjercicios ? h('a', { class: 'btn small', href: href(`asignaturas/${a.slug}/${t.slug}/ejercicios`) }, 'Ejercicios') : null,
          t.numTarjetas ? h('a', { class: 'btn small ghost', href: href('repasar', { asignatura: a.slug, tema: t.slug }) }, 'Tarjetas') : null,
        )
      : null,
    progressBars(t, p),
  );
}

const NIVEL_LABEL: Record<Nivel, string> = { basico: 'Básico', medio: 'Medio', examen: 'Tipo examen', otro: 'Otros' };

async function renderTema(ctx: Ctx, slug: string, temaSlug: string, tab: 'explicacion' | 'ejercicios') {
  const a = findSubject(ctx.index, slug);
  const t = a?.temas.find((x) => x.slug === temaSlug);
  if (!a || !t || !t.url) {
    return { node: h('div', { class: 'screen' }, header('No encontrado', { back: href(`asignaturas/${slug}`) }), empty('Ese tema no tiene material todavía', 'Genera el material con la skill apuntes-a-material.')) };
  }
  const content = await loadTema(t.url);
  const idx = a.temas.indexOf(t);
  const node = h('div', { class: 'screen tema', style: `--c:${a.color}` }, header(t.titulo, { back: href(`asignaturas/${slug}`), subtitle: `${a.abreviatura} · Tema ${idx + 1}` }));

  const tabs = h(
    'div',
    { class: 'segmented', role: 'tablist' },
    h('a', { role: 'tab', class: tab === 'explicacion' ? 'active' : '', 'aria-selected': String(tab === 'explicacion'), href: href(`asignaturas/${slug}/${temaSlug}`) }, 'Explicación'),
    h('a', { role: 'tab', class: tab === 'ejercicios' ? 'active' : '', 'aria-selected': String(tab === 'ejercicios'), href: href(`asignaturas/${slug}/${temaSlug}/ejercicios`) }, `Ejercicios (${content.ejercicios.length})`),
    t.numTarjetas ? h('a', { role: 'tab', href: href('repasar', { asignatura: slug, tema: temaSlug }) }, 'Tarjetas') : null,
  );
  node.append(tabs);
  const banner = genericBanner(content.fuente);
  if (banner) node.append(banner);

  if (tab === 'explicacion') {
    node.append(content.explicacionHtml ? h('article', { class: 'prose', html: content.explicacionHtml }) : empty('Sin explicación', 'Este tema aún no tiene explicacion.md.'));
    if (content.ejercicios.length) node.append(h('a', { class: 'btn primary block', href: href(`asignaturas/${slug}/${temaSlug}/ejercicios`) }, `Ir a los ejercicios (${content.ejercicios.length}) →`));
  } else {
    const checks = await getTaskChecks();
    node.append(exerciseList(content.ejercicios, `ej/${slug}/${temaSlug}`, checks));
  }
  return { node, title: t.titulo };
}

export function exerciseList(ejercicios: EjercicioIndex[], keyBase: string, checks: Map<string, boolean>): HTMLElement {
  const wrap = h('div', { class: 'exercises' });
  if (!ejercicios.length) {
    wrap.append(empty('Sin ejercicios', 'Este tema aún no tiene ejercicios.md.'));
    return wrap;
  }
  const done = ejercicios.filter((e) => checks.get(`${keyBase}/${e.numero}`)).length;
  const counter = h('p', { class: 'muted small' }, `${done}/${ejercicios.length} hechos`);
  wrap.append(counter);
  let lastNivel: Nivel | null = null;
  for (const e of ejercicios) {
    if (e.nivel !== lastNivel) {
      wrap.append(h('h2', { class: `nivel nivel-${e.nivel}` }, NIVEL_LABEL[e.nivel]));
      lastNivel = e.nivel;
    }
    const key = `${keyBase}/${e.numero}`;
    const cb = h('input', { type: 'checkbox', checked: checks.get(key) ? true : undefined, 'aria-label': `Ejercicio ${e.numero} hecho` }) as HTMLInputElement;
    const item = h(
      'section',
      { class: `card exercise${checks.get(key) ? ' done' : ''}`, id: `ejercicio-${e.numero}` },
      h('header', { class: 'exercise-head' }, h('h3', null, `Ejercicio ${e.numero}`, e.titulo ? h('span', { class: 'muted' }, ` · ${e.titulo}`) : null), h('label', { class: 'check small', title: 'Marcar como hecho' }, cb, h('span', null, 'Hecho'))),
      h('div', { class: 'prose', html: e.html }),
      e.solucionHtml
        ? h('details', { class: 'solution' }, h('summary', null, 'Ver solución'), h('div', { class: 'prose', html: e.solucionHtml }))
        : h('p', { class: 'muted small' }, 'Sin solución en soluciones.md'),
    );
    cb.addEventListener('change', async () => {
      item.classList.toggle('done', cb.checked);
      await setTaskCheck(key, cb.checked);
      checks.set(key, cb.checked);
      counter.textContent = `${ejercicios.filter((x) => checks.get(`${keyBase}/${x.numero}`)).length}/${ejercicios.length} hechos`;
    });
    wrap.append(item);
  }
  return wrap;
}
