import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/** Creates a throwaway repo tree: { 'asignaturas/x/meta.json': {...} | 'text' } */
export function makeRepo(files: Record<string, unknown>): string {
  const root = mkdtempSync(join(tmpdir(), 'study-app-test-'));
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  }
  return root;
}

export const validMeta = {
  slug: 'algebra',
  nombre: 'Álgebra',
  semestre: '2026-27-S1',
  examenes: [{ fecha: '2027-01-09' }],
  temas: [{ slug: '01-matrices', titulo: 'Matrices' }],
};

export const validTarjetas = {
  asignatura: 'algebra',
  tema: '01-matrices',
  fuente: 'genérico - revisar con apuntes',
  tarjetas: [
    { id: 'def-matriz', tipo: 'concepto', anverso: '¿Qué es una matriz $m\\times n$?', reverso: 'Una tabla de números.' },
  ],
};
