import { describe, expect, it } from 'vitest';
import {
  buildQueue,
  capBeforeExam,
  formatInterval,
  fromStored,
  newCard,
  newIntroducedToday,
  plannedTemas,
  previewIntervals,
  review,
  requeuePosition,
  shouldRequeue,
  streak,
  toStored,
  type ReviewLogEntry,
  type StoredCard,
} from '../app/src/lib/scheduler.ts';

const MIN = 60_000;
const DAY = 86_400_000;
const T0 = new Date(2026, 10, 5, 10, 0, 0).getTime(); // 5 nov 2026 10:00 local
const opts = { fuzz: false };

describe('review (FSRS)', () => {
  it('a new card rated "Otra vez" comes back in about a minute', () => {
    const r = review('c', null, 1, T0, opts);
    expect(r.card.due - T0).toBeLessThanOrEqual(2 * MIN);
    expect(r.card.state).toBe(1); // Learning
    expect(r.log).toMatchObject({ cardId: 'c', rating: 1, stateBefore: 0, at: T0 });
  });

  it('ratings order the intervals: Otra vez < Difícil < Bien < Fácil', () => {
    const p = previewIntervals(null, T0);
    expect(p[1]).toBeLessThan(p[2]);
    expect(p[2]).toBeLessThan(p[3]);
    expect(p[3]).toBeLessThan(p[4]);
    expect(p[4]).toBeGreaterThanOrEqual(DAY); // Fácil graduates straight away
  });

  it('a new card goes through learning steps before graduating', () => {
    const a = review('c', null, 3, T0, opts); // Good -> next step (10 min)
    expect(a.card.state).toBe(1);
    expect(a.card.due - T0).toBe(10 * MIN);
    const b = review('c', a.card, 3, a.card.due, opts); // Good again -> Review
    expect(b.card.state).toBe(2);
    expect(b.card.due - a.card.due).toBeGreaterThanOrEqual(DAY);
  });

  it('intervals grow with successive "Bien" and shrink after a lapse', () => {
    let card: StoredCard | null = null;
    let now = T0;
    const intervals: number[] = [];
    for (let i = 0; i < 6; i++) {
      const r = review('c', card, 3, now, opts);
      card = r.card;
      if (card.state === 2) intervals.push(card.due - now);
      now = card.due;
    }
    for (let i = 1; i < intervals.length; i++) expect(intervals[i]).toBeGreaterThan(intervals[i - 1]);
    const lapse = review('c', card, 1, now, opts);
    expect(lapse.card.state).toBe(3); // Relearning
    expect(lapse.card.lapses).toBe(1);
    expect(lapse.card.due - now).toBeLessThanOrEqual(10 * MIN);
  });

  it('serializes and deserializes losslessly', () => {
    const r = review('c', null, 4, T0, opts);
    const round = toStored(fromStored(r.card));
    expect(round).toEqual(r.card);
    expect(JSON.parse(JSON.stringify(r.card))).toEqual(r.card);
    expect(newCard(T0).state).toBe(0);
  });

  it('caps the interval so the card is seen before the exam', () => {
    // A mature card would normally go far away; exam in 5 days.
    let card: StoredCard | null = null;
    let now = T0;
    for (let i = 0; i < 5; i++) {
      card = review('c', card, 4, now, opts).card;
      now = card.due;
    }
    const exam = new Date(now + 5 * DAY);
    const examDate = `${exam.getFullYear()}-${String(exam.getMonth() + 1).padStart(2, '0')}-${String(exam.getDate()).padStart(2, '0')}`;
    const r = review('c', card, 3, now, { ...opts, examDate });
    const capDay = new Date(r.card.due);
    expect(r.card.due).toBeLessThan(exam.getTime());
    expect(capDay.getHours()).toBe(6);
  });
});

describe('capBeforeExam', () => {
  it('does not cap when the exam is too close (avoids loops) or absent', () => {
    const due = T0 + 30 * DAY;
    expect(capBeforeExam(due, T0, null)).toBe(due);
    expect(capBeforeExam(due, T0, '2026-11-06')).toBe(due); // cap = 5 nov 06:00 < now
    expect(capBeforeExam(due, T0, '2026-11-20')).toBe(new Date(2026, 10, 19, 6).getTime());
    expect(capBeforeExam(T0 + DAY, T0, '2026-11-20')).toBe(T0 + DAY); // already earlier
  });
});

describe('formatInterval', () => {
  it('formats in Spanish units', () => {
    expect(formatInterval(30_000)).toBe('1 min');
    expect(formatInterval(10 * MIN)).toBe('10 min');
    expect(formatInterval(3 * 60 * MIN)).toBe('3 h');
    expect(formatInterval(2 * DAY)).toBe('2 d');
    expect(formatInterval(45 * DAY)).toBe('1,5 mes');
    expect(formatInterval(400 * DAY)).toBe('1,1 año');
  });
});

