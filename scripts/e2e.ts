// End-to-end smoke test in headless Chromium against the production build (dist/).
//   npm run build && npm run e2e
// Checks: review flow (reveal, rate, requeue, undo) persists in IndexedDB across reloads, the
// 5-minute session starts, task steps stay ticked, exercises show their solution, and a backup
// exported from one browser imports into a fresh one.
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { REPO_ROOT } from './lib/paths.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { chromium } = createRequire(import.meta.url)('playwright') as { chromium: any };
const BASE = '/STUDY-APP/';
const DIST = join(REPO_ROOT, 'dist');
if (!existsSync(join(DIST, 'index.html'))) {
  console.error('Falta dist/: ejecuta antes npm run build');
  process.exit(1);
}
const TYPES: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  let p = normalize(join(DIST, decodeURIComponent(url.pathname.slice(BASE.length))));
  if (!p.startsWith(DIST) || !existsSync(p) || statSync(p).isDirectory()) p = join(DIST, 'index.html');
  res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise<void>((r) => server.listen(0, r));
const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}${BASE}?hoy=2026-11-05`;

let failures = 0;
function check(cond: unknown, msg: string) {
  console.log(`${cond ? '✅' : '❌'} ${msg}`);
  if (!cond) failures++;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors: string[] = [];
page.on('pageerror', (e: Error) => errors.push(e.message));

// --- Hoy -> Repasar in one tap
await page.goto(`${origin}#/hoy`);
await page.waitForSelector('.hero');
const nuevas = await page.textContent('.hero-count');
check(/15 nuevas/.test(nuevas ?? ''), `Hoy muestra las tarjetas nuevas (${nuevas?.replace(/\s+/g, ' ').trim()})`);
await page.click('text=Repasar ahora');
await page.waitForSelector('.flash');
const firstMeta = await page.textContent('.flash-meta');
check(/PROG1|Álgebra/.test(firstMeta ?? ''), `La primera tarjeta nueva es de un tema ya planificado (${firstMeta?.trim()})`);

// --- reveal + rate 3 cards: Bien, Otra vez, Fácil
const remaining = async () => Number(((await page.textContent('.session-bar > span:first-child')) ?? '').match(/Quedan (\d+)/)?.[1]);
const q0 = await remaining();
await page.keyboard.press('Space');
await page.waitForSelector('.ratings');
check((await page.textContent('.rate-1')) !== null, 'Al revelar aparecen los 4 botones');
await page.click('.rate-3');
await page.click('.reveal');
await page.click('.rate-1'); // "Otra vez": the card comes back in this session
await page.click('.reveal');
await page.click('.rate-4');
await page.waitForFunction((n: number) => document.querySelector('.session-bar > span')?.textContent === `Quedan ${n}`, q0 - 1);
const q1 = await remaining();
check(q1 === q0 - 1, `Tras 3 respuestas quedan ${q1} de ${q0}: las 2 que siguen en aprendizaje vuelven a la cola`);

// --- undo the last answer
await page.click('button[aria-label="Deshacer última respuesta"]');
await page.waitForSelector('.ratings');
await page.waitForTimeout(100);
check((await remaining()) === q1 + 1, 'Deshacer devuelve la tarjeta y deja elegir otra respuesta');
await page.click('.rate-3');

// --- persisted after reload
const count = async () => page.evaluate(() => new Promise<number>((res) => {
  const r = indexedDB.open('study-app');
  r.onsuccess = () => {
    const tx = r.result.transaction('reviews', 'readonly').objectStore('reviews').count();
    tx.onsuccess = () => res(tx.result);
  };
}));
check((await count()) === 3, 'Se han guardado 3 repasos en IndexedDB (el deshecho se borró)');
await page.goto(`${origin}#/hoy`);
await page.reload();
await page.waitForSelector('.hero');
check(/\+ 12 nuevas/.test((await page.textContent('.hero-count')) ?? ''), 'Tras recargar, Hoy descuenta las 3 nuevas ya vistas (quedan 12 hoy)');

// --- 5-minute session
await page.click('text=Sesión de 5 minutos');
await page.waitForSelector('.timer');
check(/^[45]:\d\d$/.test(((await page.textContent('.timer')) ?? '').trim()), 'La sesión de 5 minutos muestra la cuenta atrás');

