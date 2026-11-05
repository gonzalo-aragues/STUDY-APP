// Validates every content file in the repo against /schemas plus cross-file rules.
import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Meta, Plan, TarjetasFile, TareasFile } from '../../shared/types.ts';
import { matchExercises, parseExercises } from './exercises.ts';
import { parseFrontMatter } from './frontmatter.ts';
import { findSubjects, readIfExists, rel, REPO_ROOT, temaDirs } from './paths.ts';
import { MathError, renderMarkdown } from './render.ts';

export type SchemaName = 'meta' | 'tarjetas' | 'plan' | 'tareas';

const validators = new Map<SchemaName, ValidateFunction>();

function schemaPath(name: SchemaName): string {
  return join(REPO_ROOT, 'schemas', `${name}.schema.json`);
}

export function getValidator(name: SchemaName): ValidateFunction {
  let v = validators.get(name);
  if (!v) {
    const ajv = new Ajv({ allErrors: true, strict: false, useDefaults: false });
    v = ajv.compile(JSON.parse(readFileSync(schemaPath(name), 'utf8')));
    validators.set(name, v);
  }
  return v;
}

function formatAjvError(e: ErrorObject): string {
  const where = e.instancePath || '(raíz)';
  const extra =
    e.keyword === 'additionalProperties'
      ? ` (sobra "${(e.params as { additionalProperty: string }).additionalProperty}")`
      : e.keyword === 'enum'
        ? ` (valores permitidos: ${(e.params as { allowedValues: unknown[] }).allowedValues.join(', ')})`
        : '';
  return `${where}: ${e.message}${extra}`;
}

/** Validates one parsed JSON document against a schema. Returns human-readable errors (empty = OK). */
export function validateAgainst(name: SchemaName, data: unknown): string[] {
  const v = getValidator(name);
  if (v(data)) return [];
  return (v.errors ?? []).map(formatAjvError);
}

export function isRealDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export interface ValidationReport {
  errors: string[];
  warnings: string[];
  stats: { asignaturas: number; temas: number; tarjetas: number; ejercicios: number };
}

function parseJson(path: string, root: string, errors: string[]): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    errors.push(`${rel(root, path)}: JSON inválido (${(e as Error).message})`);
    return undefined;
  }
}

function checkMath(md: string, file: string, errors: string[]) {
  try {
    renderMarkdown(md, { strict: true });
  } catch (e) {
    if (e instanceof MathError) errors.push(`${file}: LaTeX inválido en "${e.tex.slice(0, 60)}": ${e.message}`);
    else errors.push(`${file}: no se pudo renderizar (${(e as Error).message})`);
  }
}

