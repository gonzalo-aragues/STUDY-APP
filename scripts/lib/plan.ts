// Study-plan generator (pure functions, no I/O). Used by scripts/generar-plan.ts and the
// plan-de-examenes skill.
//
// Two passes:
//  1. Time allocation: every day gets N hours (base, more in the last `diasIntensivos` days before
//     any exam, overrides for special days). Hours are cut into 1–2 h blocks and each block goes to
//     the subject with the largest accumulated "deficit", where each subject's daily entitlement is
//     proportional to dificultad / daysLeft (x2 inside its own intensive window). That naturally
//     handles overlapping exams: the closest exam dominates, the next ones still get time.
//  2. Content: per subject, its blocks are filled in order with learning units built from its temas
//     (explicación sections, ejercicios básico/medio/tipo examen), scaled to fit; the last blocks
//     before the exam become simulacro + repaso final. Subjects without temas get "preparar" items.

import type { DiaPlan, ItemPlan, Plan, SemanaPlan, TipoItemPlan } from '../../shared/types.ts';
import { addDays, daysBetween, formatHours, formatShort, formatLong, mondayOf } from '../../shared/dates.ts';

export interface PlanConfig {
  horasPorDia: number; // default 3
  horasIntensivas: number; // hours/day in the last diasIntensivos days before an exam
  diasIntensivos: number; // default 10
  diasEspeciales: Record<string, number>; // date -> hours (overrides everything)
  horasDiaExamen: number; // hours on an exam day if another exam is close (default 1.5)
  diasExamenCercano: number; // "close" threshold for the rule above (default 4)
  notas?: string[];
}

export const DEFAULT_CONFIG: PlanConfig = {
  horasPorDia: 3,
  horasIntensivas: 5,
  diasIntensivos: 10,
  diasEspeciales: {},
  horasDiaExamen: 1.5,
  diasExamenCercano: 4,
};

export interface PlanTema {
  slug: string;
  titulo: string;
  horas: number;
  secciones: string[]; // "##" headings of explicacion.md
  ejercicios: { basico: number[]; medio: number[]; examen: number[] };
  tieneMaterial: boolean;
}

export interface PlanSubject {
  slug: string;
  nombre: string;
  abreviatura: string;
  dificultad: number;
  examen: string; // next exam date (YYYY-MM-DD)
  temas: PlanTema[];
}

export interface PlanInput {
  desde: string;
  subjects: PlanSubject[];
  config: PlanConfig;
}

interface Block {
  fecha: string;
  asignatura: string;
  horas: number;
}

const EPS = 1e-6;

function roundHalf(h: number): number {
  return Math.round(h * 2) / 2;
}

/** Hours available on a given day (exam-day rules are applied separately). */
export function hoursForDay(fecha: string, subjects: PlanSubject[], cfg: PlanConfig): number {
  if (fecha in cfg.diasEspeciales) return cfg.diasEspeciales[fecha];
  const intensive = subjects.some((s) => {
    const d = daysBetween(fecha, s.examen);
    return d >= 1 && d <= cfg.diasIntensivos;
  });
  return intensive ? cfg.horasIntensivas : cfg.horasPorDia;
}

/** Split a day's hours into 1–2 h blocks: 3 -> [1.5, 1.5]; 5 -> [2, 1.5, 1.5]; 1 -> [1]. */
export function splitBlocks(h: number): number[] {
  if (h <= EPS) return [];
  const n = Math.min(4, Math.max(1, Math.round(h / 1.5)));
  const base = Math.floor((h / n) * 2) / 2 || 0.5;
  const blocks = Array.from({ length: n }, () => base);
  let rest = roundHalf(h - base * n);
  for (let i = 0; rest > EPS; i = (i + 1) % n) {
    blocks[i] += 0.5;
    rest -= 0.5;
  }
  return blocks;
}

