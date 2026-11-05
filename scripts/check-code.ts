// Compiles (and optionally runs) every complete C++ program found in the material.
//
//   npm run check-code [-- --asignatura prog1]
//
// A ```cpp block counts as a full program if it contains "int main". If the block is followed by
// a fenced block whose first line is "// entrada" (```text), that input is fed to the program
// and, if there is a following "// salida esperada" block, the output is compared.
// Needs g++ (skipped with a warning if missing). Used by the apuntes-a-material skill.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { parseArgs } from 'node:util';
import type { Meta } from '../shared/types.ts';
import { findSubjects, readIfExists, REPO_ROOT } from './lib/paths.ts';

export interface CodeBlock {
  lang: string;
  code: string;
  line: number;
}

export function extractBlocks(md: string): CodeBlock[] {
  const out: CodeBlock[] = [];
  const re = /^```([\w+-]*)[^\n]*\n([\s\S]*?)^```\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) out.push({ lang: m[1].toLowerCase(), code: m[2], line: md.slice(0, m.index).split('\n').length });
  return out;
}

function hasCompiler(): boolean {
  try {
    execFileSync('g++', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  const { values } = parseArgs({ options: { asignatura: { type: 'string' } } });
  if (!hasCompiler()) {
    console.warn('⚠️  No hay g++ instalado: no compruebo el código.');
    return;
  }
  const tmp = mkdtempSync(join(tmpdir(), 'check-code-'));
  let ok = 0;
  const fails: string[] = [];
  for (const s of findSubjects()) {
    const meta = JSON.parse(readFileSync(s.metaPath, 'utf8')) as Meta;
    if (values.asignatura && meta.slug !== values.asignatura) continue;
    if (!['cpp', 'c++'].includes((meta.lenguaje ?? '').toLowerCase())) continue;
    for (const t of meta.temas) {
      for (const f of ['explicacion.md', 'ejercicios.md', 'soluciones.md']) {
        const path = join(s.dir, 'temas', t.slug, f);
        const md = readIfExists(path);
        if (!md) continue;
        const blocks = extractBlocks(md);
        blocks.forEach((b, i) => {
          if (!['cpp', 'c++'].includes(b.lang) || !/\bint\s+main\s*\(/.test(b.code)) return;
          const where = `${relative(REPO_ROOT, path)}:${b.line}`;
          const src = join(tmp, `p${ok + fails.length}.cpp`);
          const exe = src.replace(/\.cpp$/, '');
          writeFileSync(src, b.code);
          const c = spawnSync('g++', ['-std=c++17', '-Wall', '-Wextra', '-Werror', '-o', exe, src], { encoding: 'utf8' });
          if (c.status !== 0) {
            fails.push(`${where}: no compila\n${c.stderr.split('\n').slice(0, 6).join('\n')}`);
            return;
          }
          const next = blocks[i + 1];
          if (next && /^\/\/\s*entrada/i.test(next.code)) {
            const input = next.code.replace(/^\/\/.*\n/, '');
            const r = spawnSync(exe, [], { input, encoding: 'utf8', timeout: 5000 });
            const expected = blocks[i + 2];
            if (expected && /^\/\/\s*salida esperada/i.test(expected.code)) {
              const want = expected.code.replace(/^\/\/.*\n/, '').trim();
              if (r.stdout.trim() !== want) {
                fails.push(`${where}: salida distinta\n--- esperada\n${want}\n--- obtenida\n${r.stdout.trim()}`);
                return;
              }
            }
          }
          ok++;
        });
      }
    }
  }
  for (const f of fails) console.error(`❌ ${f}\n`);
  console.log(`${fails.length ? '❌' : '✅'} ${ok} programas compilan${fails.length ? `, ${fails.length} fallan` : ''}`);
  process.exit(fails.length ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
