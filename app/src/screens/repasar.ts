// Spaced-repetition session: front -> reveal -> Otra vez / Difícil / Bien / Fácil.
import type { TarjetaIndex } from '../../../shared/types.ts';
import { findSubject, loadAllCards, nextExam } from '../lib/content.ts';
import type { ScreenFn } from '../lib/ctx.ts';
import { getAllCardStates, getReviewLog, getSetting, saveReview, setSetting, undoReview } from '../lib/db.ts';
import { append, h, plural, svg } from '../lib/dom.ts';
import { ICONS } from '../lib/icons.ts';
import { go, href } from '../lib/router.ts';
import { buildQueue, formatInterval, newIntroducedToday, plannedTemas, previewIntervals, RATINGS, requeuePosition, review, shouldRequeue, type RatingValue, type StoredCard } from '../lib/scheduler.ts';
import { loadSettings } from '../lib/settings.ts';
import { fitMath } from '../lib/fitmath.ts';
import { dot, empty, header } from '../lib/ui.ts';

const FIVE_MIN = 5 * 60_000;

interface UndoEntry {
  card: TarjetaIndex;
  previous: StoredCard | null;
  logKey: number;
  queue: TarjetaIndex[];
  stats: Stats;
}

interface Stats {
  reviewed: number;
  again: number;
  newSeen: number;
}