/** Daily weight of a subject: dificultad / daysLeft, doubled inside the intensive window. */
export function weight(s: PlanSubject, fecha: string, cfg: PlanConfig): number {
  const d = daysBetween(fecha, s.examen);
  if (d <= 0) return 0;
  const w = s.dificultad / d;
  return d <= cfg.diasIntensivos ? w * 2 : w;
}

interface DaySkeleton {
  fecha: string;
  horas: number;
  examenes: string[]; // subjects with an exam today
  blocks: Block[];
}

/** Pass 1: who gets each block of time. */
export function allocate(input: PlanInput): DaySkeleton[] {
  const { subjects, config: cfg } = input;
  const last = subjects.reduce((m, s) => (s.examen > m ? s.examen : m), input.desde);
  const deficit = new Map(subjects.map((s) => [s.slug, 0]));
  const days: DaySkeleton[] = [];

  for (let fecha = input.desde; fecha <= last; fecha = addDays(fecha, 1)) {
    const examenes = subjects.filter((s) => s.examen === fecha).map((s) => s.slug);
    const pending = subjects.filter((s) => s.examen > fecha);
    let horas = hoursForDay(fecha, subjects, cfg);
    if (examenes.length) {
      const close = pending.some((s) => daysBetween(fecha, s.examen) <= cfg.diasExamenCercano);
      horas = fecha in cfg.diasEspeciales ? Math.min(horas, cfg.horasDiaExamen) : close ? cfg.horasDiaExamen : 0;
    }
    const day: DaySkeleton = { fecha, horas: pending.length ? horas : 0, examenes, blocks: [] };
    days.push(day);
    if (!pending.length || horas <= EPS) continue;

    const weights = pending.map((s) => weight(s, fecha, cfg));
    const total = weights.reduce((a, b) => a + b, 0);
    pending.forEach((s, i) => deficit.set(s.slug, deficit.get(s.slug)! + (horas * weights[i]) / total));

    // On an exam day the little time left goes to the next exam only.
    const candidates = examenes.length ? [[...pending].sort((a, b) => a.examen.localeCompare(b.examen))[0]] : pending;
    for (const h of splitBlocks(horas)) {
      // Largest deficit wins; ties -> earliest exam.
      const pick = [...candidates].sort((a, b) => deficit.get(b.slug)! - deficit.get(a.slug)! || a.examen.localeCompare(b.examen))[0];
      deficit.set(pick.slug, deficit.get(pick.slug)! - h);
      day.blocks.push({ fecha, asignatura: pick.slug, horas: h });
    }
  }
  return days;
}

interface Unit {
  tema?: string;
  tipo: TipoItemPlan;
  label: string;
  horas: number;
}

