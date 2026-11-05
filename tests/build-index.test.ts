import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { TarjetaIndex, TemaContent } from '../shared/types.ts';
import { buildIndex, stripTitle } from '../scripts/lib/build-index.ts';
import { makeRepo, validMeta, validTarjetas } from './helpers.ts';

describe('buildIndex', () => {
  const root = makeRepo({
    'asignaturas/algebra/meta.json': { ...validMeta, temas: [{ slug: '01-matrices', titulo: 'Matrices' }, { slug: '02-grupos', titulo: 'Grupos' }] },
    'asignaturas/algebra/temas/01-matrices/explicacion.md': '---\nfuente: genérico - revisar con apuntes\n---\n# Matrices\n\nUna matriz $A$.\n\n```cpp\nint x = 1;\n```\n',
    'asignaturas/algebra/temas/01-matrices/ejercicios.md': '# Ejercicios\n\n## Básico\n\n### Ejercicio 1\nSuma $1+1$.\n\n## Tipo examen\n\n### Ejercicio 2. Difícil\nHaz algo.\n',
    'asignaturas/algebra/temas/01-matrices/soluciones.md': '### Solución 2\nAsí.\n\n### Solución 1\n$2$\n',
    'asignaturas/algebra/temas/01-matrices/tarjetas.json': validTarjetas,
    'archivo/2025-26-S2/fisica/meta.json': { ...validMeta, slug: 'fisica', nombre: 'Física', semestre: '2025-26-S2', estado: 'archivada', temas: [] },
    'plan/plan.json': { $schema: 'x', generado: '2026-11-05', desde: '2026-11-05', hasta: '2027-01-16', semanas: [] },
    'plan/tareas.json': { tareas: [{ id: 't', titulo: 'T', creada: '2026-11-05', pasos: [{ id: 'p1', texto: 'x', minutos: 20 }] }] },
  });
  const out = join(root, 'out');
  const { index, stats } = buildIndex(root, out, new Date('2026-11-05T10:00:00Z'));

  it('lists active subjects before archived ones', () => {
    expect(index.asignaturas.map((a) => [a.slug, a.estado])).toEqual([
      ['algebra', 'activa'],
      ['fisica', 'archivada'],
    ]);
    expect(stats).toEqual({ asignaturas: 2, temas: 1, ejercicios: 2, tarjetas: 1 });
  });

  it('marks temas without material as pending with no url', () => {
    const t = index.asignaturas[0].temas;
    expect(t[0]).toMatchObject({ slug: '01-matrices', url: 'content/temas/algebra/01-matrices.json', numEjercicios: 2, numTarjetas: 1, tieneExplicacion: true, fuente: 'genérico - revisar con apuntes' });
    expect(t[1]).toMatchObject({ slug: '02-grupos', url: null, estado: 'pendiente' });
  });

  it('renders tema content with exercises paired to solutions by number', () => {
    const tema = JSON.parse(readFileSync(join(out, 'temas/algebra/01-matrices.json'), 'utf8')) as TemaContent;
    expect(tema.explicacionHtml).not.toContain('<h1');
    expect(tema.explicacionHtml).toContain('katex');
    expect(tema.explicacionHtml).toContain('hljs-type');
    expect(tema.ejercicios.map((e) => [e.numero, e.nivel, e.titulo])).toEqual([
      [1, 'basico', ''],
      [2, 'examen', 'Difícil'],
    ]);
    expect(tema.ejercicios[0].solucionHtml).toContain('katex');
    expect(tema.ejercicios[1].solucionHtml).toContain('Así.');
  });

  it('writes per-subject flashcards with globally unique ids', () => {
    const cards = JSON.parse(readFileSync(join(out, 'tarjetas/algebra.json'), 'utf8')) as TarjetaIndex[];
    expect(cards[0].id).toBe('algebra/01-matrices/def-matriz');
    expect(cards[0].anversoHtml).toContain('katex');
    expect(existsSync(join(out, 'tarjetas/fisica.json'))).toBe(false);
  });

  it('embeds plan (without $schema) and tareas', () => {
    expect(index.plan).not.toHaveProperty('$schema');
    expect(index.plan?.hasta).toBe('2027-01-16');
    expect(index.tareas).toHaveLength(1);
    expect(JSON.parse(readFileSync(join(out, 'index.json'), 'utf8')).generado).toBe('2026-11-05T10:00:00.000Z');
  });

  it('stripTitle only removes a leading h1', () => {
    expect(stripTitle('# T\n\nHola')).toBe('Hola');
    expect(stripTitle('Hola\n# T')).toBe('Hola\n# T');
    expect(stripTitle('## Sub\nx')).toBe('## Sub\nx');
  });
});

describe('buildIndex with archived subjects', () => {
  it('writes archived content under content/archivo/ (not precached)', () => {
    const root = makeRepo({
      'archivo/2025-26-S2/fisica/meta.json': { ...validMeta, slug: 'fisica', semestre: '2025-26-S2', estado: 'archivada' },
      'archivo/2025-26-S2/fisica/temas/01-matrices/explicacion.md': '# X\nHola',
      'archivo/2025-26-S2/fisica/temas/01-matrices/tarjetas.json': { ...validTarjetas, asignatura: 'fisica' },
    });
    const out = join(root, 'out');
    const { index } = buildIndex(root, out);
    const a = index.asignaturas[0];
    expect(a.tarjetasUrl).toBe('content/archivo/tarjetas/fisica.json');
    expect(a.temas[0].url).toBe('content/archivo/temas/fisica/01-matrices.json');
    expect(existsSync(join(out, 'archivo/temas/fisica/01-matrices.json'))).toBe(true);
  });
});
