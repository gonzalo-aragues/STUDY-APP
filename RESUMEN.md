# RESUMEN — qué se ha construido esta noche

## Lo que tienes que hacer tú (manual)

1. **Activar GitHub Pages:** en el repo, **Settings → Pages → Build and deployment → Source:
   "GitHub Actions"**. Después ve a **Actions → "Desplegar en GitHub Pages" → Run workflow** (o haz
   cualquier push a `main`). En 1–2 minutos la app estará en
   **<https://gonzalo-aragues.github.io/STUDY-APP/>**.
   *Ahora mismo el despliegue falla solo por esto* ("Get Pages site failed… Not Found"): la
   compilación, la validación y los tests del workflow pasan.
2. **Instalar la app en el móvil:** abre la URL → *Añadir a pantalla de inicio / Instalar app*.
3. **Revisar nombres** de IC y FAE en `asignaturas/ic/meta.json` y `asignaturas/fae/meta.json`:
   puse "Introducción a los Computadores" y "Fundamentos de Administración de Empresas" porque no
   lo sabía con seguridad. Añade también **hora y aula** de los exámenes si las sabes (`"hora": "09:00"`, `"lugar"`).
4. **Revisar la dificultad** (1–5) de cada asignatura en su `meta.json` y tus horas en
   `plan/config.json`; luego *«rehaz el plan»* (o `npm run plan`).
5. **Dejar apuntes** (PDF/fotos/md) en `asignaturas/<slug>/apuntes/`, sobre todo de **IC y FAE**,
   que aún no tienen temas, y pedir *«genera el material del tema N de X»*.
6. Cuando quieras, borra el ejemplo `asignaturas/prog1/practicas/00-ejemplo/`.

## Ramas

Todo está en **`main`** (el despliegue sale de ahí) y la misma historia en
`claude/busy-gates-rpboe9` (la rama de trabajo de esta sesión). El push a `main` funcionó, así que
no hizo falta la rama `overnight-build`.

## Qué hay

### Skills (`.claude/skills/`)
| Skill | Qué hace | Probada con |
|---|---|---|
| `explicar-desde-cero` | Explicación desde nivel de 2.º de bachillerato: intuición → definición → 2–3 ejemplos → errores típicos | las 10 explicaciones del contenido de ejemplo |
| `apuntes-a-material` | explicación + ejercicios graduados + soluciones aparte + tarjetas, con la notación del profesor; genérico si no hay apuntes | los 10 temas de ejemplo |
| `tutor-practicas` | Socrática, pistas en escalera, revisa líneas exactas; nunca da la solución salvo petición explícita | práctica de ejemplo con 4 fallos |
| `plan-de-examenes` | Plan semana a semana (`plan/plan.md` + `plan/plan.json`) | plan real del 5 nov al 16 ene |
| `dividir-tarea` | Pasos de 15–25 min en `plan/tareas.json` | "estudiar tema 2 de Álgebra" + arranque de PROG1 |
| `nueva-asignatura` | Alta de asignatura + flujo *nuevo-semestre* (archiva sin borrar) | alta de las 5 asignaturas; archivado probado con tests |

### App (`app/`)
- Vite + TypeScript sin framework, PWA instalable, **funciona sin conexión**, claro/oscuro
  (automático o elegido en Ajustes), interfaz en español, móvil primero y barra lateral en escritorio.
- **Hoy**: tarjetas pendientes + nuevas, **Repasar ahora** y **Sesión de 5 minutos**, cuenta atrás al
  próximo examen, plan de hoy marcable, siguiente paso de tus tareas, racha y aviso de copia de seguridad.
- **Repasar**: FSRS (ts-fsrs), anverso → *Mostrar respuesta* → Otra vez / Difícil / Bien / Fácil con
  el intervalo debajo de cada botón, filtro por asignatura y tema, deshacer (Z), teclado
  (espacio, 1–4), repaso por adelantado y "+10 nuevas hoy". Las tarjetas de cada asignatura se
  adelantan para que las veas antes de su examen.
