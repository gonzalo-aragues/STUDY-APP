import { daysBetween, formatLong, formatShort, formatHours } from '../../../shared/dates.ts';
import type { ItemPlan } from '../../../shared/types.ts';
import { findSubject, loadAllCards, nextExam } from '../lib/content.ts';
import { hashKey, type ScreenFn } from '../lib/ctx.ts';
import { getAllCardStates, getReviewLog, getSetting, getTaskChecks, setTaskCheck } from '../lib/db.ts';
import { h, plural, svg } from '../lib/dom.ts';
import { ICONS } from '../lib/icons.ts';
import { href } from '../lib/router.ts';
import { buildQueue, newIntroducedToday, streak } from '../lib/scheduler.ts';
import { loadSettings } from '../lib/settings.ts';
import { countdownLabel, dot, header } from '../lib/ui.ts';

const TIPO_LABEL: Record<ItemPlan['tipo'], string> = {
  aprender: 'Aprender',
  practicar: 'Practicar',
  repasar: 'Repasar',
  simulacro: 'Simulacro',
  examen: 'Examen',
  preparar: 'Preparar',
  descanso: 'Descanso',
};

export const renderHoy: ScreenFn = async (_route, ctx) => {
  const { index } = ctx;
  const now = ctx.now();
  const today = ctx.today();
  const [settings, cards, states, log, checks] = await Promise.all([loadSettings(), loadAllCards(index, false), getAllCardStates(), getReviewLog(now - 400 * 86_400_000), getTaskChecks()]);
  const extra = await getSetting<number>(`extraNew-${today}`, 0);
  const q = buildQueue(cards, states, { now, newLimit: settings.newPerDay + extra - newIntroducedToday(log, now) });
  const dueCount = q.due.length;
  const newCount = q.fresh.length;
  const racha = streak(log, now);

  const node = h('div', { class: 'screen hoy' });
  node.append(
    header('Hoy', {
      subtitle: formatLong(today).replace(/^./, (c) => c.toUpperCase()),
      actions: h('a', { class: 'icon-btn', href: href('ajustes'), 'aria-label': 'Ajustes' }, svg(ICONS.ajustes)),
    }),
  );

  // --- Review card (the one-tap entry point)
  const total = dueCount + newCount;
  const reviewCard = h(
    'section',
    { class: 'card hero' },
    h(
      'div',
      { class: 'hero-count' },
      h('span', { class: 'big-number' }, String(dueCount)),
      h('div', null, h('p', { class: 'hero-label' }, dueCount === 1 ? 'tarjeta para repasar' : 'tarjetas para repasar'), h('p', { class: 'muted small' }, newCount ? `+ ${plural(newCount, 'nueva', 'nuevas')} para aprender` : cards.length ? 'Sin tarjetas nuevas por hoy' : 'Aún no hay tarjetas')),
    ),
    h(
      'div',
      { class: 'hero-actions' },
      h('a', { class: `btn primary big${total ? '' : ' disabled'}`, href: href('repasar'), 'aria-disabled': total ? undefined : 'true' }, svg(ICONS.play), total ? 'Repasar ahora' : 'Todo al día'),
      h('a', { class: 'btn big', href: href('repasar', { modo: '5min' }) }, svg(ICONS.timer), 'Sesión de 5 minutos'),
    ),
    racha ? h('p', { class: 'streak' }, svg(ICONS.flame), `${plural(racha, 'día', 'días')} seguidos repasando`) : null,
  );
  node.append(reviewCard);

  // --- Next exam countdown
  const exams = index.asignaturas
    .filter((a) => a.estado === 'activa')
    .map((a) => ({ a, fecha: nextExam(a, today) }))
    .filter((x): x is { a: (typeof index.asignaturas)[number]; fecha: string } => x.fecha !== null)
    .sort((x, y) => x.fecha.localeCompare(y.fecha));
  if (exams.length) {
    const first = exams[0];
    const d = daysBetween(today, first.fecha);
    node.append(
      h(
        'a',
        { class: 'card exam-next', href: href('examenes') },
        h('div', { class: 'countdown', style: `--c:${first.a.color}` }, h('span', { class: 'countdown-num' }, d === 0 ? '¡Hoy!' : String(d)), d > 0 ? h('span', { class: 'countdown-unit' }, d === 1 ? 'día' : 'días') : null),
        h('div', { class: 'grow' }, h('p', { class: 'kicker' }, 'Próximo examen'), h('p', { class: 'strong' }, first.a.nombre), h('p', { class: 'muted small' }, formatLong(first.fecha))),
        exams.length > 1 ? h('p', { class: 'muted small then' }, 'Luego: ', exams.slice(1, 3).map((x, i) => [i ? ', ' : '', `${x.a.abreviatura} (${countdownLabel(daysBetween(today, x.fecha)).toLowerCase()})`])) : null,
      ),
    );
  }

  // --- Today's plan
  const plan = index.plan;
  const planSection = h('section', { class: 'card plan-today' }, h('h2', null, 'El plan de hoy'));
  const day = plan?.semanas.flatMap((w) => w.dias).find((x) => x.fecha === today);
  if (!plan) {
    planSection.append(h('p', { class: 'muted' }, 'Todavía no hay plan. Pídele a Claude Code: «hazme un plan» (skill plan-de-examenes).'));
  } else if (!day) {
    planSection.append(h('p', { class: 'muted' }, today < plan.desde ? `El plan empieza el ${formatLong(plan.desde)}.` : 'El plan ha terminado. Genera uno nuevo con la skill plan-de-examenes.'));
  } else {
    if (day.horas) planSection.querySelector('h2')!.append(h('span', { class: 'muted small h-aside' }, `≈ ${formatHours(day.horas)} h`));
    if (day.nota) planSection.append(h('p', { class: 'muted small' }, day.nota));
    const list = h('ul', { class: 'checklist' });
    for (const it of day.items) {
      const key = `plan/${day.fecha}/${hashKey(it.asignatura + it.texto)}`;
      const subj = it.asignatura === '*' ? undefined : findSubject(index, it.asignatura);
      const temaTitle = subj && it.tema ? subj.temas.find((t) => t.slug === it.tema)?.titulo : undefined;
      const link = it.asignatura === '*' && it.tipo === 'repasar' ? href('repasar') : subj && it.tema && subj.temas.some((t) => t.slug === it.tema && t.url) ? href(`asignaturas/${subj.slug}/${it.tema}${it.tipo === 'practicar' ? '/ejercicios' : ''}`) : subj ? href(`asignaturas/${subj.slug}`) : null;
      const checkbox = h('input', { type: 'checkbox', checked: checks.get(key) ? true : undefined, 'aria-label': 'Hecho' }) as HTMLInputElement;
      const li = h(
        'li',
        { class: checks.get(key) ? 'done' : '' },
        h('label', { class: 'check' }, checkbox),
        h(
          'div',
          { class: 'grow' },
          h('p', { class: 'item-meta' }, subj ? [dot(subj.color), h('span', null, subj.abreviatura)] : null, h('span', { class: `tag tag-${it.tipo}` }, TIPO_LABEL[it.tipo]), it.horas ? h('span', { class: 'muted' }, `≈ ${formatHours(it.horas)} h`) : null),
          link ? h('a', { class: 'item-text', href: link }, it.texto.replace(/^«[^»]+»: /, temaTitle ? '' : '$&')) : h('p', { class: 'item-text' }, it.texto),
          temaTitle ? h('p', { class: 'muted small' }, temaTitle) : null,
        ),
      );
      checkbox.addEventListener('change', async () => {
        li.classList.toggle('done', checkbox.checked);
        await setTaskCheck(key, checkbox.checked);
      });
      list.append(li);
    }
    planSection.append(list);
  }
  planSection.append(h('a', { class: 'link small', href: href('plan') }, 'Ver la semana entera →'));
  node.append(planSection);

  // --- Pending task steps
  const tareas = index.tareas.filter((t) => !t.archivada);
  const pendientes = tareas
    .map((t) => ({ t, next: t.pasos.find((p) => !checks.get(`${t.id}/${p.id}`)), done: t.pasos.filter((p) => checks.get(`${t.id}/${p.id}`)).length }))
    .filter((x) => x.next);
  if (pendientes.length) {
    const sec = h('section', { class: 'card' }, h('h2', null, 'Siguiente paso'));
    for (const { t, next, done } of pendientes.slice(0, 2)) {
      sec.append(
        h(
          'a',
          { class: 'next-step', href: href('tareas', { tarea: t.id }) },
          h('div', { class: 'grow' }, h('p', { class: 'muted small' }, `${t.titulo} · ${done}/${t.pasos.length}`), h('p', { class: 'strong' }, next!.texto)),
          h('span', { class: 'pill' }, `${next!.minutos} min`),
        ),
      );
    }
    node.append(sec);
  }

  // --- Backup reminder (progress lives only on this device)
  const lastBackup = settings.lastBackup;
  if (log.length >= 20 && (!lastBackup || now - lastBackup > 14 * 86_400_000)) {
    node.append(
      h(
        'a',
        { class: 'banner warn', href: href('ajustes') },
        svg(ICONS.download),
        h('span', null, lastBackup ? `Tu última copia de seguridad es del ${formatShort(new Date(lastBackup).toISOString().slice(0, 10))}. ` : 'Aún no has hecho ninguna copia de seguridad. ', h('strong', null, 'Exporta tu progreso')),
      ),
    );
  }

  return { node, title: 'Hoy' };
};
