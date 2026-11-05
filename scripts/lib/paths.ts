// Discovery of subjects/temas in the repo.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = fileURLToPath(new URL('../../', import.meta.url));

export interface SubjectDir {
  slug: string; // folder name
  dir: string; // absolute path
  archived: boolean;
  metaPath: string;
}

function subdirs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((n) => !n.startsWith('.') && !n.startsWith('_'))
    .filter((n) => statSync(join(dir, n)).isDirectory())
    .sort();
}

/** Active subjects live in asignaturas/<slug>; archived ones in archivo/<semestre>/<slug>. */
export function findSubjects(root = REPO_ROOT): SubjectDir[] {
  const out: SubjectDir[] = [];
  for (const slug of subdirs(join(root, 'asignaturas'))) {
    const dir = join(root, 'asignaturas', slug);
    out.push({ slug, dir, archived: false, metaPath: join(dir, 'meta.json') });
  }
  for (const sem of subdirs(join(root, 'archivo'))) {
    for (const slug of subdirs(join(root, 'archivo', sem))) {
      const dir = join(root, 'archivo', sem, slug);
      out.push({ slug, dir, archived: true, metaPath: join(dir, 'meta.json') });
    }
  }
  return out;
}

export function temaDirs(subjectDir: string): string[] {
  return subdirs(join(subjectDir, 'temas'));
}

export function readIfExists(path: string): string | null {
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

export function rel(root: string, p: string): string {
  return relative(root, p) || '.';
}
