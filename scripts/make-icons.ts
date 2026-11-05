// Regenerates the PNG app icons from app/public/icon.svg (needs Playwright + Chromium).
// node scripts/make-icons.ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { REPO_ROOT } from './lib/paths.ts';

// Playwright is pre-installed globally (not a project dependency): load it through require().
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { chromium } = createRequire(import.meta.url)('playwright') as { chromium: any };

const pub = join(REPO_ROOT, 'app', 'public');
const svg = readFileSync(join(pub, 'icon.svg'), 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage();

async function shot(size: number, file: string, maskable = false) {
  await page.setViewportSize({ width: size, height: size });
  // Maskable icons need the motif inside the central 80 % "safe zone" and a full-bleed background.
  const inner = maskable ? svg.replace('rx="112"', 'rx="0"').replace('<rect x="132"', '<g transform="translate(51 51) scale(0.8)"><rect x="132"').replace('</svg>', '</g></svg>') : svg;
  await page.setContent(`<html><body style="margin:0;background:transparent">${inner.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: join(pub, file), omitBackground: !maskable, clip: { x: 0, y: 0, width: size, height: size } });
  console.log('✅', file);
}

await shot(192, 'icon-192.png');
await shot(512, 'icon-512.png');
await shot(512, 'icon-maskable-512.png', true);
await shot(180, 'apple-touch-icon.png', true);
await browser.close();
