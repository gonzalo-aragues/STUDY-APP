import { describe, expect, it } from 'vitest';
import { isRealDate, validateAgainst, validateRepo } from '../scripts/lib/validate.ts';
import { makeRepo, validMeta, validTarjetas } from './helpers.ts';

describe('meta.json schema', () => {
  it('accepts a minimal valid meta', () => {
    expect(validateAgainst('meta', validMeta)).toEqual([]);
  });
  it('accepts a full meta', () => {
    const full = {
      ...validMeta,
      abreviatura: 'ÁLG',
      curso: 1,
      estado: 'activa',
      color: '#3366cc',
      dificultad: 4,
      examenes: [{ fecha: '2027-01-09', hora: '09:00', tipo: 'final', lugar: 'Aula 1', titulo: 'Final' }],
      temas: [{ slug: '01-matrices', titulo: 'Matrices', horas: 8, fuente: 'apuntes', estado: 'generado' }],
    };
    expect(validateAgainst('meta', full)).toEqual([]);
  });
  it('rejects missing required fields', () => {
    const { nombre: _n, ...noName } = validMeta;
    expect(validateAgainst('meta', noName).join()).toMatch(/nombre/);
  });
  it('rejects bad slug, bad semester, bad date format, unknown keys', () => {
    expect(validateAgainst('meta', { ...validMeta, slug: 'Álgebra' })).not.toEqual([]);
    expect(validateAgainst('meta', { ...validMeta, semestre: '2026' })).not.toEqual([]);
    expect(validateAgainst('meta', { ...validMeta, examenes: [{ fecha: '9/1/2027' }] })).not.toEqual([]);
    expect(validateAgainst('meta', { ...validMeta, foo: 1 }).join()).toMatch(/sobra "foo"/);
  });
  it('rejects tema slugs without the nn- prefix', () => {
    expect(validateAgainst('meta', { ...validMeta, temas: [{ slug: 'matrices', titulo: 'x' }] })).not.toEqual([]);
  });
});

describe('tarjetas.json schema', () => {
  it('accepts a valid file', () => {
    expect(validateAgainst('tarjetas', validTarjetas)).toEqual([]);
  });
  it('requires fuente and valid tipo', () => {
    const { fuente: _f, ...noFuente } = validTarjetas;
    expect(validateAgainst('tarjetas', noFuente)).not.toEqual([]);
    const badTipo = { ...validTarjetas, tarjetas: [{ ...validTarjetas.tarjetas[0], tipo: 'otro' }] };
    expect(validateAgainst('tarjetas', badTipo).join()).toMatch(/concepto/);
  });
  it('rejects empty anverso and ids with spaces', () => {
    const bad = { ...validTarjetas, tarjetas: [{ id: 'con espacio', tipo: 'concepto', anverso: '', reverso: 'x' }] };
    expect(validateAgainst('tarjetas', bad).length).toBeGreaterThanOrEqual(2);
  });
});

describe('plan.json and tareas.json schemas', () => {
  it('accepts a valid plan', () => {
    const plan = {
      generado: '2026-11-05',
      desde: '2026-11-05',
      hasta: '2027-01-16',
      semanas: [
        {
          inicio: '2026-11-02',
          fin: '2026-11-08',
          titulo: 'Semana 1',
          dias: [{ fecha: '2026-11-05', items: [{ asignatura: 'algebra', tipo: 'aprender', texto: 'Matrices', horas: 1.5 }] }],
        },
      ],
    };
    expect(validateAgainst('plan', plan)).toEqual([]);
    plan.semanas[0].dias[0].items[0].tipo = 'siesta';
    expect(validateAgainst('plan', plan)).not.toEqual([]);
  });
  it('accepts valid tareas and enforces step length', () => {
    const tareas = { tareas: [{ id: 't1', titulo: 'Estudiar', creada: '2026-11-05', pasos: [{ id: 'p1', texto: 'Leer', minutos: 20 }] }] };
    expect(validateAgainst('tareas', tareas)).toEqual([]);
    tareas.tareas[0].pasos[0].minutos = 90;
    expect(validateAgainst('tareas', tareas)).not.toEqual([]);
  });
});

