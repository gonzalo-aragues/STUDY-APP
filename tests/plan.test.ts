import { describe, expect, it } from 'vitest';
import { daysBetween } from '../shared/dates.ts';
import { allocate, DEFAULT_CONFIG, generatePlan, hoursForDay, splitBlocks, temaUnits, type PlanSubject, type PlanTema } from '../scripts/lib/plan.ts';
import { validateAgainst } from '../scripts/lib/validate.ts';

function tema(slug: string, horas = 6, material = true): PlanTema {
  return {
    slug,
    titulo: slug,
    horas,
    secciones: material ? ['La idea', 'Definición', 'Propiedades', 'Ejemplos resueltos'] : [],
    ejercicios: material ? { basico: [1, 2, 3, 4], medio: [5, 6, 7], examen: [8, 9] } : { basico: [], medio: [], examen: [] },
    tieneMaterial: material,
  };
}

const SUBJECTS: PlanSubject[] = [
  { slug: 'prog1', nombre: 'Programación 1', abreviatura: 'PROG1', dificultad: 4, examen: '2026-12-22', temas: ['01-a', '02-b', '03-c', '04-d', '05-e'].map((s) => tema(s, 5)) },
  { slug: 'algebra', nombre: 'Álgebra', abreviatura: 'Álgebra', dificultad: 4, examen: '2027-01-09', temas: [tema('01-matrices', 9), tema('02-estructuras', 9)] },
  { slug: 'calculo', nombre: 'Cálculo', abreviatura: 'Cálculo', dificultad: 4, examen: '2027-01-12', temas: [tema('01-complejos', 7), tema('02-sucesiones', 7), tema('03-series', 8)] },
  { slug: 'fae', nombre: 'FAE', abreviatura: 'FAE', dificultad: 2, examen: '2027-01-14', temas: [] },
  { slug: 'ic', nombre: 'IC', abreviatura: 'IC', dificultad: 3, examen: '2027-01-16', temas: [] },
];

const CONFIG = { ...DEFAULT_CONFIG, diasEspeciales: { '2026-12-25': 1, '2027-01-01': 1 } };

describe('splitBlocks', () => {
  it('cuts hours into 1–2 h blocks that add up', () => {
    expect(splitBlocks(3)).toEqual([1.5, 1.5]);
    expect(splitBlocks(5)).toEqual([2, 1.5, 1.5]);
    expect(splitBlocks(1)).toEqual([1]);
    expect(splitBlocks(0)).toEqual([]);
    for (const h of [0.5, 1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 6, 7]) {
      const b = splitBlocks(h);
      expect(b.reduce((a, x) => a + x, 0)).toBeCloseTo(h);
      expect(Math.max(...b)).toBeLessThanOrEqual(2.5);
    }
  });
});

describe('hoursForDay', () => {
  it('uses base hours, intensive hours in the last 10 days and special days', () => {
    expect(hoursForDay('2026-11-05', SUBJECTS, CONFIG)).toBe(3);
    expect(hoursForDay('2026-12-12', SUBJECTS, CONFIG)).toBe(5); // 10 days before PROG1
    expect(hoursForDay('2026-12-11', SUBJECTS, CONFIG)).toBe(3);
    expect(hoursForDay('2026-12-25', SUBJECTS, CONFIG)).toBe(1);
  });
});