export const renderRepasar: ScreenFn = async (route, ctx) => {
  const { index } = ctx;
  const asignatura = route.query.get('asignatura') ?? undefined;
  const tema = route.query.get('tema') ?? undefined;
  const modo = route.query.get('modo') ?? '';
  const now0 = ctx.now();
  const today = ctx.today();

  const [settings, states, log] = await Promise.all([loadSettings(), getAllCardStates(), getReviewLog(now0 - 2 * 86_400_000)]);
  const subjectForArchived = asignatura ? findSubject(index, asignatura) : undefined;
  const cards = await loadAllCards(index, settings.includeArchived || subjectForArchived?.estado === 'archivada');
  const extra = await getSetting<number>(`extraNew-${today}`, 0);
  const newLimit = settings.newPerDay + extra - newIntroducedToday(log, now0);
  const q = buildQueue(cards, states, { now: now0, newLimit, asignatura, tema, ahead: modo === 'adelantado', priority: plannedTemas(index.plan, today) });
  let queue: TarjetaIndex[] = modo === 'adelantado' ? q.ahead : [...q.due, ...q.fresh];

  const examBySubject = new Map(index.asignaturas.map((a) => [a.slug, nextExam(a, today)]));
  const node = h('div', { class: 'screen repasar' });
  const filterBar = buildFilters(ctx, asignatura, tema, modo);
  node.append(header(modo === '5min' ? 'Sesión de 5 minutos' : modo === 'adelantado' ? 'Repaso por adelantado' : 'Repasar', { actions: filterBar }));

  const stage = h('div', { class: 'stage' });
  node.append(stage);

  if (!queue.length) {
    const pool = cards.filter((c) => (!asignatura || c.asignatura === asignatura) && (!tema || c.tema === tema));
    const nextDue = pool.map((c) => states.get(c.id)?.due).filter((d): d is number => d !== undefined && d > now0).sort((a, b) => a - b)[0];
    const hasUnseen = pool.some((c) => !states.has(c.id));
    stage.append(
      pool.length === 0
        ? empty('No hay tarjetas aquí', 'Genera material con la skill apuntes-a-material (crea tarjetas.json en cada tema).')
        : empty(
            '¡Todo al día! 🎉',
            nextDue ? `La próxima tarjeta toca ${relTime(nextDue - now0)}.` : 'No queda nada pendiente.',
            h('a', { class: 'btn', href: href('repasar', { asignatura, tema, modo: 'adelantado' }) }, 'Repasar por adelantado'),
            hasUnseen
              ? h(
                  'button',
                  {
                    class: 'btn primary',
                    onclick: async () => {
                      await setSetting(`extraNew-${today}`, extra + 10);
                      dispatchEvent(new Event('app:rerender'));
                    },
                  },
                  '+10 nuevas hoy',
                )
              : null,
          ),
    );
    return { node, title: 'Repasar' };
  }

  // ---------------------------------------------------------------- session
  const started = ctx.now();
  const deadline = modo === '5min' ? started + FIVE_MIN : Infinity;
  let stats: Stats = { reviewed: 0, again: 0, newSeen: 0 };
  let current: TarjetaIndex | null = null;
  let revealed = false;
  const undoStack: UndoEntry[] = [];
  let busy = false;
  let finished = false;

  const progress = h('div', { class: 'session-bar' });
  const timerEl = h('span', { class: 'timer' });
  const cardEl = h('article', { class: 'flash', 'aria-live': 'polite' });
  const controls = h('div', { class: 'controls' });
  stage.append(progress, cardEl, controls, h('p', { class: 'kbd-hint muted small' }, 'Teclado: Espacio muestra la respuesta · 1–4 responden · Z deshace'));

  let tick: number | undefined;
  if (deadline !== Infinity) {
    const upd = () => {
      const left = Math.max(0, deadline - ctx.now());
      const m = Math.floor(left / 60_000);
      const s = Math.floor((left % 60_000) / 1000);
      timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
      timerEl.classList.toggle('over', left === 0);
    };
    upd();
    tick = window.setInterval(upd, 1000);
  }

  function renderProgress() {
    const undo = h('button', { class: 'icon-btn', 'aria-label': 'Deshacer última respuesta', title: 'Deshacer (Z)', disabled: undoStack.length ? undefined : true, onclick: doUndo }, svg(ICONS.undo));
    progress.replaceChildren(
      h('span', { class: 'muted small' }, `Quedan ${queue.length + (current ? 1 : 0)}`),
      deadline !== Infinity ? h('span', { class: 'timer-wrap' }, svg(ICONS.timer), timerEl) : h('span', { class: 'muted small' }, `${stats.reviewed} hechas`),
      undo,
    );
  }

  function showNext() {
    current = queue.shift() ?? null;
    revealed = false;
    if (!current || ctx.now() >= deadline) {
      finish();
      return;
    }
    renderCard();
  }

  function renderCard() {
    if (!current) return;
    const c = current;
    const subj = findSubject(index, c.asignatura);
    const temaTitle = subj?.temas.find((t) => t.slug === c.tema)?.titulo ?? c.tema;
    const st = states.get(c.id);
    const isNew = !st || st.state === 0;
    cardEl.replaceChildren();
    append(cardEl, [
      h('p', { class: 'flash-meta' }, subj ? dot(subj.color) : null, h('span', null, `${subj?.abreviatura ?? c.asignatura} · ${temaTitle}`), h('span', { class: 'tag' }, c.tipo === 'concepto' ? 'Concepto' : 'Procedimiento'), isNew ? h('span', { class: 'tag tag-new' }, 'Nueva') : null),
      h('div', { class: 'flash-front prose', html: c.anversoHtml }),
      revealed ? h('hr', { class: 'flash-sep' }) : null,
      revealed ? h('div', { class: 'flash-back prose', html: c.reversoHtml }) : null,
    ]);
    if (!revealed) {
      controls.replaceChildren(h('button', { class: 'btn primary big reveal', onclick: reveal }, 'Mostrar respuesta'));
    } else {
      const prev = previewIntervals(st, ctx.now(), { retention: settings.retention, examDate: examBySubject.get(c.asignatura) });
      controls.replaceChildren(
        h(
          'div',
          { class: 'ratings' },
          RATINGS.map((r) =>
            h('button', { class: `btn rate rate-${r.value}`, onclick: () => rate(r.value), title: `Tecla ${r.key}` }, h('span', { class: 'rate-label' }, r.label), h('span', { class: 'rate-int' }, formatInterval(prev[r.value]))),
          ),
        ),
      );
    }
    renderProgress();
    requestAnimationFrame(() => fitMath(cardEl));
  }

  function reveal() {
    if (!current || revealed) return;
    revealed = true;
    renderCard();
    (controls.querySelector('.rate-3') as HTMLButtonElement | null)?.focus({ preventScroll: true });
  }

  async function rate(value: RatingValue) {
    if (!current || !revealed || busy) return;
    busy = true;
    const c = current;
    const now = ctx.now();
    const previous = states.get(c.id) ?? null;
    const r = review(c.id, previous, value, now, { retention: settings.retention, examDate: examBySubject.get(c.asignatura) });
    try {
      const logKey = await saveReview(c.id, r.card, r.log);
      undoStack.push({ card: c, previous, logKey, queue: [...queue], stats: { ...stats } });
      if (undoStack.length > 20) undoStack.shift();
    } catch (e) {
      busy = false;
      alert(`No se pudo guardar el repaso: ${(e as Error).message}`);
      return;
    }
    states.set(c.id, r.card);
    stats = { reviewed: stats.reviewed + 1, again: stats.again + (value === 1 ? 1 : 0), newSeen: stats.newSeen + (!previous ? 1 : 0) };
    // Learning cards come back in this session, roughly when they are due (~20 s per card).
    if (shouldRequeue(r.card, now)) queue.splice(requeuePosition(r.card.due - now, queue.length), 0, c);
    busy = false;
    showNext();
  }

  async function doUndo() {
    const u = undoStack.pop();
    if (!u || busy) return;
    busy = true;
    await undoReview(u.card.id, u.previous, u.logKey);
    if (u.previous) states.set(u.card.id, u.previous);
    else states.delete(u.card.id);
    // The snapshot was taken right after rating, before the next card was taken from the
    // queue, so it already contains the card currently on screen.
    queue = u.queue;
    stats = u.stats;
    current = u.card;
    revealed = true;
    finished = false;
    busy = false;
    renderCard();
  }

  function finish() {
    if (finished) return;
    finished = true;
    current = null;
    window.clearInterval(tick);
    const mins = Math.max(1, Math.round((ctx.now() - started) / 60_000));
    const ok = stats.reviewed ? Math.round(((stats.reviewed - stats.again) / stats.reviewed) * 100) : 0;
    progress.replaceChildren();
    cardEl.replaceChildren(
      h(
        'div',
        { class: 'summary' },
        h('p', { class: 'empty-title' }, stats.reviewed ? '¡Sesión terminada!' : 'Sesión terminada'),
        h('p', null, `${plural(stats.reviewed, 'tarjeta', 'tarjetas')} en ${plural(mins, 'minuto', 'minutos')}`),
        stats.reviewed ? h('p', { class: 'muted' }, `${ok} % recordadas a la primera${stats.newSeen ? ` · ${plural(stats.newSeen, 'nueva', 'nuevas')}` : ''}`) : null,
        queue.length ? h('p', { class: 'muted small' }, `Quedan ${queue.length} para después.`) : null,
      ),
    );
    controls.replaceChildren(
      h(
        'div',
        { class: 'row gap center wrap' },
        h('a', { class: 'btn', href: href('hoy') }, 'Volver a Hoy'),
        queue.length || undoStack.length ? h('button', { class: 'btn primary', onclick: () => dispatchEvent(new Event('app:rerender')) }, modo === '5min' ? 'Otros 5 minutos' : 'Seguir') : null,
      ),
    );
    if (undoStack.length) {
      progress.append(h('span', { class: 'grow' }), h('button', { class: 'btn small ghost', onclick: doUndo }, svg(ICONS.undo), 'Deshacer la última'));
    }
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.metaKey || e.ctrlKey || e.altKey) return;
    if ((e.key === ' ' || e.key === 'Enter') && !revealed && current) {
      e.preventDefault();
      reveal();
    } else if (revealed && ['1', '2', '3', '4'].includes(e.key)) {
      e.preventDefault();
      void rate(Number(e.key) as RatingValue);
    } else if (e.key === 'z' || e.key === 'Z') {
      void doUndo();
    }
  };
  document.addEventListener('keydown', onKey);
  showNext();

  return {
    node,
    title: 'Repasar',
    cleanup: () => {
      document.removeEventListener('keydown', onKey);
      window.clearInterval(tick);
    },
  };
};

