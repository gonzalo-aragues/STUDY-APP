import { describe, expect, it } from 'vitest';
import { parseHash, href } from '../app/src/lib/router.ts';
import { addDays, daysBetween, formatHours, formatLong, formatShort, mondayOf, relativeDays } from '../shared/dates.ts';

describe('router', () => {
  it('parses paths and query strings', () => {
    expect(parseHash('').path).toEqual(['hoy']);
    expect(parseHash('#/').path).toEqual(['hoy']);
    const r = parseHash('#/asignaturas/calculo/01-numeros-complejos/ejercicios');
    expect(r.path).toEqual(['asignaturas', 'calculo', '01-numeros-complejos', 'ejercicios']);
    const q = parseHash('#/repasar?asignatura=algebra&modo=5min');
    expect(q.path).toEqual(['repasar']);
    expect(q.query.get('asignatura')).toBe('algebra');
    expect(q.query.get('modo')).toBe('5min');
  });
  it('builds hrefs, skipping undefined params', () => {
    expect(href('repasar', { asignatura: 'algebra', tema: undefined })).toBe('#/repasar?asignatura=algebra');
    expect(href('hoy')).toBe('#/hoy');
  });
});

describe('dates (es-ES)', () => {
  it('does calendar arithmetic without time-zone surprises', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(daysBetween('2026-11-05', '2026-12-22')).toBe(47);
    expect(daysBetween('2026-11-05', '2027-01-16')).toBe(72);
    expect(daysBetween('2027-03-27', '2027-03-29')).toBe(2); // across DST change
    expect(mondayOf('2026-11-05')).toBe('2026-11-02');
    expect(mondayOf('2026-11-08')).toBe('2026-11-02');
  });
  it('formats in Spanish', () => {
    expect(formatLong('2026-11-05')).toBe('jueves 5 de noviembre');
    expect(formatShort('2026-12-22')).toBe('mar 22 dic');
    expect(formatHours(1.5)).toBe('1,5');
    expect(relativeDays(0)).toBe('hoy');
    expect(relativeDays(1)).toBe('mañana');
    expect(relativeDays(3)).toBe('en 3 días');
  });
});