describe('allocate', () => {
  const days = allocate({ desde: '2026-11-05', subjects: SUBJECTS, config: CONFIG });
  const hoursOf = (slug: string, from: string, to: string) =>
    days.filter((d) => d.fecha >= from && d.fecha <= to).flatMap((d) => d.blocks).filter((b) => b.asignatura === slug).reduce((a, b) => a + b.horas, 0);

  it('covers every day until the last exam', () => {
    expect(days[0].fecha).toBe('2026-11-05');
    expect(days[days.length - 1].fecha).toBe('2027-01-16');
    expect(days.length).toBe(daysBetween('2026-11-05', '2027-01-16') + 1);
  });
  it('never assigns more hours than available and never studies a subject after its exam', () => {
    for (const d of days) {
      expect(d.blocks.reduce((a, b) => a + b.horas, 0)).toBeCloseTo(d.horas);
      for (const b of d.blocks) expect(SUBJECTS.find((s) => s.slug === b.asignatura)!.examen > d.fecha).toBe(true);
    }
  });
  it('gives every subject time from the start (behind in all of them)', () => {
    for (const s of SUBJECTS) expect(hoursOf(s.slug, '2026-11-05', '2026-11-30')).toBeGreaterThan(0);
  });
  it('makes the closest exam dominate its last 10 days', () => {
    const prog = hoursOf('prog1', '2026-12-12', '2026-12-21');
    const total = days.filter((d) => d.fecha >= '2026-12-12' && d.fecha <= '2026-12-21').reduce((a, d) => a + d.horas, 0);
    expect(prog / total).toBeGreaterThan(0.55);
  });
  it('rests on an exam day unless another exam is within 4 days', () => {
    const d22 = days.find((d) => d.fecha === '2026-12-22')!;
    expect(d22.examenes).toEqual(['prog1']);
    expect(d22.horas).toBe(0);
    const d12 = days.find((d) => d.fecha === '2027-01-12')!; // Cálculo, FAE on the 14th
    expect(d12.horas).toBe(1.5);
    expect(d12.blocks.every((b) => b.asignatura === 'fae')).toBe(true);
  });
  it('still gives time to later exams while one is in its final stretch (overlap)', () => {
    expect(hoursOf('calculo', '2027-01-02', '2027-01-08')).toBeGreaterThan(5);
    expect(hoursOf('ic', '2027-01-10', '2027-01-15')).toBeGreaterThan(3);
  });
});

describe('temaUnits', () => {
  it('splits a tema with material into reading + three exercise levels with numbers', () => {
    const u = temaUnits(tema('01-x', 6));
    expect(u.map((x) => x.tipo)).toContain('aprender');
    expect(u.some((x) => x.label.includes('básicos 1–4'))).toBe(true);
    expect(u.some((x) => x.label.includes('tipo examen 8–9'))).toBe(true);
    expect(u.reduce((a, x) => a + x.horas, 0)).toBeCloseTo(6);
  });
  it('falls back to apuntes de clase when there is no material', () => {
    expect(temaUnits(tema('01-x', 6, false))[0].label).toMatch(/apuntes de clase/);
  });
});

describe('generatePlan', () => {
  const { plan, markdown } = generatePlan({ desde: '2026-11-05', subjects: SUBJECTS, config: CONFIG });
  const allDays = plan.semanas.flatMap((w) => w.dias);

  it('produces a schema-valid plan.json', () => {
    expect(validateAgainst('plan', plan)).toEqual([]);
  });
  it('groups days in Monday–Sunday weeks', () => {
    expect(plan.semanas[0].inicio).toBe('2026-11-02');
    expect(plan.semanas[0].dias[0].fecha).toBe('2026-11-05');
    for (const w of plan.semanas) expect(daysBetween(w.inicio, w.fin)).toBe(6);
  });
  it('marks exams, simulacros and final review', () => {
    const d = (f: string) => allDays.find((x) => x.fecha === f)!;
    expect(d('2026-12-22').items.some((i) => i.tipo === 'examen' && i.asignatura === 'prog1')).toBe(true);
    expect(d('2026-12-21').items.some((i) => i.asignatura === 'prog1' && /Repaso final/.test(i.texto))).toBe(true);
    expect(allDays.filter((x) => x.fecha === '2026-12-19').flatMap((x) => x.items).some((i) => i.tipo === 'simulacro' && i.asignatura === 'prog1')).toBe(true);
  });
  it('covers every tema of every subject before its exam', () => {
    for (const s of SUBJECTS.filter((x) => x.temas.length)) {
      for (const t of s.temas) {
        expect(allDays.some((d) => d.fecha < s.examen && d.items.some((i) => i.asignatura === s.slug && i.tema === t.slug))).toBe(true);
      }
    }
  });
  it('asks to prepare material for subjects without temas', () => {
    expect(allDays.flatMap((d) => d.items).some((i) => i.asignatura === 'ic' && i.tipo === 'preparar')).toBe(true);
  });
  it('item hours add up to the day (±0.5 rounding per item)', () => {
    for (const d of allDays) {
      const sum = d.items.reduce((a, i) => a + (i.horas ?? 0), 0);
      expect(Math.abs(sum - (d.horas ?? 0))).toBeLessThanOrEqual(0.5 * d.items.length);
    }
  });
  it('renders a readable markdown with one section per week', () => {
    expect(markdown).toMatch(/^# Plan de estudio/);
    expect((markdown.match(/^## Semana /gm) ?? []).length).toBe(plan.semanas.length);
    expect(markdown).toContain('PROG1');
  });
});
