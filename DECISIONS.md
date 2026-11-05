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

## App

- **Vite + TypeScript sin framework** (DOM a mano con un helper `h()` de 30 líneas). La app es
  pequeña, carga rápido y no hay dependencias que actualizar cada semestre.
- **FSRS (librería `ts-fsrs`) en vez de SM-2.** Es el algoritmo moderno (el de Anki actual), está
  bien probado y la librería pesa poco. Lo envuelvo en `app/src/lib/scheduler.ts` (funciones puras,
  testeadas). Parámetros: retención 90 % (configurable 85/90/95 %), intervalo máximo 365 días,
  pasos de aprendizaje 1 min y 10 min, reaprendizaje 10 min, *fuzz* activado.
  Instalé `ts-fsrs@5` (la 6.x pedía una versión de Node más nueva).
- **Extra propio: tope antes del examen.** Si una tarjeta tocaría después de su examen, se adelanta
  a las 06:00 del día anterior (salvo que falten menos de 12 h, para no entrar en bucle).
- **Límite de tarjetas nuevas: 15/día** (configurable en Ajustes, y botón "+10 nuevas hoy"). Con
  5 asignaturas a la vez y vas atrasado, mejor pocas nuevas bien repasadas.
- **Las tarjetas falladas vuelven en la misma sesión** (tras ~3 tarjetas) mientras estén en pasos de
  aprendizaje. Hay **Deshacer** (tecla Z) por si pulsas el botón equivocado.
- **Sesión de 5 minutos**: cuenta atrás; al acabar el tiempo termina en cuanto respondes la tarjeta
  actual, con resumen y botón "Otros 5 minutos".
- **Progreso en IndexedDB** (`idb`): tarjetas, historial de repasos, pasos de tareas marcados,
  ejercicios hechos, ítems del plan marcados y ajustes. **Importar reemplaza todo** (con
  confirmación): es lo más predecible si solo usas un dispositivo.
- **El tema claro/oscuro se guarda en `localStorage`** (para aplicarlo antes de pintar y evitar un
  parpadeo); el resto de ajustes, en IndexedDB y por tanto en la copia de seguridad.
- **Rutas con `#/...`** (hash routing): funciona en GitHub Pages sin configurar redirecciones 404.
- **Contenido troceado**: `content/index.json` (ligero) + `content/tarjetas/<asig>.json` +
  `content/temas/<asig>/<tema>.json`, todo precacheado por el service worker (funciona offline).
- **Pantalla extra "Plan"** (desde Hoy → "Ver la semana entera") y **Ajustes** (icono de engranaje):
  no estaban en la lista pero hacían falta para ver el plan completo y para exportar/importar.
- **Ejercicios marcables como hechos** y los ítems del plan de hoy también (se guardan en el móvil).
- **Aviso de copia de seguridad** en Hoy si tienes ≥ 20 repasos y la última copia tiene > 14 días.
- **`?hoy=AAAA-MM-DD` en la URL** finge la fecha (lo uso para las capturas; puede servirte para
  ver cómo será un día concreto del plan).

## Despliegue

- **Workflow `deploy.yml`**: en cada push a `main` → `npm ci` → typecheck → tests → `npm run build`
  (que valida el contenido y genera el índice) → GitHub Pages. Si el contenido tiene errores
  (p. ej. un ejercicio sin solución o LaTeX roto) **no se despliega** y la versión anterior sigue online.
- **`VITE_BASE` sale del nombre del repo** (`/${{ github.event.repository.name }}/`), así funciona
  aunque renombres el repo. En local el valor por defecto es `/STUDY-APP/`.
- **Workflow `ci.yml`**: lo mismo sin desplegar, para PRs y otras ramas.

## Contenido de ejemplo (milestone 6)

- **Todo el material es genérico** (`"fuente": "genérico - revisar con apuntes"`): no había ningún
  apunte en `apuntes/`. Lo hice con la skill **apuntes-a-material** siguiendo sus pasos al pie de la letra.
- **Nombres completos de IC y FAE supuestos**: "Introducción a los Computadores" y "Fundamentos de
  Administración de Empresas". **Compruébalos** y corrígelos en su `meta.json` si no son esos.
- **Dificultad** (pesa en el plan): Cálculo 4, Álgebra 4, PROG1 4, IC 3, FAE 2. Cámbiala si no
  encaja contigo.
- **PROG1 en 5 temas** (tipos y expresiones, condicionales, bucles, funciones, vectores) para que
  el plan y las tareas sean más concretos.
- **PROG1 usa `std::vector`** y menciona las tablas de C (`int t[N]`), porque no sé cuál usa tu
  profesor. Míralo en tus apuntes.
- **Cada solución de PROG1 compila y se ejecuta**: `npm run check-code` (script nuevo) compila con
  `-Wall -Wextra -Werror` los programas de explicaciones y soluciones y compara la salida con la
  esperada. Los 49 programas pasan. Las soluciones de mates las comprobé numéricamente con Python.
- **Mensajes de los programas sin tildes** (consolas de Windows).
- **Práctica de ejemplo** en `asignaturas/prog1/practicas/00-ejemplo/` (con 4 fallos a propósito)
  para probar **tutor-practicas**. Bórrala cuando quieras.

## Plan de estudio

- **El reparto lo calcula un script determinista** (`scripts/lib/plan.ts`, con tests) y la skill
  lo ejecuta y revisa. Así el plan es reproducible y se puede regenerar en segundos si te retrasas.
- **Días especiales por defecto** en `plan/config.json`: 24 y 31 dic → 2 h; 25 dic y 1 ene → 1 h.
- **Simulacro 3 días antes, corrección 2 días antes, repaso final el día antes.** El día de un
  examen solo hay 1,5 h para el siguiente si está a ≤ 4 días (si no, descanso).
- **Mejoras tras probar la skill con el contenido real**: títulos de apartados resumidos
  ("de «A» a «C»"), sin fragmentos de 30 min al final de un bloque, bloques de la misma asignatura
  agrupados en el día, repasos variados en vez de repetir la misma frase.

## Skills: lo que cambié tras probarlas

- **tutor-practicas**: compilar con `-O1 -D_GLIBCXX_ASSERTIONS` además de `-Wall -Wextra`. Lo
  comprobé con la práctica de ejemplo: sin esas opciones, el código con `suma` sin inicializar y
  `v[n]` fuera de rango compilaba **sin ningún aviso**. Ejemplo de conversación reescrito sobre ese caso.
- **apuntes-a-material**: convención `// entrada` / `// salida esperada`, `npm run check-code`,
  mensajes sin tildes, títulos `##` cortos (los usa el plan), guía de horas por tema.
- **plan-de-examenes**: documentados `plan/config.json`, la corrección del simulacro y el ejemplo real.
- **dividir-tarea**: citar títulos exactos y números de ejercicio; dónde aparece en la app.
