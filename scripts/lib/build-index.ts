// Builds the app's content files from asignaturas/** (+ archivo/**) and plan/*.json.
//
//   <out>/index.json                     subjects, temas, plan, tareas (small)
//   <out>/tarjetas/<asignatura>.json     rendered flashcards of a subject
//   <out>/temas/<asignatura>/<tema>.json rendered explicación + ejercicios with their soluciones
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { AsignaturaIndex, ContentIndex, EjercicioIndex, Meta, Plan, TarjetaIndex, TarjetasFile, TareasFile, TemaContent, TemaIndex } from '../../shared/types.ts';
import { matchExercises } from './exercises.ts';
import { parseFrontMatter } from './frontmatter.ts';
import { findSubjects, readIfExists, REPO_ROOT } from './paths.ts';
import { renderMarkdown } from './render.ts';

const DEFAULT_COLOR = '#2f7d6d';

function writeJson(path: string, data: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data));
}

/** Drops a leading "# Title" line (the app already shows the title). */
export function stripTitle(md: string): string {
  return md.replace(/^\s*#\s+[^\n]*\n+/, '');
}

export interface BuildStats {
  asignaturas: number;
  temas: number;
  ejercicios: number;
  tarjetas: number;
}

export function buildIndex(root = REPO_ROOT, outDir = join(REPO_ROOT, 'app', 'public', 'content'), now = new Date()): { index: ContentIndex; stats: BuildStats } {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const stats: BuildStats = { asignaturas: 0, temas: 0, ejercicios: 0, tarjetas: 0 };
  const asignaturas: AsignaturaIndex[] = [];

  for (const s of findSubjects(root)) {
    if (!existsSync(s.metaPath)) continue;
    const meta = JSON.parse(readFileSync(s.metaPath, 'utf8')) as Meta;
    const slug = meta.slug;
    const cards: TarjetaIndex[] = [];
    const temas: TemaIndex[] = [];

    for (const t of meta.temas) {
      const dir = join(s.dir, 'temas', t.slug);
      const expl = readIfExists(join(dir, 'explicacion.md'));
      const ej = readIfExists(join(dir, 'ejercicios.md'));
      const so = readIfExists(join(dir, 'soluciones.md'));
      const tjRaw = readIfExists(join(dir, 'tarjetas.json'));
      const tj = tjRaw ? (JSON.parse(tjRaw) as TarjetasFile) : null;
      const hasAny = Boolean(expl || ej || tj);

      const fuente = (expl ? parseFrontMatter(expl).data.fuente : undefined) ?? (ej ? parseFrontMatter(ej).data.fuente : undefined) ?? tj?.fuente ?? t.fuente ?? null;

      const ejercicios: EjercicioIndex[] = ej
        ? matchExercises(ej, so).pairs.map(({ ejercicio, solucion }) => ({
            numero: ejercicio.numero,
            nivel: ejercicio.nivel,
            titulo: ejercicio.titulo,
            html: renderMarkdown(ejercicio.body),
            solucionHtml: solucion ? renderMarkdown(solucion.body) : null,
          }))
        : [];

      for (const c of tj?.tarjetas ?? []) {
        cards.push({
          id: `${slug}/${t.slug}/${c.id}`,
          asignatura: slug,
          tema: t.slug,
          tipo: c.tipo,
          anversoHtml: renderMarkdown(c.anverso),
          reversoHtml: renderMarkdown(c.reverso),
        });
      }

      let url: string | null = null;
      if (hasAny) {
        url = `content/temas/${slug}/${t.slug}.json`;
        const content: TemaContent = {
          asignatura: slug,
          tema: t.slug,
          titulo: t.titulo,
          fuente,
          explicacionHtml: expl ? renderMarkdown(stripTitle(parseFrontMatter(expl).body)) : null,
          ejercicios,
        };
        writeJson(join(outDir, 'temas', slug, `${t.slug}.json`), content);
        stats.temas++;
      }
      stats.ejercicios += ejercicios.length;
      temas.push({
        slug: t.slug,
        titulo: t.titulo,
        fuente,
        estado: t.estado ?? (hasAny ? 'generado' : 'pendiente'),
        tieneExplicacion: Boolean(expl),
        numEjercicios: ejercicios.length,
        numTarjetas: tj?.tarjetas.length ?? 0,
        url,
      });
    }

    let tarjetasUrl: string | null = null;
    if (cards.length) {
      tarjetasUrl = `content/tarjetas/${slug}.json`;
      writeJson(join(outDir, 'tarjetas', `${slug}.json`), cards);
    }
    stats.tarjetas += cards.length;
    stats.asignaturas++;
    asignaturas.push({
      slug,
      nombre: meta.nombre,
      abreviatura: meta.abreviatura ?? meta.nombre,
      semestre: meta.semestre,
      estado: s.archived ? 'archivada' : (meta.estado ?? 'activa'),
      color: meta.color ?? DEFAULT_COLOR,
      examenes: [...meta.examenes].sort((a, b) => a.fecha.localeCompare(b.fecha)),
      temas,
      numTarjetas: cards.length,
      tarjetasUrl,
    });
  }

  // Active subjects first, by next exam date then name; archived after, newest semester first.
  const firstExam = (a: AsignaturaIndex) => a.examenes[0]?.fecha ?? '9999';
  asignaturas.sort((a, b) =>
    a.estado !== b.estado ? (a.estado === 'activa' ? -1 : 1) : a.estado === 'archivada' ? b.semestre.localeCompare(a.semestre) || a.nombre.localeCompare(b.nombre) : firstExam(a).localeCompare(firstExam(b)) || a.nombre.localeCompare(b.nombre),
  );

  const planRaw = readIfExists(join(root, 'plan', 'plan.json'));
  const tareasRaw = readIfExists(join(root, 'plan', 'tareas.json'));
  const strip = <T extends object>(o: T): T => {
    const { $schema: _s, ...rest } = o as T & { $schema?: string };
    return rest as T;
  };
  const index: ContentIndex = {
    version: 1,
    generado: now.toISOString(),
    asignaturas,
    plan: planRaw ? strip(JSON.parse(planRaw) as Plan) : null,
    tareas: tareasRaw ? (JSON.parse(tareasRaw) as TareasFile).tareas : [],
  };
  writeJson(join(outDir, 'index.json'), index);
  return { index, stats };
}