function relTime(ms: number): string {
  if (ms < 3_600_000) return `en ${Math.max(1, Math.round(ms / 60_000))} min`;
  if (ms < 86_400_000) return `en ${Math.round(ms / 3_600_000)} h`;
  const d = Math.round(ms / 86_400_000);
  return d === 1 ? 'mañana' : `en ${d} días`;
}

function buildFilters(ctx: Parameters<ScreenFn>[1], asignatura?: string, tema?: string, modo?: string): HTMLElement {
  const subjects = ctx.index.asignaturas.filter((a) => a.numTarjetas > 0 && (a.estado === 'activa' || a.slug === asignatura));
  const sel = h(
    'select',
    { class: 'select', 'aria-label': 'Filtrar por asignatura' },
    h('option', { value: '' }, 'Todas'),
    subjects.map((a) => h('option', { value: a.slug, selected: a.slug === asignatura ? true : undefined }, a.abreviatura)),
  ) as HTMLSelectElement;
  const subj = asignatura ? findSubject(ctx.index, asignatura) : undefined;
  const temaSel = subj
    ? (h(
        'select',
        { class: 'select', 'aria-label': 'Filtrar por tema' },
        h('option', { value: '' }, 'Todos los temas'),
        subj.temas.filter((t) => t.numTarjetas > 0).map((t) => h('option', { value: t.slug, selected: t.slug === tema ? true : undefined }, t.titulo)),
      ) as HTMLSelectElement)
    : null;
  const m = modo || undefined;
  sel.addEventListener('change', () => go('repasar', { asignatura: sel.value || undefined, modo: m }));
  temaSel?.addEventListener('change', () => go('repasar', { asignatura, tema: temaSel.value || undefined, modo: m }));
  return h('div', { class: 'filters' }, sel, temaSel);
}
