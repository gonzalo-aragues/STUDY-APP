import { describe, expect, it } from 'vitest';
import { buildIcs } from '../app/src/lib/ics.ts';

describe('buildIcs', () => {
  const ics = buildIcs(
    [
      { uid: 'prog1-2026-12-22', titulo: 'Examen de Programación 1', fecha: '2026-12-22' },
      { uid: 'calculo-2027-01-12', titulo: 'Examen de Cálculo, final', fecha: '2027-01-12', hora: '09:30', lugar: 'Aula 1; edificio Ada' },
    ],
    new Date('2026-11-05T10:00:00Z'),
  );
  const lines = ics.split('\r\n');
  it('is a well-formed calendar with one event per exam', () => {
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
    expect(lines.filter((l) => l === 'BEGIN:VEVENT')).toHaveLength(2);
    expect(lines.filter((l) => l === 'END:VEVENT')).toHaveLength(2);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(lines).toContain('DTSTAMP:20261105T100000Z');
  });
  it('uses all-day events without time and timed events with time', () => {
    expect(lines).toContain('DTSTART;VALUE=DATE:20261222');
    expect(lines).toContain('DTEND;VALUE=DATE:20261223');
    expect(lines).toContain('DTSTART:20270112T093000');
    expect(lines).toContain('DTEND:20270112T123000');
  });
  it('escapes commas and semicolons and adds a reminder', () => {
    expect(lines).toContain('SUMMARY:Examen de Cálculo\\, final');
    expect(lines).toContain('LOCATION:Aula 1\\; edificio Ada');
    expect(lines.filter((l) => l === 'TRIGGER:-P1D')).toHaveLength(2);
  });
  it('rolls over month/year for the end date of all-day events', () => {
    expect(buildIcs([{ uid: 'x', titulo: 'x', fecha: '2026-12-31' }])).toContain('DTEND;VALUE=DATE:20270101');
  });
});
