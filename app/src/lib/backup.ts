// Backup file format (Exportar / Importar copia de seguridad). Pure validation, no I/O.
import type { ReviewLogEntry, StoredCard } from './scheduler.ts';

export interface CardRecord {
  id: string;
  card: StoredCard;
}

export interface TaskRecord {
  key: string; // "<tareaId>/<pasoId>"
  done: boolean;
  at: number;
}

export interface SettingRecord {
  key: string;
  value: unknown;
}

export interface Backup {
  app: 'study-app';
  version: 1;
  exportado: string; // ISO timestamp
  cards: CardRecord[];
  reviews: ReviewLogEntry[];
  tasks: TaskRecord[];
  settings: SettingRecord[];
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

function checkCard(c: unknown): string | null {
  if (!isObj(c)) return 'no es un objeto';
  for (const k of ['due', 'stability', 'difficulty', 'elapsed_days', 'scheduled_days', 'reps', 'lapses', 'state']) {
    if (!isNum(c[k])) return `falta o no es número: ${k}`;
  }
  if (![0, 1, 2, 3].includes(c.state as number)) return 'state inválido';
  if (c.last_review !== null && !isNum(c.last_review)) return 'last_review inválido';
  return null;
}

/** Returns the parsed backup or throws an Error with a Spanish message. */
export function parseBackup(text: string): Backup {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('El fichero no es un JSON válido.');
  }
  if (!isObj(data) || data.app !== 'study-app') throw new Error('No parece una copia de seguridad de esta app.');
  if (data.version !== 1) throw new Error(`Versión de copia no soportada: ${String(data.version)}`);
  for (const k of ['cards', 'reviews', 'tasks', 'settings']) if (!Array.isArray(data[k])) throw new Error(`Falta la lista "${k}".`);
  const cards = data.cards as unknown[];
  cards.forEach((r, i) => {
    if (!isObj(r) || typeof r.id !== 'string') throw new Error(`Tarjeta ${i}: falta id.`);
    const e = checkCard(r.card);
    if (e) throw new Error(`Tarjeta ${r.id}: ${e}.`);
  });
  (data.reviews as unknown[]).forEach((r, i) => {
    if (!isObj(r) || typeof r.cardId !== 'string' || !isNum(r.at) || ![1, 2, 3, 4].includes(r.rating as number)) throw new Error(`Repaso ${i} inválido.`);
  });
  (data.tasks as unknown[]).forEach((r, i) => {
    if (!isObj(r) || typeof r.key !== 'string' || typeof r.done !== 'boolean') throw new Error(`Paso de tarea ${i} inválido.`);
  });
  (data.settings as unknown[]).forEach((r, i) => {
    if (!isObj(r) || typeof r.key !== 'string') throw new Error(`Ajuste ${i} inválido.`);
  });
  return data as unknown as Backup;
}

export function backupFileName(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `estudio-copia-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}.json`;
}
