// Archive the subjects of a finished semester (nothing is deleted).
//
// npm run nuevo-semestre -- --semestre 2026-27-S1 [--dry-run]
//   * moves asignaturas/<slug>/ -> archivo/<semestre>/<slug>/ and sets "estado": "archivada"
//   * moves plan/plan.md + plan/plan.json -> archivo/<semestre>/_plan/
//   * marks the tareas of those subjects as "archivada": true in plan/tareas.json
// Review history is keyed by subject slug, so progress in the app is kept.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import type { Meta, TareasFile } from '../shared/types.ts';
import { findSubjects, REPO_ROOT } from './lib/paths.ts';

export interface ArchiveResult {
  moved: { slug: string; from: string; to: string }[];
  planMoved: boolean;
  tareasArchived: number;
}

export function archiveSemester(semestre: string, root = REPO_ROOT, dryRun = false): ArchiveResult {
  if (!/^\d{4}-\d{2}-S[12]$/.test(semestre)) throw new Error(`Semestre inválido "${semestre}" (formato 2026-27-S1)`);
  const result: ArchiveResult = { moved: [], planMoved: false, tareasArchived: 0 };
  const destBase = join(root, 'archivo', semestre);
  const slugs = new Set<string>();

  for (const s of findSubjects(root)) {
    if (s.archived || !existsSync(s.metaPath)) continue;
    const meta = JSON.parse(readFileSync(s.metaPath, 'utf8')) as Meta;
    if (meta.semestre !== semestre) continue;
    const to = join(destBase, s.slug);
    if (existsSync(to)) throw new Error(`Ya existe ${to}; no sobrescribo nada.`);
    result.moved.push({ slug: s.slug, from: s.dir, to });
    slugs.add(s.slug);
    if (!dryRun) {
      meta.estado = 'archivada';
      writeFileSync(s.metaPath, JSON.stringify(meta, null, 2) + '\n');
      mkdirSync(destBase, { recursive: true });
      renameSync(s.dir, to);
    }
  }

  const planDir = join(root, 'plan');
  const planFiles = ['plan.md', 'plan.json'].filter((f) => existsSync(join(planDir, f)));
  if (result.moved.length && planFiles.length) {
    result.planMoved = true;
    if (!dryRun) {
      mkdirSync(join(destBase, '_plan'), { recursive: true });
      for (const f of planFiles) renameSync(join(planDir, f), join(destBase, '_plan', f));
    }
  }

  const tareasPath = join(planDir, 'tareas.json');
  if (slugs.size && existsSync(tareasPath)) {
    const tareas = JSON.parse(readFileSync(tareasPath, 'utf8')) as TareasFile;
    for (const t of tareas.tareas) {
      if (t.asignatura && slugs.has(t.asignatura) && !t.archivada) {
        t.archivada = true;
        result.tareasArchived++;
      }
    }
    if (!dryRun && result.tareasArchived) writeFileSync(tareasPath, JSON.stringify(tareas, null, 2) + '\n');
  }
  return result;
}

function main() {
  const { values } = parseArgs({ options: { semestre: { type: 'string' }, 'dry-run': { type: 'boolean' } } });
  if (!values.semestre) {
    console.error('Uso: npm run nuevo-semestre -- --semestre 2026-27-S1 [--dry-run]');
    process.exit(2);
  }
  const dry = Boolean(values['dry-run']);
  const r = archiveSemester(values.semestre, REPO_ROOT, dry);
  if (!r.moved.length) {
    console.log(`No hay asignaturas activas del semestre ${values.semestre}.`);
    return;
  }
  for (const m of r.moved) console.log(`${dry ? '(simulación) ' : ''}📦 ${m.slug} → archivo/${values.semestre}/${m.slug}`);
  if (r.planMoved) console.log(`${dry ? '(simulación) ' : ''}📦 plan/plan.* → archivo/${values.semestre}/_plan/`);
  if (r.tareasArchived) console.log(`${dry ? '(simulación) ' : ''}🗂️  ${r.tareasArchived} tareas marcadas como archivadas`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
