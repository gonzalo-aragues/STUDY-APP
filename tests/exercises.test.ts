import { describe, expect, it } from 'vitest';
import { levelFromHeading, matchExercises, parseExercises, parseSolutions } from '../scripts/lib/exercises.ts';
import { parseFrontMatter } from '../scripts/lib/frontmatter.ts';

const EJ = `---
fuente: genérico - revisar con apuntes
---
# Ejercicios — Números complejos

Intro que no es ejercicio.

## Básico

### Ejercicio 1
Calcula $(2+3i)+(1-i)$.

### Ejercicio 2. Conjugado
Halla $\\overline{z}$.

## Medio

### Ejercicio 3 — Con código
\`\`\`cpp
// ### Ejercicio 99 (esto es código, no un ejercicio)
## tampoco es un nivel
int main() {}
\`\`\`
Explica qué hace.

## Tipo examen

### Ejercicio 4: Raíces
Resuelve $z^3=1$.
`;

const SO = `# Soluciones

### Solución 1
$3+2i$.

### Solucion 2
$\\overline{z}=a-bi$.

### Solución 3
Nada.

### Solución 4
Las tres raíces cúbicas.
`;

describe('front matter', () => {
  it('parses key: value pairs and strips them from the body', () => {
    const { data, body } = parseFrontMatter(EJ);
    expect(data.fuente).toBe('genérico - revisar con apuntes');
    expect(body.startsWith('# Ejercicios')).toBe(true);
  });
  it('returns the whole text when there is no front matter', () => {
    expect(parseFrontMatter('# Hola').body).toBe('# Hola');
  });
});

describe('parseExercises', () => {
  const { blocks, preamble } = parseExercises(EJ);
  it('finds every exercise with its level and title', () => {
    expect(blocks.map((b) => [b.numero, b.nivel, b.titulo])).toEqual([
      [1, 'basico', ''],
      [2, 'basico', 'Conjugado'],
      [3, 'medio', 'Con código'],
      [4, 'examen', 'Raíces'],
    ]);
  });
  it('ignores headings inside fenced code blocks', () => {
    expect(blocks.find((b) => b.numero === 99)).toBeUndefined();
    expect(blocks[2].body).toContain('## tampoco es un nivel');
    expect(blocks[2].body).toContain('Explica qué hace.');
  });
  it('keeps the preamble separately', () => {
    expect(preamble).toContain('Intro que no es ejercicio');
  });
  it('maps level headings', () => {
    expect(levelFromHeading('Básico')).toBe('basico');
    expect(levelFromHeading('BASICO (calentamiento)')).toBe('basico');
    expect(levelFromHeading('Medio')).toBe('medio');
    expect(levelFromHeading('Tipo examen')).toBe('examen');
    expect(levelFromHeading('Extra')).toBe('otro');
  });
});

describe('parseSolutions + matchExercises', () => {
  it('accepts "Solución" with or without accent', () => {
    expect(parseSolutions(SO).blocks.map((b) => b.numero)).toEqual([1, 2, 3, 4]);
  });
  it('pairs every exercise with the solution of the same number', () => {
    const m = matchExercises(EJ, SO);
    expect(m.missingSolutions).toEqual([]);
    expect(m.orphanSolutions).toEqual([]);
    expect(m.pairs.map((p) => p.solucion?.body)).toEqual(['$3+2i$.', '$\\overline{z}=a-bi$.', 'Nada.', 'Las tres raíces cúbicas.']);
  });
  it('matches by number, not by position', () => {
    const shuffled = '### Solución 4\nD\n\n### Solución 1\nA\n\n### Solución 3\nC\n\n### Solución 2\nB\n';
    const m = matchExercises(EJ, shuffled);
    expect(m.pairs.map((p) => p.solucion?.body)).toEqual(['A', 'B', 'C', 'D']);
  });
  it('reports missing, orphan, duplicate and gaps', () => {
    const ej = '## Básico\n### Ejercicio 1\na\n### Ejercicio 3\nb\n### Ejercicio 3\nc\n';
    const so = '### Solución 1\nx\n### Solución 1\ny\n### Solución 5\nz\n';
    const m = matchExercises(ej, so);
    expect(m.missingSolutions).toEqual([3, 3]);
    expect(m.orphanSolutions).toEqual([5]);
    expect(m.duplicateExercises).toEqual([3]);
    expect(m.duplicateSolutions).toEqual([1]);
    expect(m.gaps).toEqual([2]);
    expect(m.pairs[0].solucion?.body).toBe('x'); // first one wins
  });
  it('treats a missing soluciones.md as all missing', () => {
    expect(matchExercises(EJ, null).missingSolutions).toEqual([1, 2, 3, 4]);
  });
});