// --- tasks: tick a step, reload, still ticked
await page.goto(`${origin}#/tareas`);
await page.waitForSelector('.task');
await page.locator('.task').first().locator('input[type=checkbox]').first().check();
await page.waitForTimeout(200);
await page.reload();
await page.waitForSelector('.task');
check(await page.locator('.task').first().locator('input[type=checkbox]').first().isChecked(), 'Un paso marcado sigue marcado tras recargar');
check(/1\/11 pasos/.test((await page.locator('.task').first().textContent()) ?? ''), 'El contador de pasos se actualiza (1/11)');

// --- exercises: solution collapsed, opens on tap
await page.goto(`${origin}#/asignaturas/algebra/01-matrices-y-sistemas-lineales/ejercicios`);
await page.waitForSelector('.exercise');
const sol = page.locator('details.solution').first();
check(!(await sol.evaluate((d: HTMLDetailsElement) => d.open)), 'La solución empieza plegada');
await sol.locator('summary').click();
check(await sol.evaluate((d: HTMLDetailsElement) => d.open && d.textContent!.includes('Suma elemento a elemento')), '«Ver solución» muestra la solución del mismo número');
check((await page.locator('.exercise').count()) === 13, 'Se muestran los 13 ejercicios');

// --- exams to calendar (.ics)
await page.goto(`${origin}#/examenes`);
await page.waitForSelector('.exam-row');
const [icsDl] = await Promise.all([page.waitForEvent('download'), page.click('text=Añadir al calendario')]);
const icsFile = join(tmpdir(), `examenes-${Date.now()}.ics`);
await icsDl.saveAs(icsFile);
const icsText = readFileSync(icsFile, 'utf8');
check((icsText.match(/BEGIN:VEVENT/g) ?? []).length === 5 && icsText.includes('DTSTART;VALUE=DATE:20261222'), 'Exámenes → .ics con los 5 exámenes (PROG1 el 22/12)');

// --- export backup
await page.goto(`${origin}#/ajustes`);
await page.waitForSelector('text=Exportar copia de seguridad');
const [download] = await Promise.all([page.waitForEvent('download'), page.click('text=Exportar copia de seguridad')]);
const file = join(tmpdir(), `backup-${Date.now()}.json`);
await download.saveAs(file);
const backup = JSON.parse(readFileSync(file, 'utf8'));
check(backup.app === 'study-app' && backup.reviews.length === 3 && backup.tasks.length >= 1, `La copia exportada tiene ${backup.reviews.length} repasos y ${backup.tasks.length} pasos (${download.suggestedFilename()})`);

// --- import into a fresh browser profile
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page2 = await ctx2.newPage();
page2.on('pageerror', (e: Error) => errors.push(e.message));
page2.on('dialog', (d: { accept(): Promise<void> }) => d.accept());
await page2.goto(`${origin}#/ajustes`);
await page2.waitForSelector('#importFile', { state: 'attached' });
await page2.setInputFiles('#importFile', file);
await page2.waitForSelector('text=Copia importada');
await page2.goto(`${origin}#/tareas`);
await page2.waitForSelector('.task');
check(await page2.locator('.task').first().locator('input[type=checkbox]').first().isChecked(), 'Importada en otro navegador: el paso marcado aparece marcado');

// --- offline: once the service worker has precached everything, the app works without network
const ctx3 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page3 = await ctx3.newPage();
await page3.goto(`${origin}#/hoy`);
await page3.waitForSelector('.hero');
await page3.evaluate(() => navigator.serviceWorker.ready.then(() => true));
await page3.waitForTimeout(1500); // let the precache finish
await ctx3.setOffline(true);
await page3.reload();
await page3.waitForSelector('.screen', { timeout: 10_000 }).catch(() => null);
check(await page3.locator('.hero').count(), 'Sin conexión: la app vuelve a cargar desde la caché');
await page3.goto(`${origin}#/asignaturas/calculo/02-sucesiones`);
await page3.waitForSelector('.prose .katex', { timeout: 10_000 }).catch(() => null);
check(await page3.locator('.prose .katex').count(), 'Sin conexión: se abre un tema con sus fórmulas');
await ctx3.close();

check(errors.length === 0, `Sin errores de JavaScript${errors.length ? ': ' + errors.join(' | ') : ''}`);
await browser.close();
server.close();
console.log(failures ? `\n❌ ${failures} comprobaciones fallidas` : '\n✅ Todo correcto');
process.exit(failures ? 1 : 0);
