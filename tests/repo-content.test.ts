// Guards the real content of this repo (not fixtures): it must always validate.
import { describe, expect, it } from 'vitest';
import { validateRepo } from '../scripts/lib/validate.ts';
import { matchExercises } from '../scripts/lib/exercises.ts';
import { findSubjects, readIfExists, temaDirs } from '../scripts/lib/paths.ts';
import { join } from 'node:path';

describe('repo content', () => {
  it('validates with no errors', () => {
    const r = validateRepo();
    expect(r.errors).toEqual([]);
  });
  it('every exercise of every tema has its solution', () => {
    for (const s of findSubjects()) {
      for (const t of temaDirs(s.dir)) {
        const ej = readIfExists(join(s.dir, 'temas', t, 'ejercicios.md'));
        if (!ej) continue;
        const m = matchExercises(ej, readIfExists(join(s.dir, 'temas', t, 'soluciones.md')));
        expect({ tema: `${s.slug}/${t}`, missing: m.missingSolutions, orphan: m.orphanSolutions }).toEqual({ tema: `${s.slug}/${t}`, missing: [], orphan: [] });
      }
    }
  });
});
