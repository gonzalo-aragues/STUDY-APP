// Scaffold a new subject folder + meta.json.
//
// npm run nueva-asignatura -- --slug calculo --nombre "Cálculo" --semestre 2026-27-S1 \
//   --examen 2027-01-12 [--examen 2027-06-20:recuperacion] [--tema "Números complejos" --tema "Sucesiones"] \
//   [--abreviatura Cálculo] [--curso 1] [--dificultad 4] [--color #2f7d6d] [--lenguaje cpp] [--horas 6]
//
// Options: --examen accepts FECHA, FECHA:tipo or FECHA@HH:MM[:tipo]. --temas "A; B; C" is a shortcut.
// Refuses to overwrite an existing subject unless --actualizar (then adds missing temas/exams and
// updates the time/type of an exam on an existing date).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import type { Examen, Meta } from '../shared/types.ts';
import { REPO_ROOT } from './lib/paths.ts';
import { slugify, temaSlug } from './lib/slug.ts';
import { isRealDate, validateAgainst } from './lib/validate.ts';

const PALETTE = ['#2f7d6d', '#3b6fb6', '#b5523b', '#7a5bb5', '#b58a2f', '#3b8fb5', '#b53b74', '#5b8a3b'];

export function parseExamArg(arg: string): Examen {
  const m = /^(\d{4}-\d{2}-\d{2})(?:@(\d{2}:\d{2}))?(?::([a-z]+))?$/.exec(arg.trim());
  if (!m || !isRealDate(m[1])) throw new Error(`--examen inválido: "${arg}" (usa AAAA-MM-DD, AAAA-MM-DD@09:00 o AAAA-MM-DD:parcial)`);
  const ex: Examen = { fecha: m[1], tipo: (m[3] as Examen['tipo']) ?? 'final' };
  if (m[2]) ex.hora = m[2];
  return ex;
}

function main() {
  const { values } = parseArgs({
    options: {
      slug: { type: 'string' },
      nombre: { type: 'string' },
      abreviatura: { type: 'string' },
      semestre: { type: 'string' },
      curso: { type: 'string' },
      dificultad: { type: 'string' },
      color: { type: 'string' },
      lenguaje: { type: 'string' },
      horas: { type: 'string' },
      examen: { type: 'string', multiple: true },
      tema: { type: 'string', multiple: true },
      temas: { type: 'string' },
      actualizar: { type: 'boolean' },
    },
  });
  if (!values.nombre || !values.semestre) {
    console.error('Faltan --nombre y/o --semestre. Ejemplo: --nombre "Cálculo" --semestre 2026-27-S1 --examen 2027-01-12');
    process.exit(2);
  }
  const slug = values.slug ?? slugify(values.nombre);
  const dir = join(REPO_ROOT, 'asignaturas', slug);
  const metaPath = join(dir, 'meta.json');
  const temaTitles = [...(values.tema ?? []), ...(values.temas ? values.temas.split(';') : [])].map((t) => t.trim()).filter(Boolean);
  const examenes = (values.examen ?? []).map(parseExamArg);
  const horas = values.horas ? Number(values.horas) : undefined;

  let meta: Meta;
  if (existsSync(metaPath)) {
    if (!values.actualizar) {
      console.error(`Ya existe ${metaPath}. Usa --actualizar para añadir temas/exámenes sin tocar lo demás.`);
      process.exit(1);
    }
    meta = JSON.parse(readFileSync(metaPath, 'utf8')) as Meta;
    for (const ex of examenes) {
      const same = meta.examenes.find((e) => e.fecha === ex.fecha);
      if (!same) meta.examenes.push(ex);
      else Object.assign(same, ex); // same date: update time/type
    }
    const start = meta.temas.length;
    temaTitles.forEach((t, i) => {
      if (!meta.temas.some((x) => x.titulo === t)) meta.temas.push({ slug: temaSlug(start + i + 1, t), titulo: t, estado: 'pendiente', ...(horas ? { horas } : {}) });
    });
  } else {
    meta = {
      slug,
      nombre: values.nombre,
      ...(values.abreviatura ? { abreviatura: values.abreviatura } : {}),
      ...(values.curso ? { curso: Number(values.curso) } : {}),
      semestre: values.semestre,
      estado: 'activa',
      color: values.color ?? PALETTE[[...slug].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length],
      dificultad: values.dificultad ? Number(values.dificultad) : 3,
      ...(values.lenguaje ? { lenguaje: values.lenguaje } : {}),
      examenes,
      temas: temaTitles.map((t, i) => ({ slug: temaSlug(i + 1, t), titulo: t, estado: 'pendiente' as const, ...(horas ? { horas } : {}) })),
    };
  }
  meta.examenes.sort((a, b) => a.fecha.localeCompare(b.fecha));

  const errors = validateAgainst('meta', meta);
  if (errors.length) {
    console.error('meta.json no sería válido:\n' + errors.join('\n'));
    process.exit(1);
  }
  for (const sub of ['apuntes', 'temas']) {
    mkdirSync(join(dir, sub), { recursive: true });
    const keep = join(dir, sub, '.gitkeep');
    if (!existsSync(keep)) writeFileSync(keep, '');
  }
  writeFileSync(metaPath, JSON.stringify({ $schema: '../../schemas/meta.schema.json', ...meta }, null, 2) + '\n');
  console.log(`✅ ${metaPath}`);
  console.log(`   ${meta.temas.length} temas, ${meta.examenes.length} exámenes. Deja tus apuntes en asignaturas/${slug}/apuntes/`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