describe('isRealDate', () => {
  it('detects impossible dates', () => {
    expect(isRealDate('2027-01-09')).toBe(true);
    expect(isRealDate('2026-02-30')).toBe(false);
    expect(isRealDate('2026-1-9')).toBe(false);
  });
});

describe('validateRepo (cross-file rules)', () => {
  const ej = '## Básico\n\n### Ejercicio 1\nCalcula $2+2$.\n\n### Ejercicio 2\nOtro.\n';
  const so = '### Solución 1\n$4$\n\n### Solución 2\nAsí.\n';

  it('passes on a consistent repo', () => {
    const root = makeRepo({
      'asignaturas/algebra/meta.json': validMeta,
      'asignaturas/algebra/temas/01-matrices/tarjetas.json': validTarjetas,
      'asignaturas/algebra/temas/01-matrices/explicacion.md': '---\nfuente: genérico\n---\n# Matrices\n$A=(a_{ij})$',
      'asignaturas/algebra/temas/01-matrices/ejercicios.md': ej,
      'asignaturas/algebra/temas/01-matrices/soluciones.md': so,
    });
    const r = validateRepo(root);
    expect(r.errors).toEqual([]);
    expect(r.stats).toEqual({ asignaturas: 1, temas: 1, tarjetas: 1, ejercicios: 2 });
  });

  it('reports slug/folder mismatch, missing solutions and duplicate card ids', () => {
    const root = makeRepo({
      'asignaturas/algebra/meta.json': { ...validMeta, slug: 'algebra-lineal' },
      'asignaturas/algebra/temas/01-matrices/tarjetas.json': {
        ...validTarjetas,
        asignatura: 'algebra-lineal',
        tarjetas: [validTarjetas.tarjetas[0], validTarjetas.tarjetas[0]],
      },
      'asignaturas/algebra/temas/01-matrices/ejercicios.md': ej,
      'asignaturas/algebra/temas/01-matrices/soluciones.md': '### Solución 1\nx\n\n### Solución 7\ny\n',
    });
    const all = validateRepo(root).errors.join('\n');
    expect(all).toMatch(/no coincide con la carpeta/);
    expect(all).toMatch(/ejercicios sin solución: 2/);
    expect(all).toMatch(/soluciones sin ejercicio: 7/);
    expect(all).toMatch(/id de tarjeta repetido "def-matriz"/);
  });

  it('reports broken LaTeX and invalid JSON', () => {
    const root = makeRepo({
      'asignaturas/algebra/meta.json': validMeta,
      'asignaturas/algebra/temas/01-matrices/explicacion.md': 'Mal: $\\frac{1}{$ fin',
      'asignaturas/x/meta.json': '{ not json',
    });
    const all = validateRepo(root).errors.join('\n');
    expect(all).toMatch(/LaTeX inválido/);
    expect(all).toMatch(/JSON inválido/);
  });

  it('requires soluciones.md when there are exercises', () => {
    const root = makeRepo({
      'asignaturas/algebra/meta.json': validMeta,
      'asignaturas/algebra/temas/01-matrices/ejercicios.md': ej,
    });
    expect(validateRepo(root).errors.join()).toMatch(/falta soluciones.md/);
  });

  it('handles archived subjects and duplicate slugs across semesters', () => {
    const root = makeRepo({
      'asignaturas/algebra/meta.json': validMeta,
      'archivo/2025-26-S2/algebra/meta.json': { ...validMeta, estado: 'archivada' },
    });
    expect(validateRepo(root).errors.join()).toMatch(/repetido/);
  });

  it('validates plan and tareas files and warns on unknown subjects', () => {
    const root = makeRepo({
      'asignaturas/algebra/meta.json': validMeta,
      'plan/plan.json': {
        generado: '2026-11-05',
        desde: '2026-11-05',
        hasta: '2026-11-06',
        semanas: [{ inicio: '2026-11-02', fin: '2026-11-08', titulo: 's', dias: [{ fecha: '2026-11-05', items: [{ asignatura: 'fisica', tipo: 'aprender', texto: 'x' }] }] }],
      },
      'plan/tareas.json': { tareas: [{ id: 'a', titulo: 'b', creada: '2026-11-05', pasos: [] }] },
    });
    const r = validateRepo(root);
    expect(r.warnings.join()).toMatch(/asignatura desconocida "fisica"/);
    expect(r.errors.join()).toMatch(/tareas.json/);
  });
});
