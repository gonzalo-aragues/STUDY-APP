# DECISIONS.md — registro de decisiones

Trabajo nocturno sin poder preguntar: cada decisión razonable que he tomado queda aquí.
Formato: **decisión** — motivo.

## Repo y git

- **Rama `main` creada con el primer commit; empujo a `main` y también a `claude/busy-gates-rpboe9`.**
  Me pediste `main` (el despliegue a Pages se dispara con push a `main`); el entorno de trabajo me
  asignó además la rama `claude/busy-gates-rpboe9`, así que la mantengo sincronizada con lo mismo.
- **Un solo `package.json` en la raíz** (scripts + app + tests). Menos piezas que mantener.
- **Scripts en TypeScript ejecutados con Node 22 directamente** (type stripping nativo, sin `tsx`).
  Por eso el código evita `enum`, `namespace` y propiedades en parámetros de constructor.
- **TypeScript fijado a `~5.9`** en vez de la 7.x (port nativo, muy reciente): menos riesgo.

## Esquemas y contenido

- **Claves de los JSON en español** (`nombre`, `examenes`, `temas`, `anverso`…) porque los editas tú;
  el código está en inglés.
- **Semestre como `AAAA-AA-S1|S2`** (`2026-27-S1`): ordena bien y sirve de nombre de carpeta al archivar.
- **Numeración de ejercicios global dentro del tema** (1..N a través de Básico/Medio/Tipo examen),
  emparejada con `### Solución N`. Es lo más fácil de mantener y de comprobar automáticamente.
- **`fuente` en tres sitios**: front matter de los `.md`, `tarjetas.json` (obligatorio) y `meta.json → temas[]`.
  La app muestra un aviso si empieza por "genérico".
- **Validación con Ajv + reglas propias** (`scripts/lib/validate.ts`), incluida la compilación de todo
  el LaTeX con KaTeX en modo estricto, para cazar fórmulas rotas antes de desplegar.
- **Pasos de tareas: 10–30 min en el schema** (la skill pide 15–25; el schema deja un poco de margen).
- **Archivado en `archivo/<semestre>/<slug>/`** (no se borra nada). El historial de repaso está ligado
  al slug, no a la ruta, así que mover la carpeta no pierde progreso.

## Renderizado

- **Markdown + KaTeX + highlight.js se renderizan en el build (Node), no en el móvil.** La app recibe
  HTML ya hecho: carga más rápida, menos JS, funciona igual offline. Solo se envían el CSS y las
  fuentes de KaTeX.
- **KaTeX con salida solo HTML** (sin MathML) para que el contenido pese la mitad.
