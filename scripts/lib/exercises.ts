// Parser for ejercicios.md / soluciones.md and the exercise <-> solution matching.
//
// Conventions (documented in CLAUDE.md and the apuntes-a-material skill):
//   ejercicios.md   ## Básico | ## Medio | ## Tipo examen      (level sections)
//                   ### Ejercicio N[. Título opcional]          (one per exercise)
//   soluciones.md   ### Solución N[. Título opcional]           (same N)
// Numbering is global within the tema (1, 2, 3... across all levels).
// Headings inside fenced code blocks are ignored.

import type { Nivel } from '../../shared/types.ts';
import { parseFrontMatter } from './frontmatter.ts';

export interface ParsedBlock {
  numero: number;
  titulo: string;
  body: string;
  nivel: Nivel;
  line: number; // 1-based line of the heading
}

const EXERCISE_RE = /^###\s+Ejercicio\s+(\d+)\b\s*[.:—–-]?\s*(.*)$/i;
const SOLUTION_RE = /^###\s+Soluci[oó]n\s+(\d+)\b\s*[.:—–-]?\s*(.*)$/i;
const LEVEL_RE = /^##\s+(.+?)\s*$/;

export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function levelFromHeading(text: string): Nivel {
  const t = normalize(text);
  if (t.startsWith('basico')) return 'basico';
  if (t.startsWith('medio')) return 'medio';
  if (t.includes('examen')) return 'examen';
  return 'otro';
}

function parseBlocks(md: string, headingRe: RegExp): { blocks: ParsedBlock[]; preamble: string } {
  const { body } = parseFrontMatter(md);
  const lines = body.split(/\r?\n/);
  const blocks: ParsedBlock[] = [];
  const preamble: string[] = [];
  let current: ParsedBlock | null = null;
  let buf: string[] = [];
  let nivel: Nivel = 'otro';
  let fence: string | null = null;

  const flush = () => {
    if (current) {
      current.body = buf.join('\n').trim();
      blocks.push(current);
    }
    current = null;
    buf = [];
  };

  lines.forEach((line, i) => {
    const fenceMatch = /^\s*(```+|~~~+)/.exec(line);
    if (fenceMatch) {
      if (fence === null) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = null;
    }
    if (fence === null || fenceMatch) {
      const h = fence === null ? headingRe.exec(line) : null;
      if (h) {
        flush();
        current = { numero: Number(h[1]), titulo: h[2].trim(), body: '', nivel, line: i + 1 };
        return;
      }
      const lv = fence === null && !line.startsWith('###') ? LEVEL_RE.exec(line) : null;
      if (lv) {
        flush();
        nivel = levelFromHeading(lv[1]);
        return;
      }
    }
    if (current) buf.push(line);
    else preamble.push(line);
  });
  flush();
  return { blocks, preamble: preamble.join('\n').trim() };
}

export function parseExercises(md: string) {
  return parseBlocks(md, EXERCISE_RE);
}

export function parseSolutions(md: string) {
  return parseBlocks(md, SOLUTION_RE);
}

export interface MatchResult {
  pairs: { ejercicio: ParsedBlock; solucion: ParsedBlock | null }[];
  missingSolutions: number[]; // exercises without solution
  orphanSolutions: number[]; // solutions without exercise
  duplicateExercises: number[];
  duplicateSolutions: number[];
  gaps: number[]; // numbers skipped in the 1..max exercise sequence
}

function duplicates(nums: number[]): number[] {
  const seen = new Set<number>();
  const dup = new Set<number>();
  for (const n of nums) (seen.has(n) ? dup : seen).add(n);
  return [...dup].sort((a, b) => a - b);
}

export function matchExercises(ejerciciosMd: string, solucionesMd: string | null): MatchResult {
  const ex = parseExercises(ejerciciosMd).blocks;
  const sol = solucionesMd ? parseSolutions(solucionesMd).blocks : [];
  const solByNum = new Map<number, ParsedBlock>();
  for (const s of sol) if (!solByNum.has(s.numero)) solByNum.set(s.numero, s);
  const exNums = new Set(ex.map((e) => e.numero));
  const max = ex.reduce((m, e) => Math.max(m, e.numero), 0);
  const gaps: number[] = [];
  for (let n = 1; n <= max; n++) if (!exNums.has(n)) gaps.push(n);
  return {
    pairs: ex.map((e) => ({ ejercicio: e, solucion: solByNum.get(e.numero) ?? null })),
    missingSolutions: ex.filter((e) => !solByNum.has(e.numero)).map((e) => e.numero),
    orphanSolutions: sol.filter((s) => !exNums.has(s.numero)).map((s) => s.numero),
    duplicateExercises: duplicates(ex.map((e) => e.numero)),
    duplicateSolutions: duplicates(sol.map((s) => s.numero)),
    gaps,
  };
}
