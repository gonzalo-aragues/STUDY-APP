import { getSetting, setSetting } from './db.ts';

export type Theme = 'auto' | 'light' | 'dark';

export interface Settings {
  newPerDay: number;
  retention: number;
  includeArchived: boolean;
  lastBackup: number | null;
}

export const DEFAULT_SETTINGS: Settings = { newPerDay: 15, retention: 0.9, includeArchived: false, lastBackup: null };

export async function loadSettings(): Promise<Settings> {
  const out = { ...DEFAULT_SETTINGS };
  for (const k of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
    (out as Record<string, unknown>)[k] = await getSetting(k, DEFAULT_SETTINGS[k]);
  }
  return out;
}

export async function saveSetting<K extends keyof Settings>(k: K, v: Settings[K]): Promise<void> {
  await setSetting(k, v);
}

// Theme lives in localStorage (per-device convenience, read before first paint in index.html).
export function getTheme(): Theme {
  try {
    const t = localStorage.getItem('theme');
    return t === 'light' || t === 'dark' ? t : 'auto';
  } catch {
    return 'auto';
  }
}

export function applyTheme(t: Theme): void {
  try {
    if (t === 'auto') localStorage.removeItem('theme');
    else localStorage.setItem('theme', t);
  } catch {
    /* private mode: ignore */
  }
  if (t === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
}
