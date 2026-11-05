// npm run build-index  ->  app/public/content/** (served as <base>/content/**)
import { buildIndex } from './lib/build-index.ts';

const { stats } = buildIndex();
console.log(`✅ content/index.json: ${stats.asignaturas} asignaturas, ${stats.temas} temas con material, ${stats.ejercicios} ejercicios, ${stats.tarjetas} tarjetas`);
