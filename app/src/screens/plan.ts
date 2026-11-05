import { formatHours, formatShort } from '../../../shared/dates.ts';
import { findSubject } from '../lib/content.ts';
import { hashKey, type ScreenFn } from '../lib/ctx.ts';
import { getTaskChecks } from '../lib/db.ts';
import { h } from '../lib/dom.ts';
import { href } from '../lib/router.ts';
import { dot, empty, header } from '../lib/ui.ts';

export const renderPlan: ScreenFn = async (route, ctx) => {
  const plan = ctx.index.plan;
  const node = h('div', { class: 'screen plan' }, header('Plan de estudio', { back: href('hoy'), subtitle: plan ? `Hasta el ${formatShort(plan.hasta)}` : undefined }));
  if (!plan) {
    node.append(empty('Sin plan', 'Genera uno con la skill plan-de-examenes en Claude Code.'));
    return { node };
  }
  const checks = await getTaskChecks();
  const today = ctx.today();
  const weeks = plan.semanas;
  const curIdx = Math.max(0, weeks.findIndex((w) => today >= w.inicio && today <= w.fin));
  const sel = Number(route.query.get('semana') ?? curIdx);
  const w = weeks[Math.min(Math.max(0, sel), weeks.length - 1)];
  const wi = weeks.indexOf(w);

  node.append(
    h(
      'div',
      { class: 'week-nav' },
      h('a', { class: `btn small${wi === 0 ? ' disabled' : ''}`, href: href('plan', { semana: String(Math.max(0, wi - 1)) }), 'aria-label': 'Semana anterior' }, '←'),
      h('div', { class: 'grow center' }, h('p', { class: 'strong' }, w.titulo), h('p', { class: 'muted small' }, `${formatShort(w.inicio)} – ${formatShort(w.fin)}`)),
      h('a', { class: `btn small${wi === weeks.length - 1 ? ' disabled' : ''}`, href: href('plan', { semana: String(Math.min(weeks.length - 1, wi + 1)) }), 'aria-label': 'Semana siguiente' }, '→'),
    ),
  );
  if (w.objetivo) node.append(h('p', { class: 'muted small center' }, w.objetivo));
  for (const n of plan.notas ?? []) node.append(h('p', { class: 'banner warn small' }, n));

  for (const d of w.dias) {
    const isToday = d.fecha === today;
    node.append(
      h(
        'section',
        { class: `card day${isToday ? ' today' : ''}${d.fecha < today ? ' past' : ''}` },
        h('h2', null, formatShort(d.fecha), isToday ? h('span', { class: 'tag tag-new' }, 'Hoy') : null, d.horas ? h('span', { class: 'muted small h-aside' }, `≈ ${formatHours(d.horas)} h`) : null),
        h(
          'ul',
          { class: 'plain day-items' },
          d.items.map((it) => {
            const s = it.asignatura === '*' ? undefined : findSubject(ctx.index, it.asignatura);
            const done = checks.get(`plan/${d.fecha}/${hashKey(it.asignatura + it.texto)}`);
            return h('li', { class: done ? 'done' : '' }, s ? dot(s.color) : h('span', { class: 'dot', style: '--c:var(--muted)' }), h('span', null, s ? h('strong', null, `${s.abreviatura} · `) : null, it.texto, it.horas ? h('span', { class: 'muted' }, ` (≈${formatHours(it.horas)} h)`) : null));
          }),
        ),
      ),
    );
  }
  return { node, title: 'Plan' };
};
