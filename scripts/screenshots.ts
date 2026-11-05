// Visual check: serves dist/ under the Pages base path, opens every screen in headless Chromium
// at phone (390 px) and desktop (1280 px) width, light and dark, saves screenshots and reports
// horizontal overflow, KaTeX errors and console errors.
//
//   npm run build && node scripts/screenshots.ts [--out screenshots] [--only hoy,repasar]
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, normalize } from 'node:path';
import { parseArgs } from 'node:util';
import { REPO_ROOT } from './lib/paths.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { chromium } = createRequire(import.meta.url)('playwright') as { chromium: any };

const { values } = parseArgs({ options: { out: { type: 'string' }, only: { type: 'string' }, base: { type: 'string' }, hoy: { type: 'string' } } });
const BASE = values.base ?? '/STUDY-APP/';
const OUT = join(REPO_ROOT, values.out ?? 'screenshots');
const HOY = values.hoy ?? '2026-11-05';
const DIST = join(REPO_ROOT, 'dist');
if (!existsSync(join(DIST, 'index.html'))) {
  console.error('Falta dist/: ejecuta antes npm run build');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const TYPES: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.webmanifest': 'application/manifest+json' };
const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  if (!url.pathname.startsWith(BASE)) {
    res.writeHead(404).end();
    return;
  }
  let p = normalize(join(DIST, decodeURIComponent(url.pathname.slice(BASE.length))));
  if (!p.startsWith(DIST)) return void res.writeHead(403).end();
  if (!existsSync(p) || statSync(p).isDirectory()) p = join(DIST, 'index.html');
  res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise<void>((r) => server.listen(0, r));
const port = (server.address() as { port: number }).port;
const origin = `http://127.0.0.1:${port}${BASE}?hoy=${HOY}`;

interface Shot {
  name: string;
  hash: string;
  action?: string; // css selector to click before the screenshot
  fullPage?: boolean;
}
const SHOTS: Shot[] = [
  { name: 'hoy', hash: '#/hoy', fullPage: true },
  { name: 'repasar-anverso', hash: '#/repasar' },
  { name: 'repasar-reverso', hash: '#/repasar', action: '.reveal' },
  { name: 'repasar-5min', hash: '#/repasar?modo=5min' },
  { name: 'asignaturas', hash: '#/asignaturas', fullPage: true },
  { name: 'asignatura-calculo', hash: '#/asignaturas/calculo', fullPage: true },
  { name: 'asignatura-ic', hash: '#/asignaturas/ic' },
  { name: 'tema-explicacion', hash: '#/asignaturas/calculo/01-numeros-complejos' },
  { name: 'tema-ejercicios', hash: '#/asignaturas/calculo/01-numeros-complejos/ejercicios', action: 'details.solution > summary' },
  { name: 'tema-prog1-ejercicios', hash: '#/asignaturas/prog1/03-bucles/ejercicios', action: 'details.solution > summary' },
  { name: 'tema-algebra-explicacion', hash: '#/asignaturas/algebra/02-estructuras-algebraicas', fullPage: true },
  { name: 'examenes', hash: '#/examenes', fullPage: true },
  { name: 'tareas', hash: '#/tareas', fullPage: true },
  { name: 'plan', hash: '#/plan', fullPage: true },
  { name: 'ajustes', hash: '#/ajustes', fullPage: true },
];
const only = values.only?.split(',');

const browser = await chromium.launch();
const problems: string[] = [];
for (const vp of [
  { tag: 'movil', width: 390, height: 844 },
  { tag: 'escritorio', width: 1280, height: 860 },
]) {
  for (const scheme of ['light', 'dark'] as const) {
    if (vp.tag === 'escritorio' && scheme === 'dark') continue; // one dark set (phone) is enough
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, colorScheme: scheme, locale: 'es-ES' });
    const page = await context.newPage();
    page.on('console', (m: { type(): string; text(): string }) => {
      if (m.type() === 'error') problems.push(`[${vp.tag}/${scheme}] consola: ${m.text()}`);
    });
    page.on('pageerror', (e: Error) => problems.push(`[${vp.tag}/${scheme}] error: ${e.message}`));
    for (const s of SHOTS) {
      if (only && !only.includes(s.name)) continue;
      await page.goto(`${origin}${s.hash}`);
      await page.waitForSelector('.screen', { timeout: 10_000 });
      await page.waitForTimeout(150);
      if (s.action) {
        const el = await page.$(s.action);
        if (el) {
          await el.click();
          await page.waitForTimeout(150);
        } else problems.push(`[${vp.tag}] ${s.name}: no encuentro ${s.action}`);
      }
      await page.evaluate(() => document.fonts.ready);
      const check = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const over: string[] = [];
        for (const el of Array.from(document.querySelectorAll('.view *'))) {
          const r = (el as HTMLElement).getBoundingClientRect();
          if (r.width === 0) continue;
          // Elements inside horizontal scrollers are fine.
          if ((el as HTMLElement).closest('.katex-display, .math-block, pre, .table-wrap, .segmented')) continue;
          if (r.right > vw + 1 || r.left < -1) over.push(`${el.tagName.toLowerCase()}.${(el as HTMLElement).className}`.slice(0, 80));
        }
        return {
          scrollW: document.documentElement.scrollWidth,
          vw,
          over: [...new Set(over)].slice(0, 5),
          katex: document.querySelectorAll('.katex').length,
          mathErrors: document.querySelectorAll('.math-error, .katex-error').length,
        };
      });
      if (check.scrollW > check.vw + 1) problems.push(`[${vp.tag}/${scheme}] ${s.name}: scroll horizontal (${check.scrollW} > ${check.vw})`);
      if (check.over.length) problems.push(`[${vp.tag}/${scheme}] ${s.name}: se sale del ancho: ${check.over.join(', ')}`);
      if (check.mathErrors) problems.push(`[${vp.tag}/${scheme}] ${s.name}: ${check.mathErrors} fórmulas con error`);
      const file = join(OUT, `${vp.tag}-${scheme}-${s.name}.png`);
      await page.screenshot({ path: file, fullPage: Boolean(s.fullPage) });
      console.log(`📸 ${vp.tag}-${scheme}-${s.name}.png  (katex: ${check.katex})`);
    }
    await context.close();
  }
}
await browser.close();
server.close();
if (problems.length) {
  console.log('\nProblemas:');
  for (const p of problems) console.log(' - ' + p);
  process.exitCode = 1;
} else console.log('\n✅ Sin desbordamientos, sin errores de KaTeX ni de consola.');
