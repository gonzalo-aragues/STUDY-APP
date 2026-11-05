// Date helpers on plain YYYY-MM-DD strings (local calendar days, no time zones).

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: string, n: number): string {
  const d = parseISODate(s);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Whole calendar days from a to b (b - a). */
export function daysBetween(a: string, b: string): number {
  const ms = parseISODate(b).getTime() - parseISODate(a).getTime();
  return Math.round(ms / 86_400_000);
}

/** 0 = Monday ... 6 = Sunday */
export function weekdayMon0(s: string): number {
  return (parseISODate(s).getDay() + 6) % 7;
}

export function mondayOf(s: string): string {
  return addDays(s, -weekdayMon0(s));
}

const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const DIAS_CORTOS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];

/** "jueves 5 de noviembre" */
export function formatLong(s: string): string {
  const d = parseISODate(s);
  return `${DIAS[weekdayMon0(s)]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

/** "jue 5 nov" */
export function formatShort(s: string): string {
  const d = parseISODate(s);
  return `${DIAS_CORTOS[weekdayMon0(s)]} ${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`;
}

/** "5 nov 2026" */
export function formatWithYear(s: string): string {
  const d = parseISODate(s);
  return `${d.getDate()} ${MESES_CORTOS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "1,5" — Spanish decimal comma, at most one decimal. */
export function formatHours(h: number): string {
  const r = Math.round(h * 10) / 10;
  return String(r).replace('.', ',');
}

/** "hoy", "mañana", "en 3 días", "hace 2 días" */
export function relativeDays(n: number): string {
  if (n === 0) return 'hoy';
  if (n === 1) return 'mañana';
  if (n === -1) return 'ayer';
  return n > 0 ? `en ${n} días` : `hace ${-n} días`;
}