- **Asignaturas** → temas → explicación y ejercicios, cada uno con **Ver solución** plegado
  (emparejado por número con `soluciones.md`) y casilla "Hecho". Archivadas aparte.
- **Exámenes**: todas las fechas con cuenta atrás. **Tareas**: checklist con progreso.
  **Plan**: la semana entera. **Ajustes**: tema, nuevas/día, retención, exportar/importar copia.
- Markdown + KaTeX + código resaltado, **renderizado al compilar** (la app solo pinta HTML).

### Contenido de ejemplo (genérico, marcado "revisar con apuntes")
| Asignatura | Temas | Ejercicios | Tarjetas |
|---|---|---|---|
| Cálculo | números complejos, sucesiones, series | 39 | 51 |
| Álgebra | matrices y sistemas lineales; estructuras algebraicas (explicado con calma) | 26 | 37 |
| PROG1 | tipos y expresiones, condicionales, bucles, funciones, vectores | 60 | 78 |
| IC, FAE | solo `meta.json` con la fecha de examen | – | – |

Las 49 soluciones en C++ compilan y dan la salida esperada (`npm run check-code`); las de
matemáticas están comprobadas numéricamente.

### Plan (`plan/plan.md`)
11 semanas, 5 nov → 16 ene, **246,5 h**. 3 h/día; 5 h/día los 10 días antes de cada examen;
Navidad reducida (24 y 31 dic: 2 h; 25 dic y 1 ene: 1 h). PROG1 domina del 12 al 21 dic; en enero
manda el examen más cercano sin abandonar los siguientes. Simulacro 3 días antes, corrección 2
días antes, repaso final el día antes.

### Calidad
- `npm test`: **84 tests** (scheduler, parser ejercicio↔solución, schemas y validación, índice,
  plan, archivado, almacenamiento y copia de seguridad, rutas y fechas).
- `npm run e2e`: **18 comprobaciones** en Chromium real, incluido el modo sin conexión.
- `scripts/screenshots.ts`: 15 pantallas × (móvil claro, móvil oscuro, escritorio) sin
  desbordamientos ni errores de KaTeX.
- GitHub Actions: typecheck + tests + validación + build en cada push; despliegue si es `main`.

## Limitaciones conocidas

- **El progreso vive en un solo dispositivo.** No hay sincronización (sería necesario un servidor).
  Exporta copias; importar **reemplaza** (no mezcla) el progreso.
- **Si regeneras un tema y cambian los ids de las tarjetas**, esas tarjetas empiezan de cero (la
  skill está instruida para conservar los ids).
- Marcar un ítem del plan va ligado a su texto: si regeneras el plan y el texto cambia, esa marca
  no se traslada (las tareas y ejercicios sí se conservan).
- El reparto del plan no sabe qué temas te cuestan más ni cuánto has avanzado de verdad: si vas
  por delante o por detrás, regéneralo (o ajusta `dificultad` y `horas`).
- Imágenes dentro de las explicaciones (diagramas) aún no están soportadas: las fotos de
  `apuntes/` las lee Claude, pero la app no las muestra.
- Los temas de mates pesan ~550 KB sin comprimir (KaTeX); por la red van ~25 KB gracias a gzip.
- iOS puede borrar datos de webs no instaladas tras semanas sin abrirlas: **instala la app** y
  haz copias.
- Solo hay comprobador automático de código para C++ (`check-code`); para otros lenguajes, a mano.

## Ideas para más adelante

- Botón "Lo he estudiado" en cada tema que desbloquee sus tarjetas nuevas.
- Estadísticas: retención por asignatura, tarjetas maduras, horas de estudio por semana.
- Tarjetas con huecos (*cloze*) y tarjetas de código ("¿qué imprime?").
- Importar exámenes de otros años como ejercicios "tipo examen" con su año.
- Recordatorio diario (notificación) a una hora fija, si el navegador lo permite sin servidor.
- Imágenes en explicaciones (`temas/<tema>/img/`) copiadas al build.
- Comprobador de código para Python/Java cuando lleguen esas asignaturas.
- Sincronización opcional del progreso a un fichero en Drive (manual) o a un gist.
