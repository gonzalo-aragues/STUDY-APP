import type { ContentIndex } from '../../../shared/types.ts';
import { toISODate } from '../../../shared/dates.ts';
import type { Route } from './router.ts';

export interface Ctx {
  index: ContentIndex;
  now: () => number;
  today: () => string;
}

export interface Screen {
  node: Node;
  title?: string;
  cleanup?: () => void;
}

export type ScreenFn = (route: Route, ctx: Ctx) => Promise<Screen>;

export function makeCtx(index: ContentIndex): Ctx {
  // ?hoy=YYYY-MM-DD in the URL (before the #) fakes the date: handy for screenshots/tests.
  const fake = new URLSearchParams(location.search).get('hoy');
  const offset = fake && /^\d{4}-\d{2}-\d{2}$/.test(fake) ? new Date(`${fake}T10:00:00`).getTime() - Date.now() : 0;
  const now = () => Date.now() + offset;
  return { index, now, today: () => toISODate(new Date(now())) };
}

/** Small stable hash for keys derived from text. */
export function hashKey(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
