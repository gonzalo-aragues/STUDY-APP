// On-device progress storage (IndexedDB). Everything the student does lives here:
// card states, review log, ticked task steps and settings.
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Backup, CardRecord, SettingRecord, TaskRecord } from './backup.ts';
import type { ReviewLogEntry, StoredCard } from './scheduler.ts';

interface StudyDB extends DBSchema {
  cards: { key: string; value: CardRecord };
  reviews: { key: number; value: ReviewLogEntry & { seq?: number }; indexes: { at: number; cardId: string } };
  tasks: { key: string; value: TaskRecord };
  settings: { key: string; value: SettingRecord };
}

export const DB_NAME = 'study-app';
let dbp: Promise<IDBPDatabase<StudyDB>> | null = null;

export function db(): Promise<IDBPDatabase<StudyDB>> {
  if (!dbp) {
    dbp = openDB<StudyDB>(DB_NAME, 1, {
      upgrade(d) {
        d.createObjectStore('cards', { keyPath: 'id' });
        const r = d.createObjectStore('reviews', { keyPath: 'seq', autoIncrement: true });
        r.createIndex('at', 'at');
        r.createIndex('cardId', 'cardId');
        d.createObjectStore('tasks', { keyPath: 'key' });
        d.createObjectStore('settings', { keyPath: 'key' });
      },
    });
  }
  return dbp;
}

/** For tests: forget the cached connection. */
export async function closeDb(): Promise<void> {
  if (dbp) (await dbp).close();
  dbp = null;
}

export async function getAllCardStates(): Promise<Map<string, StoredCard>> {
  const all = await (await db()).getAll('cards');
  return new Map(all.map((r) => [r.id, r.card]));
}

/** Saves the new card state and the review log entry atomically. Returns the log key (for undo). */
export async function saveReview(id: string, card: StoredCard, log: ReviewLogEntry): Promise<number> {
  const tx = (await db()).transaction(['cards', 'reviews'], 'readwrite');
  void tx.objectStore('cards').put({ id, card });
  const key = await tx.objectStore('reviews').add(log);
  await tx.done;
  return key as number;
}

/** Undo: restore the previous state (or delete it if the card was new) and drop the log entry. */
export async function undoReview(id: string, previous: StoredCard | null, logKey: number): Promise<void> {
  const tx = (await db()).transaction(['cards', 'reviews'], 'readwrite');
  if (previous) void tx.objectStore('cards').put({ id, card: previous });
  else void tx.objectStore('cards').delete(id);
  void tx.objectStore('reviews').delete(logKey);
  await tx.done;
}

export async function getReviewLog(since = 0): Promise<ReviewLogEntry[]> {
  const d = await db();
  return d.getAllFromIndex('reviews', 'at', IDBKeyRange.lowerBound(since));
}

export async function getTaskChecks(): Promise<Map<string, boolean>> {
  const all = await (await db()).getAll('tasks');
  return new Map(all.map((t) => [t.key, t.done]));
}

export async function setTaskCheck(key: string, done: boolean): Promise<void> {
  await (await db()).put('tasks', { key, done, at: Date.now() });
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const r = await (await db()).get('settings', key);
  return r === undefined ? fallback : (r.value as T);
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await (await db()).put('settings', { key, value });
}

export async function exportBackup(now = new Date()): Promise<Backup> {
  const d = await db();
  const reviews = (await d.getAll('reviews')).map(({ seq: _seq, ...r }) => r);
  return {
    app: 'study-app',
    version: 1,
    exportado: now.toISOString(),
    cards: await d.getAll('cards'),
    reviews,
    tasks: await d.getAll('tasks'),
    settings: await d.getAll('settings'),
  };
}

/** Replaces ALL local progress with the backup contents (single transaction). */
export async function importBackup(b: Backup): Promise<void> {
  const d = await db();
  const tx = d.transaction(['cards', 'reviews', 'tasks', 'settings'], 'readwrite');
  await Promise.all([tx.objectStore('cards').clear(), tx.objectStore('reviews').clear(), tx.objectStore('tasks').clear(), tx.objectStore('settings').clear()]);
  for (const c of b.cards) void tx.objectStore('cards').put(c);
  for (const r of b.reviews) {
    const { seq: _seq, ...rest } = r as ReviewLogEntry & { seq?: number };
    void tx.objectStore('reviews').add(rest);
  }
  for (const t of b.tasks) void tx.objectStore('tasks').put(t);
  for (const s of b.settings) void tx.objectStore('settings').put(s);
  await tx.done;
}

/** Ask the browser not to evict our storage (best effort). */
export async function requestPersistence(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch {
    /* ignore */
  }
  return false;
}
