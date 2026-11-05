import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { slugify, temaSlug } from '../scripts/lib/slug.ts';
import { parseExamArg } from '../scripts/nueva-asignatura.ts';
import { archiveSemester } from '../scripts/nuevo-semestre.ts';
import { validateRepo } from '../scripts/lib/validate.ts';
import { makeRepo, validMeta } from './helpers.ts';

describe('slugify', () => {
  it('removes accents and symbols', () => {
    expect(slugify('Álgebra Lineal')).toBe('algebra-lineal');
    expect(slugify('Programación 1')).toBe('programacion-1');
    expect(slugify('C++ básico: tipos')).toBe('cpp-basico-tipos');
    expect(temaSlug(2, 'Estructuras algebraicas')).toBe('02-estructuras-algebraicas');
  });
});

describe('parseExamArg', () => {
  it('parses date, time and type', () => {
    expect(parseExamArg('2027-01-12')).toEqual({ fecha: '2027-01-12', tipo: 'final' });
    expect(parseExamArg('2027-01-12@09:30')).toEqual({ fecha: '2027-01-12', hora: '09:30', tipo: 'final' });
    expect(parseExamArg('2027-06-20:recuperacion')).toEqual({ fecha: '2027-06-20', tipo: 'recuperacion' });
    expect(() => parseExamArg('2027-02-30')).toThrow();
    expect(() => parseExamArg('12/01/2027')).toThrow();
  });
});

describe('archiveSemester (nuevo-semestre)', () => {
  const files = {
    'asignaturas/algebra/meta.json': validMeta,
    'asignaturas/algebra/temas/01-matrices/explicacion.md': '# Matrices',
    'asignaturas/discreta/meta.json': { ...validMeta, slug: 'discreta', semestre: '2026-27-S2' },
    'plan/plan.md': '# plan',
    'plan/plan.json': '{}',
    'plan/tareas.json': {
      tareas: [
        { id: 'a', titulo: 'x', asignatura: 'algebra', creada: '2026-11-05', pasos: [{ id: 'p1', texto: 't', minutos: 20 }] },
        { id: 'b', titulo: 'y', asignatura: 'discreta', creada: '2026-11-05', pasos: [{ id: 'p1', texto: 't', minutos: 20 }] },
      ],
    },
  };

  it('dry-run changes nothing', () => {
    const root = makeRepo(files);
    const r = archiveSemester('2026-27-S1', root, true);
    expect(r.moved.map((m) => m.slug)).toEqual(['algebra']);
    expect(existsSync(join(root, 'asignaturas/algebra/meta.json'))).toBe(true);
  });

  it('moves only that semester, keeps content, archives plan and tareas, and stays valid', () => {
    const root = makeRepo(files);
    const r = archiveSemester('2026-27-S1', root);
    expect(r).toMatchObject({ planMoved: true, tareasArchived: 1 });
    expect(existsSync(join(root, 'asignaturas/algebra'))).toBe(false);
    expect(existsSync(join(root, 'asignaturas/discreta/meta.json'))).toBe(true);
    expect(readFileSync(join(root, 'archivo/2026-27-S1/algebra/temas/01-matrices/explicacion.md'), 'utf8')).toBe('# Matrices');
    expect(JSON.parse(readFileSync(join(root, 'archivo/2026-27-S1/algebra/meta.json'), 'utf8')).estado).toBe('archivada');
    expect(existsSync(join(root, 'archivo/2026-27-S1/_plan/plan.md'))).toBe(true);
    const tareas = JSON.parse(readFileSync(join(root, 'plan/tareas.json'), 'utf8'));
    expect(tareas.tareas.map((t: { archivada?: boolean }) => Boolean(t.archivada))).toEqual([true, false]);
    const v = validateRepo(root);
    expect(v.errors).toEqual([]);
    expect(v.warnings.join()).not.toMatch(/archivada/);
  });

  it('rejects malformed semester ids', () => {
    expect(() => archiveSemester('primero', makeRepo({}))).toThrow();
  });
});
