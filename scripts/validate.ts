// Usage: npm run validate   (exit code 1 if there are errors)
import { validateRepo } from './lib/validate.ts';

const r = validateRepo();
for (const w of r.warnings) console.warn(`⚠️  ${w}`);
for (const e of r.errors) console.error(`❌ ${e}`);
const s = r.stats;
console.log(
  `\n${r.errors.length ? '❌' : '✅'} ${s.asignaturas} asignaturas, ${s.temas} temas, ${s.ejercicios} ejercicios, ${s.tarjetas} tarjetas — ${r.errors.length} errores, ${r.warnings.length} avisos`,
);
process.exit(r.errors.length ? 1 : 0);
