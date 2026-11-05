import { daysBetween, formatLong } from '../../../shared/dates.ts';
import type { ScreenFn } from '../lib/ctx.ts';
import { h } from '../lib/dom.ts';
import { href } from '../lib/router.ts';
import { countdownLabel, empty, header } from '../lib/ui.ts';

const TIPO: Record<string, string> = { final: 'Final', parcial: 'Parcial', practicas: 'Prácticas', recuperacion: 'Recuperación', otro: 'Examen' };

export const renderExamenes: ScreenFn = async (_route, ctx) => {
  const today = ctx.today();
  const all = ctx.index.asignaturas
    .filter((a) => a.estado === 'activa')
    .flatMap((a) => a.examenes.map((e) => ({ a, e, d: daysBetween(today, e.fecha) })))
    .sort((x, y) => x.e.fecha.localeCompare(y.e.fecha) || (x.e.hora ?? '').localeCompare(y.e.hora ?? ''));
  const upcoming = all.filter((x) => x.d >= 0);
  const past = all.filter((x) => x.d < 0);
  const node = h('div', { class: 'screen' }, header('Exámenes', { subtitle: upcoming.length ? `${upcoming.length} por delante` : undefined }));
  if (!all.length) node.append(empty('Sin exámenes', 'Añade las fechas en el meta.json de cada asignatura.'));

  const maxD = Math.max(1, ...upcoming.map((x) => x.d));
  const list = h('ol', { class: 'exam-list' });
  for (const { a, e, d } of upcoming) {
    list.append(
      h(
        'li',
        { class: 'card exam-row', style: `--c:${a.color}` },
        h('div', { class: 'countdown' }, h('span', { class: 'countdown-num' }, d === 0 ? '¡Hoy!' : String(d)), d > 0 ? h('span', { class: 'countdown-unit' }, d === 1 ? 'día' : 'días') : null),
        h(
          'div',
          { class: 'grow' },
          h('a', { class: 'strong', href: href(`asignaturas/${a.slug}`) }, a.nombre),
          h('p', { class: 'muted small' }, [formatLong(e.fecha), e.hora ? ` · ${e.hora}` : '', e.lugar ? ` · ${e.lugar}` : ''].join('')),
          h('p', { class: 'small' }, h('span', { class: 'tag' }, e.titulo ?? TIPO[e.tipo ?? 'final']), d > 0 ? h('span', { class: 'muted' }, ` ${countdownLabel(d) === 'Mañana' ? 'mañana' : `en ${d} días`}`) : null),
          e.notas ? h('p', { class: 'muted small' }, e.notas) : null,
          h('div', { class: 'bar', 'aria-hidden': 'true' }, h('span', { style: `width:${Math.max(4, 100 - (d / maxD) * 100)}%` })),
        ),
      ),
    );
  }
  node.append(list);
  if (past.length) {
    node.append(
      h(
        'details',
        { class: 'archived' },
        h('summary', null, `Ya pasados (${past.length})`),
        h('ul', { class: 'plain' }, past.reverse().map(({ a, e }) => h('li', { class: 'muted' }, `${a.abreviatura} — ${formatLong(e.fecha)}`))),
      ),
    );
  }
  return { node, title: 'Exámenes' };
};
