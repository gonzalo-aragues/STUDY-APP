# CLAUDE.md — instrucciones del proyecto

Este repo es mi sistema de estudio para **todo el grado** (Ingeniería Informática, Universidad de Zaragoza).
Tiene dos partes que se hablan solo a través de ficheros:

1. **Skills de Claude Code** (`.claude/skills/`) que generan material de estudio y planes.
2. **Una web app estática (PWA)** en `app/` que muestra ese material y hace repaso espaciado.

> **Regla dura:** la app **nunca** llama a ninguna API de IA/LLM y no necesita claves.
> Todo el contenido se genera aquí, con Claude Code y las skills; la app solo lee ficheros del repo.

## Quién soy (adapta todo a esto)

- Estudiante de **1.º de Ingeniería Informática** en la Universidad de Zaragoza.
- Asignaturas del semestre actual: IC, FAE, PROG1 (C++), Cálculo, Álgebra.
- Voy **atrasado** en todas. Mi base de matemáticas es de **2.º de bachillerato**: las explicaciones
  tienen que construir desde ahí (no des por sabido nada de la universidad).
- Procrastino por el móvil y porque las tareas me parecen **demasiado grandes**: trocea, sé concreto,
  pasos de 15–25 minutos, nada de muros de texto.
- Quiero herramientas **simples y rápidas**.
- **Todo el contenido de estudio y la interfaz de la app, en español de España.**
  El código y los comentarios del código pueden ir en inglés.

## Estructura del repo

```
asignaturas/<slug>/meta.json                  nombre, semestre, exámenes, temas (schemas/meta.schema.json)
asignaturas/<slug>/apuntes/                   apuntes en bruto que dejo yo (PDF, fotos, .md)
asignaturas/<slug>/practicas/                 enunciados y mi código de prácticas (tutor-practicas)
asignaturas/<slug>/temas/<nn-slug>/explicacion.md
asignaturas/<slug>/temas/<nn-slug>/ejercicios.md
asignaturas/<slug>/temas/<nn-slug>/soluciones.md
asignaturas/<slug>/temas/<nn-slug>/tarjetas.json   (schemas/tarjetas.schema.json)
archivo/<semestre>/<slug>/                    asignaturas de semestres anteriores (nuevo-semestre)
plan/config.json                              horas disponibles y días especiales para el plan
plan/plan.md, plan/plan.json                  plan de estudio actual (plan-de-examenes)
plan/tareas.json                              tareas troceadas en pasos (dividir-tarea)
schemas/                                      JSON Schemas + README con la documentación
scripts/                                      validación, índice para la app, plan, scaffolding
app/                                          la web app (Vite + TypeScript, sin framework)
tests/                                        tests (vitest)
```

## Convenciones de contenido (las usa el parser de la app: respétalas)

- **Slugs**: minúsculas, sin tildes, guiones (`calculo`, `prog1`). Temas: `nn-slug` (`01-numeros-complejos`).
- **Markdown + LaTeX**: matemáticas con `$...$` (en línea) y `$$...$$` (bloque, en su propia línea).
  Macros disponibles: `\R \N \Z \Q \C \K`. Código en bloques con lenguaje: ```` ```cpp ````.
  Un `$` literal se escribe `\$`.
- **Front matter** opcional en los `.md`: `---\nfuente: ...\n---`. Si `fuente` empieza por
  `genérico`, la app muestra un aviso "revisar con apuntes".
- **ejercicios.md**: secciones `## Básico`, `## Medio`, `## Tipo examen`; dentro, cada ejercicio es
  `### Ejercicio N` (opcional `. Título`). La numeración es **global** en el tema (1, 2, 3… sin saltos).
  No uses `##` dentro de un ejercicio (cerraría la sección).
- **soluciones.md**: `### Solución N` con el **mismo N**. Soluciones completas, paso a paso.
  En programación, cada programa completo va seguido de bloques ```` ```text ```` que empiezan por
  `// entrada` y `// salida esperada` (los usa `npm run check-code`).
  Las soluciones van **siempre en un fichero aparte**; la app las muestra plegadas ("Ver solución").
- **tarjetas.json**: `id` estable (minúsculas-con-guiones) y único en el tema. **No cambies ids
  existentes**: el historial de repaso del móvil va ligado a `asignatura/tema/id`.
  `tipo`: `concepto` (qué es / por qué) o `procedimiento` (cómo se hace, pasos).
  Anverso corto (una pregunta); reverso breve (2–6 líneas).
- Si no hay apuntes: contenido estándar de primer curso y `"fuente": "genérico - revisar con apuntes"`.
- Sigue **la notación del profesor** cuando haya apuntes.

## Cómo encajan las skills

| Quiero… | Skill |
|---|---|
| Entender un tema desde cero | `explicar-desde-cero` |
| Convertir mis apuntes de un tema en explicación + ejercicios + soluciones + tarjetas | `apuntes-a-material` (usa el estilo de `explicar-desde-cero`) |
| Ayuda con una práctica de programación sin que me la hagan | `tutor-practicas` |
| Un plan semanal hasta los exámenes | `plan-de-examenes` → `plan/plan.md` + `plan/plan.json` |
| Trocear algo grande en pasos de 15–25 min | `dividir-tarea` → `plan/tareas.json` |
| Dar de alta una asignatura / empezar semestre | `nueva-asignatura` (incluye el flujo *nuevo-semestre*) |

Flujo típico de un tema: `nueva-asignatura` → dejo apuntes en `apuntes/` → `apuntes-a-material` →
`npm run validate` → commit + push → la app se actualiza sola (GitHub Pages).
Cuando cambian temas o fechas: `plan-de-examenes` de nuevo.

## Comandos

```bash
npm install            # una vez
npm run validate       # valida todo el contenido (schemas + ejercicio↔solución + LaTeX)
npm test               # tests
npm run dev            # app en local (http://localhost:5173/STUDY-APP/)
npm run build          # validate + índice + build de la app en dist/
npm run plan           # regenera plan/plan.json y plan/plan.md desde los meta.json
npm run check-code     # compila y ejecuta los programas C++ de explicaciones y soluciones
npm run nueva-asignatura -- --slug x --nombre "X" --semestre 2026-27-S2 --examen 2027-06-01
npm run nuevo-semestre -- --semestre 2026-27-S1   # archiva las asignaturas de ese semestre
```

**Siempre** ejecuta `npm run validate` (y `npm run check-code` si tocas material de programación,
`npm test` si tocas código) antes de hacer commit.

## Decisiones

Las decisiones de diseño están en `DECISIONS.md`; el resumen para mí, en `RESUMEN.md`.