function range(nums: number[]): string {
  if (!nums.length) return '';
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted.length === 1 ? `${sorted[0]}` : `${sorted[0]}–${sorted[sorted.length - 1]}`;
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  const size = Math.ceil(arr.length / n);
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Learning units for one tema (hours are the unscaled estimate). */
export function temaUnits(t: PlanTema): Unit[] {
  const h = t.horas;
  if (!t.tieneMaterial) {
    return [
      { tema: t.slug, tipo: 'aprender', label: `«${t.titulo}»: estudia con tus apuntes de clase (o genera el material con apuntes-a-material)`, horas: h * 0.6 },
      { tema: t.slug, tipo: 'practicar', label: `«${t.titulo}»: problemas de clase / hojas del profesor`, horas: h * 0.4 },
    ];
  }
  const units: Unit[] = [];
  const explH = h * 0.4;
  const parts = Math.max(1, Math.min(t.secciones.length, Math.round(explH / 1.25)));
  if (t.secciones.length) {
    const groups = chunk(t.secciones, parts);
    groups.forEach((g, i) => {
      const part = groups.length > 1 ? ` (${i + 1}/${groups.length})` : '';
      const which = g.length === 1 ? `«${g[0]}»` : g.length === 2 ? `«${g[0]}» y «${g[1]}»` : `de «${g[0]}» a «${g[g.length - 1]}»`;
      units.push({ tema: t.slug, tipo: 'aprender', label: `«${t.titulo}»: lee la explicación${part}, ${which}`, horas: explH / groups.length });
    });
  } else {
    units.push({ tema: t.slug, tipo: 'aprender', label: `«${t.titulo}»: lee la explicación`, horas: explH });
  }
  const { basico, medio, examen } = t.ejercicios;
  const levels: [number[], string, number][] = [
    [basico, 'ejercicios básicos', 0.2],
    [medio, 'ejercicios de nivel medio', 0.22],
    [examen, 'ejercicios tipo examen', 0.18],
  ];
  const present = levels.filter(([n]) => n.length);
  const share = present.reduce((a, [, , s]) => a + s, 0) || 1;
  for (const [nums, name, s] of present) {
    units.push({ tema: t.slug, tipo: 'practicar', label: `«${t.titulo}»: ${name} ${range(nums)}`, horas: (h * 0.6 * s) / share });
  }
  if (!present.length) units.push({ tema: t.slug, tipo: 'practicar', label: `«${t.titulo}»: ejercicios`, horas: h * 0.6 });
  return units;
}

/** Pass 2: fill a subject's blocks with content. Returns items per block (same order). */
export function fillSubject(s: PlanSubject, blocks: Block[]): { items: Unit[][]; escala: number } {
  const out: Unit[][] = blocks.map(() => []);
  if (!blocks.length) return { items: out, escala: 1 };
  const examDay = s.examen;
  // Final review: blocks on the day before the exam; simulacro: blocks 2–3 days before.
  const role: ('learn' | 'simulacro' | 'corregir' | 'final')[] = blocks.map((b) => {
    const d = daysBetween(b.fecha, examDay);
    return d <= 1 ? 'final' : d === 2 ? 'corregir' : d === 3 ? 'simulacro' : 'learn';
  });
  const learnIdx = blocks.map((_, i) => i).filter((i) => role[i] === 'learn');
  const learnHours = learnIdx.reduce((a, i) => a + blocks[i].horas, 0);

  let units: Unit[] = [];
  if (!s.temas.length) {
    units.push({ tipo: 'preparar', label: `Organiza el material de ${s.abreviatura}: deja tus apuntes en asignaturas/${s.slug}/apuntes/, añade los temas a meta.json y ejecuta apuntes-a-material`, horas: 1.5 });
  } else {
    for (const t of s.temas) units.push(...temaUnits(t));
  }
  const work = units.reduce((a, u) => a + u.horas, 0);
  // Scale to the available time; up to 25% slower if there is spare time (rest -> repaso).
  // 10 % slack: small leftovers at the end of blocks are absorbed instead of starting new units.
  const escala = !s.temas.length ? 1 : Math.min(1.5, (learnHours * 0.9) / work);
  if (s.temas.length) units = units.map((u) => ({ ...u, horas: u.horas * escala }));

  let ui = 0;
  let left = units[0]?.horas ?? 0;
  let started = false;
  let repasoTurn = 0;
  for (const i of learnIdx) {
    let cap = blocks[i].horas;
    while (cap > EPS && ui < units.length) {
      const u = units[ui];
      const take = Math.min(cap, left);
      const finishes = left - take < 0.25; // swallow tiny leftovers
      const suffix = !started && finishes ? '' : !started ? ' (empieza)' : finishes ? ' (termina)' : ' (sigue)';
      out[i].push({ ...u, label: u.label + suffix, horas: take });
      cap -= take;
      if (finishes) {
        ui++;
        left = units[ui]?.horas ?? 0;
        started = false;
        // Don't start a new unit in the last few minutes of a block: give them to this one.
        if (cap > EPS && cap < 0.5 && ui < units.length) {
          out[i][out[i].length - 1].horas += cap;
          cap = 0;
        }
      } else {
        left -= take;
        started = true;
      }
    }
    if (cap > EPS && ui >= units.length) {
      // Spare time: rotating review of temas (or generic study if there are no temas).
      if (s.temas.length) {
        const turn = repasoTurn++;
        const t = s.temas[turn % s.temas.length];
        const ex = t.ejercicios.examen.length ? `los ejercicios tipo examen ${range(t.ejercicios.examen)}` : 'los ejercicios';
        const med = t.ejercicios.medio.length ? `los ejercicios medios ${range(t.ejercicios.medio)}` : 'los ejercicios';
        const kinds = [
          `rehaz ${ex} sin mirar la solución`,
          `escribe una chuleta de una cara con lo esencial y rehaz ${med}`,
          `repasa sus tarjetas y explica en voz alta los errores típicos; luego rehaz los ejercicios que fallaste`,
        ];
        const kind = kinds[Math.floor(turn / s.temas.length) % kinds.length];
        out[i].push({ tema: t.slug, tipo: 'repasar', label: `Repasa «${t.titulo}»: ${kind}`, horas: cap });
      } else {
        out[i].push({ tipo: 'aprender', label: `Estudia ${s.abreviatura} con tus apuntes: siguiente tema que tengas pendiente y sus problemas`, horas: cap });
      }
    }
  }
  for (let i = 0; i < blocks.length; i++) {
    if (role[i] === 'simulacro') {
      out[i].push({
        tipo: 'simulacro',
        label: s.temas.length
          ? `Simulacro: ejercicios tipo examen mezclados de todos los temas, con reloj y sin mirar soluciones; luego corrige`
          : `Simulacro: examen de otros años o problemas de clase, con reloj; luego corrige`,
        horas: blocks[i].horas,
      });
    } else if (role[i] === 'corregir') {
      out[i].push({
        tipo: 'repasar',
        label: s.temas.length
          ? `Corrige el simulacro y repasa a fondo los temas donde más fallaste (rehaz esos ejercicios)`
          : `Repasa los problemas que más te cuestan y tus apuntes de los temas flojos`,
        horas: blocks[i].horas,
      });
    } else if (role[i] === 'final') {
      out[i].push({ tipo: 'repasar', label: `Repaso final: tarjetas, fórmulas y los errores que más repites. Nada nuevo; duerme bien`, horas: blocks[i].horas });
    }
  }
  return { items: out, escala };
}

const DESCANSO_TEXT = 'Descanso: hoy no toca estudiar';

export interface GeneratedPlan {
  plan: Plan;
  markdown: string;
  warnings: string[];
}

export function generatePlan(input: PlanInput, generado = input.desde): GeneratedPlan {
  const cfg = input.config;
  const warnings: string[] = [];
  const subjects = input.subjects.filter((s) => s.examen >= input.desde);
  const skeleton = allocate({ ...input, subjects });
  const bySlug = new Map(subjects.map((s) => [s.slug, s]));

  // Content per subject.
  const filled = new Map<Block, Unit[]>();
  for (const s of subjects) {
    const blocks = skeleton.flatMap((d) => d.blocks.filter((b) => b.asignatura === s.slug));
    const { items, escala } = fillSubject(s, blocks);
    blocks.forEach((b, i) => filled.set(b, items[i]));
    if (s.temas.length && escala < 0.8) {
      warnings.push(`${s.abreviatura}: vas justo de tiempo (ritmo al ${Math.round(escala * 100)} % de las horas estimadas por tema). Prioriza lo que más cae en el examen.`);
    }
  }

  const dias: DiaPlan[] = skeleton.map((d) => {
    const items: ItemPlan[] = [];
    for (const slug of d.examenes) {
      items.push({ asignatura: slug, tipo: 'examen', texto: `¡Examen de ${bySlug.get(slug)!.abreviatura}! Por la mañana solo un repaso ligero de tarjetas. Suerte.` });
    }
    if (d.horas > EPS && d.blocks.length) {
      items.push({ asignatura: '*', tipo: 'repasar', texto: 'Tarjetas pendientes en la app (10–15 min, mejor al empezar)' });
    }
    // Merge consecutive units with the same subject/tema/tipo/label stem.
    // Group a subject's blocks together within the day (keeps the order of first appearance).
    const order = [...new Set(d.blocks.map((b) => b.asignatura))];
    const blocks = [...d.blocks].sort((a, b) => order.indexOf(a.asignatura) - order.indexOf(b.asignatura));
    for (const b of blocks) {
      for (const u of filled.get(b) ?? []) {
        const prev = items[items.length - 1];
        const stem = (l: string) => l.replace(/ \((empieza|sigue|termina)\)$/, '');
        if (prev && prev.asignatura === b.asignatura && prev.tema === u.tema && prev.tipo === u.tipo && stem(prev.texto) === stem(u.label)) {
          prev.horas = (prev.horas ?? 0) + u.horas;
          const a = /\((empieza|sigue|termina)\)$/.exec(prev.texto)?.[1];
          const c = /\((empieza|sigue|termina)\)$/.exec(u.label)?.[1];
          const hasStart = !a || a === 'empieza';
          const hasEnd = !c || c === 'termina';
          const merged = hasStart && hasEnd ? '' : hasStart ? ' (empieza)' : hasEnd ? ' (termina)' : ' (sigue)';
          prev.texto = stem(prev.texto) + merged;
        } else {
          items.push({ asignatura: b.asignatura, ...(u.tema ? { tema: u.tema } : {}), tipo: u.tipo, texto: u.label, horas: u.horas });
        }
      }
    }
    for (const it of items) if (it.horas !== undefined) it.horas = Math.max(0.5, roundHalf(it.horas));
    if (!items.length) items.push({ asignatura: '*', tipo: 'descanso', texto: DESCANSO_TEXT });
    const dia: DiaPlan = { fecha: d.fecha, horas: d.horas, items };
    if (d.fecha in cfg.diasEspeciales) dia.nota = 'Día especial (festivo): menos horas';
    return dia;
  });

  // Weeks (Monday–Sunday).
  const semanas: SemanaPlan[] = [];
  for (const dia of dias) {
    const lunes = mondayOf(dia.fecha);
    let w = semanas[semanas.length - 1];
    if (!w || w.inicio !== lunes) {
      w = { inicio: lunes, fin: addDays(lunes, 6), titulo: '', dias: [] };
      semanas.push(w);
    }
    w.dias.push(dia);
  }
  semanas.forEach((w, i) => {
    const examsThisWeek = subjects.filter((s) => s.examen >= w.inicio && s.examen <= w.fin).sort((a, b) => a.examen.localeCompare(b.examen));
    const intensive = subjects.filter((s) => {
      const d = daysBetween(w.fin, s.examen);
      return s.examen > w.fin && d <= cfg.diasIntensivos - 3;
    });
    const label = examsThisWeek.length
      ? `${examsThisWeek.length > 1 ? 'Exámenes' : 'Examen'}: ${examsThisWeek.map((s) => `${s.abreviatura} (${formatShort(s.examen)})`).join(', ')}`
      : intensive.length
        ? `Recta final de ${intensive.map((s) => s.abreviatura).join(' y ')}`
        : i === 0
          ? 'Arranque: ponerse en marcha con todo'
          : 'Ponerse al día';
    w.titulo = `Semana ${i + 1} · ${label}`;
    const hours = new Map<string, number>();
    for (const d of w.dias) for (const it of d.items) if (it.asignatura !== '*' && it.horas) hours.set(it.asignatura, (hours.get(it.asignatura) ?? 0) + it.horas);
    const ordered = [...hours.entries()].sort((a, b) => b[1] - a[1]);
    w.objetivo = ordered.length
      ? `Reparto: ${ordered.map(([slug, h]) => `${bySlug.get(slug)!.abreviatura} ${formatHours(h)} h`).join(' · ')}`
      : 'Semana sin estudio planificado';
  });

  const last = subjects.reduce((m, s) => (s.examen > m ? s.examen : m), input.desde);
  const plan: Plan = {
    generado,
    desde: input.desde,
    hasta: last,
    horasPorDia: cfg.horasPorDia,
    notas: [...(cfg.notas ?? []), ...warnings],
    semanas,
  };
  return { plan, markdown: planToMarkdown(plan, subjects, cfg), warnings };
}

const TIPO_ICON: Record<TipoItemPlan, string> = {
  aprender: '📖',
  practicar: '✏️',
  repasar: '🔁',
  simulacro: '⏱️',
  examen: '🎯',
  preparar: '🧰',
  descanso: '🌿',
};

export function planToMarkdown(plan: Plan, subjects: PlanSubject[], cfg: PlanConfig): string {
  const name = new Map(subjects.map((s) => [s.slug, s.abreviatura]));
  const L: string[] = [];
  L.push(`# Plan de estudio — hasta el ${formatLong(plan.hasta)}`);
  L.push('');
  L.push(`> Generado el ${formatLong(plan.generado)} con \`npm run plan\` (skill **plan-de-examenes**). No es un horario: es una guía de **qué** toca cada día. Haz los bloques en el orden y a la hora que quieras.`);
  L.push('');
  L.push('## Exámenes');
  L.push('');
  L.push('| Asignatura | Fecha | Días desde el inicio del plan |');
  L.push('|---|---|---|');
  for (const s of [...subjects].sort((a, b) => a.examen.localeCompare(b.examen))) {
    L.push(`| ${s.nombre} | ${formatLong(s.examen)} | ${daysBetween(plan.desde, s.examen)} |`);
  }
  L.push('');
  L.push('## Reglas del plan');
  L.push('');
  L.push(`- **${formatHours(cfg.horasPorDia)} h/día** normalmente; **${formatHours(cfg.horasIntensivas)} h/día** en los ${cfg.diasIntensivos} días antes de cada examen.`);
  L.push('- Cada día empieza con las **tarjetas pendientes** de la app (10–15 min).');
  L.push('- Los bloques son de 1–2 h. Si un bloque se te hace grande, usa **dividir-tarea** para trocearlo en pasos de 15–25 min.');
  L.push('- Si te retrasas, **no intentes recuperarlo todo**: vuelve a ejecutar `npm run plan` (o la skill) y el plan se recalcula desde hoy.');
  L.push('- Tres días antes de cada examen: **simulacro**; dos días antes: **corregirlo** y repasar lo flojo; el día antes: **repaso final**, nada nuevo.');
  const especiales = Object.entries(cfg.diasEspeciales).sort();
  if (especiales.length) L.push(`- Días especiales: ${especiales.map(([d, h]) => `${formatShort(d)} (${formatHours(h)} h)`).join(', ')}.`);
  for (const n of plan.notas ?? []) L.push(`- ⚠️ ${n}`);
  L.push('');
  L.push(`Leyenda: ${Object.entries(TIPO_ICON).map(([k, v]) => `${v} ${k}`).join(' · ')}`);
  L.push('');
  for (const w of plan.semanas) {
    L.push(`## ${w.titulo}`);
    L.push('');
    L.push(`*${formatShort(w.inicio)} – ${formatShort(w.fin)}* · ${w.objetivo ?? ''}`);
    L.push('');
    for (const d of w.dias) {
      const h = d.horas ? ` — ${formatHours(d.horas)} h` : '';
      L.push(`- **${formatShort(d.fecha)}**${h}${d.nota ? ` *(${d.nota})*` : ''}`);
      for (const it of d.items) {
        const who = it.asignatura === '*' ? '' : `**${name.get(it.asignatura) ?? it.asignatura}** · `;
        const hh = it.horas ? ` *(≈${formatHours(it.horas)} h)*` : '';
        L.push(`  - ${TIPO_ICON[it.tipo]} ${who}${it.texto}${hh}`);
      }
    }
    L.push('');
  }
  return L.join('\n');
}