describe('buildQueue', () => {
  const cards = [
    { id: 'a/1/x', asignatura: 'a', tema: '1' },
    { id: 'a/1/y', asignatura: 'a', tema: '1' },
    { id: 'a/2/z', asignatura: 'a', tema: '2' },
    { id: 'b/1/w', asignatura: 'b', tema: '1' },
    { id: 'b/1/v', asignatura: 'b', tema: '1' },
  ];
  const st = (due: number, state: 0 | 1 | 2 | 3 = 2): StoredCard => ({ ...newCard(T0), due, state, reps: 1 });
  const states = new Map<string, StoredCard>([
    ['a/1/x', st(T0 - DAY)],
    ['a/2/z', st(T0 - 2 * DAY)],
    ['b/1/w', st(T0 + DAY)],
  ]);

  it('puts due cards first (oldest first) and limits new cards', () => {
    const q = buildQueue(cards, states, { now: T0, newLimit: 1 });
    expect(q.due.map((c) => c.id)).toEqual(['a/2/z', 'a/1/x']);
    expect(q.fresh.map((c) => c.id)).toEqual(['a/1/y']);
    expect(q.ahead).toEqual([]);
  });
  it('filters by subject and tema', () => {
    expect(buildQueue(cards, states, { now: T0, newLimit: 10, asignatura: 'b' }).fresh.map((c) => c.id)).toEqual(['b/1/v']);
    expect(buildQueue(cards, states, { now: T0, newLimit: 10, asignatura: 'a', tema: '2' }).due.map((c) => c.id)).toEqual(['a/2/z']);
  });
  it('can review ahead (not yet due) when asked', () => {
    expect(buildQueue(cards, states, { now: T0, newLimit: 0, ahead: true }).ahead.map((c) => c.id)).toEqual(['b/1/w']);
  });
  it('never returns a negative number of new cards', () => {
    expect(buildQueue(cards, states, { now: T0, newLimit: -3 }).fresh).toEqual([]);
  });
});

describe('session helpers', () => {
  const log = (cardId: string, at: number, stateBefore: 0 | 2 = 0): ReviewLogEntry => ({ cardId, at, stateBefore, rating: 3, due: at, scheduledDays: 0, stability: 1, difficulty: 5 });

  it('counts distinct new cards introduced today', () => {
    const l = [log('x', T0), log('x', T0 + MIN), log('y', T0 + 2 * MIN), log('z', T0 - DAY), log('w', T0, 2)];
    expect(newIntroducedToday(l, T0 + 3 * MIN)).toBe(2);
  });
  it('re-queues cards that are due again within the session horizon', () => {
    const r = review('c', null, 1, T0, opts);
    expect(shouldRequeue(r.card, T0)).toBe(true);
    const e = review('c', null, 4, T0, opts);
    expect(shouldRequeue(e.card, T0)).toBe(false);
  });
  it('computes the study streak', () => {
    const l = [log('a', T0), log('b', T0 - DAY), log('c', T0 - 2 * DAY), log('d', T0 - 4 * DAY)];
    expect(streak(l, T0)).toBe(3);
    expect(streak(l, T0 + DAY)).toBe(3); // nothing yet today: streak still alive
    expect(streak(l, T0 + 2 * DAY)).toBe(0);
    expect(streak([], T0)).toBe(0);
  });
});

describe('new-card priority from the plan', () => {
  const cards = [
    { id: 'calc/03/a', asignatura: 'calc', tema: '03' },
    { id: 'prog/01/a', asignatura: 'prog', tema: '01' },
    { id: 'prog/01/b', asignatura: 'prog', tema: '01' },
    { id: 'alg/01/a', asignatura: 'alg', tema: '01' },
  ];
  const plan = {
    semanas: [
      {
        dias: [
          { fecha: '2026-11-05', items: [{ asignatura: '*' }, { asignatura: 'alg', tema: '01' }, { asignatura: 'prog', tema: '01' }] },
          { fecha: '2026-11-06', items: [{ asignatura: 'calc', tema: '03' }] },
        ],
      },
    ],
  };
  it('collects planned temas up to today in order', () => {
    expect(plannedTemas(plan, '2026-11-05')).toEqual(['alg/01', 'prog/01']);
    expect(plannedTemas(plan, '2026-11-06')).toEqual(['alg/01', 'prog/01', 'calc/03']);
    expect(plannedTemas(null, '2026-11-06')).toEqual([]);
  });
  it('introduces new cards from planned temas first', () => {
    const q = buildQueue(cards, new Map(), { now: T0, newLimit: 3, priority: plannedTemas(plan, '2026-11-05') });
    expect(q.fresh.map((c) => c.id)).toEqual(['alg/01/a', 'prog/01/a', 'prog/01/b']);
  });
});

describe('requeuePosition', () => {
  it('spaces learning cards by their due time', () => {
    expect(requeuePosition(60_000, 50)).toBe(3); // 1 min -> ~3 cards later
    expect(requeuePosition(10 * 60_000, 50)).toBe(30); // 10 min -> ~30 cards later
    expect(requeuePosition(10 * 60_000, 5)).toBe(5); // short queue: at the end
    expect(requeuePosition(0, 10)).toBe(2); // never immediately
  });
});
