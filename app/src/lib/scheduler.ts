// Spaced-repetition scheduler: a thin, serializable wrapper around ts-fsrs (FSRS algorithm).
// Pure functions only (no DOM, no IndexedDB) so it can be unit-tested.

import { createEmptyCard, fsrs, generatorParameters, type Card, type FSRS, type Grade } from 'ts-fsrs';

/** Ratings as shown in the UI. Values match FSRS: 1 Again, 2 Hard, 3 Good, 4 Easy. */
export const RATINGS = [
  { value: 1, label: 'Otra vez', key: '1' },
  { value: 2, label: 'Difícil', key: '2' },
  { value: 3, label: 'Bien', key: '3' },
  { value: 4, label: 'Fácil', key: '4' },
] as const;
export type RatingValue = 1 | 2 | 3 | 4;

/** FSRS card states: 0 New, 1 Learning, 2 Review, 3 Relearning. */
export type CardStateKind = 0 | 1 | 2 | 3;

/** What we persist per card (JSON-friendly: dates as epoch ms). */
export interface StoredCard {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: CardStateKind;
  last_review: number | null;
}

export interface ReviewLogEntry {
  cardId: string;
  rating: RatingValue;
  at: number; // epoch ms
  stateBefore: CardStateKind;
  due: number; // new due date (epoch ms)
  scheduledDays: number;
  stability: number;
  difficulty: number;
}

export interface SchedulerOptions {
  retention?: number; // desired recall probability (0.9 by default)
  maximumInterval?: number; // days
  fuzz?: boolean;
}

const DAY = 86_400_000;
const MIN = 60_000;

let cached: { key: string; f: FSRS } | null = null;

export function getFsrs(opts: SchedulerOptions = {}): FSRS {
  const key = JSON.stringify(opts);
  if (cached?.key === key) return cached.f;
  const f = fsrs(
    generatorParameters({
      request_retention: opts.retention ?? 0.9,
      maximum_interval: opts.maximumInterval ?? 365,
      enable_fuzz: opts.fuzz ?? true,
      enable_short_term: true,
      learning_steps: ['1m', '10m'],
      relearning_steps: ['10m'],
    }),
  );
  cached = { key, f };
  return f;
}

export function toStored(c: Card): StoredCard {
  return {
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state as CardStateKind,
    last_review: c.last_review ? c.last_review.getTime() : null,
  };
}

export function fromStored(s: StoredCard): Card {
  return {
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: s.elapsed_days,
    scheduled_days: s.scheduled_days,
    learning_steps: s.learning_steps ?? 0,
    reps: s.reps,
    lapses: s.lapses,
    state: s.state,
    last_review: s.last_review === null ? undefined : new Date(s.last_review),
  } as Card;
}

export function newCard(now: number): StoredCard {
  return toStored(createEmptyCard(new Date(now)));
}

/**
 * If an exam is coming, make sure the card is seen again before it: the due date is capped to
 * 06:00 of the day before the exam — but only when that moment is still >12 h away (otherwise
 * we would loop forever showing the card again right away).
 */
export function capBeforeExam(due: number, now: number, examDate: string | null | undefined): number {
  if (!examDate) return due;
  const [y, m, d] = examDate.split('-').map(Number);
  const cap = new Date(y, m - 1, d - 1, 6, 0, 0, 0).getTime();
  if (cap - now < 12 * 60 * MIN) return due;
  return Math.min(due, cap);
}

export interface ReviewResult {
  card: StoredCard;
  log: ReviewLogEntry;
}

export function review(
  cardId: string,
  current: StoredCard | null | undefined,
  rating: RatingValue,
  now: number,
  opts: SchedulerOptions & { examDate?: string | null } = {},
): ReviewResult {
  const f = getFsrs({ retention: opts.retention, maximumInterval: opts.maximumInterval, fuzz: opts.fuzz });
  const before = current ?? newCard(now);
  const { card } = f.next(fromStored(before), new Date(now), rating as Grade);
  const stored = toStored(card);
  stored.due = capBeforeExam(stored.due, now, opts.examDate);
  return {
    card: stored,
    log: {
      cardId,
      rating,
      at: now,
      stateBefore: before.state,
      due: stored.due,
      scheduledDays: stored.scheduled_days,
      stability: stored.stability,
      difficulty: stored.difficulty,
    },
  };
}

/** Due date that each button would produce (for the labels under the buttons). */
export function previewIntervals(current: StoredCard | null | undefined, now: number, opts: SchedulerOptions & { examDate?: string | null } = {}): Record<RatingValue, number> {
  const out = {} as Record<RatingValue, number>;
  for (const r of [1, 2, 3, 4] as RatingValue[]) out[r] = review('preview', current, r, now, { ...opts, fuzz: false }).card.due - now;
  return out;
}

