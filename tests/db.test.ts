import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { backupFileName, parseBackup } from '../app/src/lib/backup.ts';
import { closeDb, DB_NAME, exportBackup, getAllCardStates, getReviewLog, getSetting, getTaskChecks, importBackup, saveReview, setSetting, setTaskCheck, undoReview } from '../app/src/lib/db.ts';
import { review } from '../app/src/lib/scheduler.ts';

const T0 = new Date(2026, 10, 5, 10).getTime();

beforeEach(async () => {
  await closeDb();
  await new Promise<void>((res) => {
    const r = indexedDB.deleteDatabase(DB_NAME);
    r.onsuccess = r.onerror = r.onblocked = () => res();
  });
});

describe('IndexedDB progress store', () => {
  it('saves reviews, task checks and settings', async () => {
    const r = review('calculo/01-x/a', null, 3, T0, { fuzz: false });
    await saveReview('calculo/01-x/a', r.card, r.log);
    await setTaskCheck('tarea/p1', true);
    await setSetting('newPerDay', 12);
    expect((await getAllCardStates()).get('calculo/01-x/a')).toEqual(r.card);
    expect(await getReviewLog()).toHaveLength(1);
    expect((await getTaskChecks()).get('tarea/p1')).toBe(true);
    expect(await getSetting('newPerDay', 20)).toBe(12);
    expect(await getSetting('missing', 'x')).toBe('x');
  });

  it('undo restores the previous state', async () => {
    const a = review('c', null, 3, T0, { fuzz: false });
    await saveReview('c', a.card, a.log);
    const b = review('c', a.card, 1, T0 + 60_000, { fuzz: false });
    const key = await saveReview('c', b.card, b.log);
    await undoReview('c', a.card, key);
    expect((await getAllCardStates()).get('c')).toEqual(a.card);
    expect(await getReviewLog()).toHaveLength(1);
    const k1 = (await getReviewLog())[0] as unknown as { seq: number };
    await undoReview('c', null, k1.seq);
    expect((await getAllCardStates()).has('c')).toBe(false);
  });

  it('export -> import round-trips everything (and import replaces)', async () => {
    const r = review('c', null, 4, T0, { fuzz: false });
    await saveReview('c', r.card, r.log);
    await setTaskCheck('t/p1', true);
    await setSetting('theme', 'dark');
    const backup = await exportBackup(new Date(T0));
    const text = JSON.stringify(backup);

    await setTaskCheck('t/p2', true); // will be wiped by import
    await importBackup(parseBackup(text));
    expect((await getAllCardStates()).get('c')).toEqual(r.card);
    expect(await getReviewLog()).toHaveLength(1);
    expect([...(await getTaskChecks()).keys()]).toEqual(['t/p1']);
    expect(await getSetting('theme', 'auto')).toBe('dark');
    // Exporting again gives the same data
    const again = await exportBackup(new Date(T0));
    expect(again).toEqual(backup);
  });
});

describe('parseBackup', () => {
  it('rejects junk with Spanish messages', () => {
    expect(() => parseBackup('no json')).toThrow(/JSON válido/);
    expect(() => parseBackup('{"app":"otra"}')).toThrow(/copia de seguridad/);
    expect(() => parseBackup('{"app":"study-app","version":2}')).toThrow(/Versión/);
    expect(() => parseBackup('{"app":"study-app","version":1,"cards":[],"reviews":[],"tasks":[]}')).toThrow(/settings/);
    const bad = { app: 'study-app', version: 1, cards: [{ id: 'x', card: { due: 'mañana' } }], reviews: [], tasks: [], settings: [] };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(/Tarjeta x/);
  });
  it('names the file with the date', () => {
    expect(backupFileName(new Date(2026, 10, 5))).toBe('estudio-copia-2026-11-05.json');
  });
});
