// npm run plan [-- --desde 2026-11-05] [--dry-run]
// Reads every active meta.json + plan/config.json and writes plan/plan.json + plan/plan.md.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { toISODate } from '../shared/dates.ts';
import type { Meta } from '../shared/types.ts';
import { parseExercises } from './lib/exercises.ts';
import { parseFrontMatter } from './lib/frontmatter.ts';
import { findSubjects, readIfExists, REPO_ROOT } from './lib/paths.ts';
import { DEFAULT_CONFIG, generatePlan, type PlanConfig, type PlanSubject, type PlanTema } from './lib/plan.ts';
import { validateAgainst } from './lib/validate.ts';

export function loadConfig(root = REPO_ROOT): PlanConfig {
  const p = join(root, 'plan', 'config.json');
  if (!existsSync(p)) return { ...DEFAULT_CONFIG };
  const raw = JSON.parse(readFileSync(p, 'utf8')) as Partial<PlanConfig> & { $comentario?: unknown };
  return { ...DEFAULT_CONFIG, ...raw, diasEspeciales: { ...DEFAULT_CONFIG.diasEspeciales, ...(raw.diasEspeciales ?? {}) } };
}

export function loadTema(subjectDir: string, slug: string, titulo: string, horas: number): PlanTema {
  const dir = join(subjectDir, 'temas', slug);
  const expl = readIfExists(join(dir, 'explicacion.md'));
  const ej = readIfExists(join(dir, 'ejercicios.md'));
  const secciones = expl
    ? parseFrontMatter(expl)
        .body.split('\n')
        .filter((l) => /^##\s+/.test(l) && !/^###/.test(l))
        .map((l) => l.replace(/^##\s+/, '').replace(/^\d+[.)]\s*/, '').replace(/\$([^$]+)\$/g, '$1').trim())
        .filter((l) => !/^(errores|resumen|para llevar|en resumen|qué viene|chuleta)/i.test(l))
    : [];
  const blocks = ej ? parseExercises(ej).blocks : [];
  const by = (n: string) => blocks.filter((b) => b.nivel === n).map((b) => b.numero);
  return {
    slug,
    titulo,
    horas,
    secciones,
    ejercicios: { basico: by('basico'), medio: by('medio'), examen: by('examen') },
    tieneMaterial: Boolean(expl || ej),
  };
}

export function loadSubjects(desde: string, root = REPO_ROOT): PlanSubject[] {
  const out: PlanSubject[] = [];
  for (const s of findSubjects(root)) {
    if (s.archived || !existsSync(s.metaPath)) continue;
    const meta = JSON.parse(readFileSync(s.metaPath, 'utf8')) as Meta;
    if (meta.estado === 'archivada') continue;
    const next = meta.examenes.map((e) => e.fecha).filter((f) => f >= desde).sort()[0];
    if (!next) continue;
    const dificultad = meta.dificultad ?? 3;
    out.push({
      slug: meta.slug,
      nombre: meta.nombre,
      abreviatura: meta.abreviatura ?? meta.nombre,
      dificultad,
      examen: next,
      temas: meta.temas.map((t) => loadTema(s.dir, t.slug, t.titulo, t.horas ?? 4 + dificultad)),
    });
  }
  return out;
}

function main() {
  const { values } = parseArgs({ options: { desde: { type: 'string' }, 'dry-run': { type: 'boolean' } } });
  const desde = values.desde ?? toISODate(new Date());
  const subjects = loadSubjects(desde);
  if (!subjects.length) {
    console.error('No hay asignaturas activas con exámenes a partir de ' + desde);
    process.exit(1);
  }
  const { plan, markdown, warnings } = generatePlan({ desde, subjects, config: loadConfig() }, toISODate(new Date()));
  const errors = validateAgainst('plan', plan);
  if (errors.length) {
    console.error('El plan generado no cumple el schema:\n' + errors.join('\n'));
    process.exit(1);
  }
  for (const w of warnings) console.warn('⚠️  ' + w);
  if (values['dry-run']) {
    console.log(markdown);
    return;
  }
  mkdirSync(join(REPO_ROOT, 'plan'), { recursive: true });
  writeFileSync(join(REPO_ROOT, 'plan', 'plan.json'), JSON.stringify({ $schema: '../schemas/plan.schema.json', ...plan }, null, 2) + '\n');
  writeFileSync(join(REPO_ROOT, 'plan', 'plan.md'), markdown + '\n');
  const total = plan.semanas.flatMap((w) => w.dias).reduce((a, d) => a + (d.horas ?? 0), 0);
  console.log(`✅ plan/plan.md y plan/plan.json: ${plan.semanas.length} semanas, ${plan.desde} → ${plan.hasta}, ${total} h en total`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