/** "1 min", "10 min", "3 h", "2 d", "1,5 mes", "1 año" */
export function formatInterval(ms: number): string {
  if (ms < 60 * MIN) return `${Math.max(1, Math.round(ms / MIN))} min`;
  if (ms < DAY) return `${Math.round(ms / (60 * MIN))} h`;
  const days = ms / DAY;
  if (days < 30) return `${Math.round(days)} d`;
  if (days < 365) return `${String(Math.round((days / 30) * 10) / 10).replace('.', ',')} mes`;
  return `${String(Math.round((days / 365) * 10) / 10).replace('.', ',')} año${days >= 730 ? 's' : ''}`;
}

export function isDue(card: StoredCard, now: number): boolean {
  return card.due <= now;
}

// ---------------------------------------------------------------- queue

export interface QueueCard {
  id: string;
  asignatura: string;
  tema: string;
}

export interface QueueOptions {
  now: number;
  newLimit: number; // how many new cards may still be introduced today
  asignatura?: string;
  tema?: string;
  ahead?: boolean; // review ahead: include not-yet-due cards (lowest due first)
  aheadLimit?: number;
  /** "asignatura/tema" keys in priority order (e.g. temas the plan has already scheduled). New
   *  cards from these temas are introduced first, in this order; the rest keep content order. */
  priority?: string[];
}

export interface Queue<T extends QueueCard> {
  due: T[];
  fresh: T[];
  ahead: T[];
}

/**
 * Builds the review queue: due cards (oldest due first, learning cards before reviews when tied),
 * then up to `newLimit` new cards in content order. With `ahead`, the next not-yet-due cards.
 */
export function buildQueue<T extends QueueCard>(cards: T[], states: Map<string, StoredCard>, o: QueueOptions): Queue<T> {
  const pool = cards.filter((c) => (!o.asignatura || c.asignatura === o.asignatura) && (!o.tema || c.tema === o.tema));
  const due: T[] = [];
  const fresh: T[] = [];
  const later: T[] = [];
  for (const c of pool) {
    const s = states.get(c.id);
    if (!s || s.state === 0) fresh.push(c);
    else if (s.due <= o.now) due.push(c);
    else later.push(c);
  }
  due.sort((a, b) => states.get(a.id)!.due - states.get(b.id)!.due);
  if (o.priority?.length) {
    const rank = new Map(o.priority.map((k, i) => [k, i]));
    const r = (c: T) => rank.get(`${c.asignatura}/${c.tema}`) ?? Infinity;
    fresh.sort((a, b) => r(a) - r(b)); // stable: content order is kept within a tema / for the rest
  }
  later.sort((a, b) => states.get(a.id)!.due - states.get(b.id)!.due);
  return {
    due,
    fresh: fresh.slice(0, Math.max(0, o.newLimit)),
    ahead: o.ahead ? later.slice(0, o.aheadLimit ?? 20) : [],
  };
}

/** New cards introduced today (according to the log), to enforce the daily new-card limit. */
/** Temas the plan has scheduled up to `today` (inclusive), in order of first appearance. */
export function plannedTemas(plan: { semanas: { dias: { fecha: string; items: { asignatura: string; tema?: string }[] }[] }[] } | null, today: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const w of plan?.semanas ?? [])
    for (const d of w.dias) {
      if (d.fecha > today) return out;
      for (const it of d.items) {
        if (!it.tema) continue;
        const k = `${it.asignatura}/${it.tema}`;
        if (!seen.has(k)) {
          seen.add(k);
          out.push(k);
        }
      }
    }
  return out;
}

export function newIntroducedToday(log: ReviewLogEntry[], now: number): number {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const ids = new Set<string>();
  for (const l of log) if (l.at >= start.getTime() && l.stateBefore === 0) ids.add(l.cardId);
  return ids.size;
}

/**
 * Within a session, a card rated so that it is due again soon (learning steps: 1–10 min) is shown
 * again later in the same session. Returns true if it should be re-queued.
 */
export function shouldRequeue(card: StoredCard, now: number, horizonMin = 20): boolean {
  return card.due - now <= horizonMin * MIN;
}

/** Where to re-insert a learning card in the session queue: ~20 s per card, at least 2 cards later. */
export function requeuePosition(delayMs: number, queueLength: number): number {
  return Math.min(queueLength, Math.max(2, Math.ceil(delayMs / 20_000)));
}

/** Study streak: consecutive days (ending today or yesterday) with at least one review. */
export function streak(log: ReviewLogEntry[], now: number): number {
  const days = new Set(log.map((l) => dayKey(l.at)));
  let n = 0;
  const d = new Date(now);
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

function dayKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