export function validateRepo(root = REPO_ROOT): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const stats = { asignaturas: 0, temas: 0, tarjetas: 0, ejercicios: 0 };
  const slugs = new Map<string, string>();
  const temasBySubject = new Map<string, Set<string>>();

  for (const s of findSubjects(root)) {
    const where = rel(root, s.dir);
    if (!existsSync(s.metaPath)) {
      errors.push(`${where}: falta meta.json`);
      continue;
    }
    const meta = parseJson(s.metaPath, root, errors) as Meta | undefined;
    if (meta === undefined) continue;
    const schemaErrors = validateAgainst('meta', meta);
    for (const e of schemaErrors) errors.push(`${where}/meta.json ${e}`);
    if (schemaErrors.length) continue;
    stats.asignaturas++;

    if (meta.slug !== s.slug) errors.push(`${where}/meta.json: slug "${meta.slug}" no coincide con la carpeta "${s.slug}"`);
    if (slugs.has(meta.slug)) errors.push(`${where}: slug "${meta.slug}" repetido (también en ${slugs.get(meta.slug)})`);
    slugs.set(meta.slug, where);
    if (s.archived && meta.estado !== 'archivada') warnings.push(`${where}/meta.json: está en archivo/ pero estado no es "archivada"`);
    if (!s.archived && meta.estado === 'archivada') warnings.push(`${where}/meta.json: estado "archivada" pero sigue en asignaturas/`);
    for (const ex of meta.examenes) if (!isRealDate(ex.fecha)) errors.push(`${where}/meta.json: fecha de examen imposible "${ex.fecha}"`);

    const metaTemas = new Set(meta.temas.map((t) => t.slug));
    temasBySubject.set(meta.slug, metaTemas);
    const seenTemas = new Set<string>();
    for (const t of meta.temas) {
      if (seenTemas.has(t.slug)) errors.push(`${where}/meta.json: tema "${t.slug}" repetido`);
      seenTemas.add(t.slug);
    }
    const dirs = temaDirs(s.dir);
    for (const t of meta.temas) {
      if (!dirs.includes(t.slug) && t.estado && t.estado !== 'pendiente') {
        warnings.push(`${where}: el tema "${t.slug}" está en meta.json como "${t.estado}" pero no existe temas/${t.slug}/`);
      }
    }

    for (const tema of dirs) {
      const tdir = join(s.dir, 'temas', tema);
      const twhere = `${where}/temas/${tema}`;
      if (!metaTemas.has(tema)) warnings.push(`${twhere}: carpeta no listada en meta.json (no se mostrará en la app)`);
      else stats.temas++;

      // tarjetas.json
      const tarjetasPath = join(tdir, 'tarjetas.json');
      if (existsSync(tarjetasPath)) {
        const tj = parseJson(tarjetasPath, root, errors) as TarjetasFile | undefined;
        if (tj !== undefined) {
          const te = validateAgainst('tarjetas', tj);
          for (const e of te) errors.push(`${twhere}/tarjetas.json ${e}`);
          if (!te.length) {
            if (tj.asignatura !== meta.slug) errors.push(`${twhere}/tarjetas.json: asignatura "${tj.asignatura}" debería ser "${meta.slug}"`);
            if (tj.tema !== tema) errors.push(`${twhere}/tarjetas.json: tema "${tj.tema}" debería ser "${tema}"`);
            const ids = new Set<string>();
            for (const c of tj.tarjetas) {
              if (ids.has(c.id)) errors.push(`${twhere}/tarjetas.json: id de tarjeta repetido "${c.id}"`);
              ids.add(c.id);
              checkMath(c.anverso, `${twhere}/tarjetas.json[${c.id}].anverso`, errors);
              checkMath(c.reverso, `${twhere}/tarjetas.json[${c.id}].reverso`, errors);
            }
            stats.tarjetas += tj.tarjetas.length;
          }
        }
      }

      // explicacion.md
      const expl = readIfExists(join(tdir, 'explicacion.md'));
      if (expl !== null) checkMath(parseFrontMatter(expl).body, `${twhere}/explicacion.md`, errors);

      // ejercicios.md <-> soluciones.md
      const ej = readIfExists(join(tdir, 'ejercicios.md'));
      const so = readIfExists(join(tdir, 'soluciones.md'));
      if (ej !== null) {
        checkMath(parseFrontMatter(ej).body, `${twhere}/ejercicios.md`, errors);
        const parsed = parseExercises(ej).blocks;
        if (parsed.length === 0) warnings.push(`${twhere}/ejercicios.md: no hay ningún "### Ejercicio N"`);
        stats.ejercicios += parsed.length;
        for (const b of parsed) if (b.nivel === 'otro') warnings.push(`${twhere}/ejercicios.md: el ejercicio ${b.numero} no está bajo "## Básico", "## Medio" o "## Tipo examen"`);
        if (so === null) {
          if (parsed.length) errors.push(`${twhere}: hay ejercicios.md pero falta soluciones.md`);
        } else {
          checkMath(parseFrontMatter(so).body, `${twhere}/soluciones.md`, errors);
          const m = matchExercises(ej, so);
          if (m.missingSolutions.length) errors.push(`${twhere}: ejercicios sin solución: ${m.missingSolutions.join(', ')}`);
          if (m.orphanSolutions.length) errors.push(`${twhere}: soluciones sin ejercicio: ${m.orphanSolutions.join(', ')}`);
          if (m.duplicateExercises.length) errors.push(`${twhere}: números de ejercicio repetidos: ${m.duplicateExercises.join(', ')}`);
          if (m.duplicateSolutions.length) errors.push(`${twhere}: números de solución repetidos: ${m.duplicateSolutions.join(', ')}`);
          if (m.gaps.length) warnings.push(`${twhere}: faltan números en la secuencia de ejercicios: ${m.gaps.join(', ')}`);
        }
      } else if (so !== null) {
        warnings.push(`${twhere}: hay soluciones.md pero no ejercicios.md`);
      }
    }
  }

  // plan/plan.json and plan/tareas.json
  const planPath = join(root, 'plan', 'plan.json');
  if (existsSync(planPath)) {
    const plan = parseJson(planPath, root, errors) as Plan | undefined;
    if (plan !== undefined) {
      const pe = validateAgainst('plan', plan);
      for (const e of pe) errors.push(`plan/plan.json ${e}`);
      if (!pe.length) {
        for (const w of plan.semanas)
          for (const d of w.dias) {
            if (!isRealDate(d.fecha)) errors.push(`plan/plan.json: fecha imposible "${d.fecha}"`);
            for (const it of d.items) {
              if (it.asignatura !== '*' && !slugs.has(it.asignatura)) warnings.push(`plan/plan.json (${d.fecha}): asignatura desconocida "${it.asignatura}"`);
              else if (it.tema && !temasBySubject.get(it.asignatura)?.has(it.tema)) warnings.push(`plan/plan.json (${d.fecha}): tema desconocido "${it.asignatura}/${it.tema}"`);
            }
          }
      }
    }
  }
  const tareasPath = join(root, 'plan', 'tareas.json');
  if (existsSync(tareasPath)) {
    const tareas = parseJson(tareasPath, root, errors) as TareasFile | undefined;
    if (tareas !== undefined) {
      const te = validateAgainst('tareas', tareas);
      for (const e of te) errors.push(`plan/tareas.json ${e}`);
      if (!te.length) {
        const ids = new Set<string>();
        for (const t of tareas.tareas) {
          if (ids.has(t.id)) errors.push(`plan/tareas.json: id de tarea repetido "${t.id}"`);
          ids.add(t.id);
          const pasos = new Set<string>();
          for (const p of t.pasos) {
            if (pasos.has(p.id)) errors.push(`plan/tareas.json: paso repetido "${t.id}/${p.id}"`);
            pasos.add(p.id);
          }
          if (t.asignatura && !slugs.has(t.asignatura)) warnings.push(`plan/tareas.json: asignatura desconocida "${t.asignatura}" en "${t.id}"`);
        }
      }
    }
  }

  return { errors, warnings, stats };
}
