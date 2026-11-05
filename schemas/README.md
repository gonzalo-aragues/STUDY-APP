# Schemas de contenido

Todos los ficheros de contenido se validan con `npm run validate` (también en GitHub Actions
antes de desplegar). Los schemas son JSON Schema draft-07 y puedes enlazarlos desde el propio
fichero con `"$schema"` para tener autocompletado en VS Code.

## `asignaturas/<slug>/meta.json` → [`meta.schema.json`](meta.schema.json)

| Campo | Obligatorio | Descripción |
|---|---|---|
| `slug` | sí | Igual que el nombre de la carpeta. `a-z0-9-`. |
| `nombre` | sí | Nombre completo ("Cálculo"). |
| `abreviatura` | no | Nombre corto para la app ("PROG1"). Máx. 12 caracteres. |
| `curso` | no | 1–6. |
| `semestre` | sí | `AAAA-AA-S1` o `AAAA-AA-S2` (p. ej. `2026-27-S1`). |
| `estado` | no | `activa` (por defecto) o `archivada`. |
| `color` | no | `#rrggbb` para la app. |
| `dificultad` | no | 1–5 (por defecto 3). Pesa en el reparto de horas del plan. |
| `lenguaje` | no | `cpp`, `python`… si es de programación. |
| `examenes` | sí | Lista de `{ fecha: "AAAA-MM-DD", hora?, tipo?, titulo?, lugar?, notas? }`. `tipo` ∈ `final, parcial, practicas, recuperacion, otro`. Puede estar vacía. |
| `temas` | sí | Lista ordenada de `{ slug: "nn-slug", titulo, horas?, fuente?, estado? }`. `estado` ∈ `pendiente, generado, revisado`. `horas` = estimación para estudiarlo desde cero (plan). Puede estar vacía. |
| `notas` | no | Texto libre. |

Ejemplo:

```json
{
  "$schema": "../../schemas/meta.schema.json",
  "slug": "calculo",
  "nombre": "Cálculo",
  "abreviatura": "Cálculo",
  "curso": 1,
  "semestre": "2026-27-S1",
  "estado": "activa",
  "color": "#2f7d6d",
  "dificultad": 4,
  "examenes": [{ "fecha": "2027-01-12", "tipo": "final" }],
  "temas": [
    { "slug": "01-numeros-complejos", "titulo": "Números complejos", "horas": 8, "fuente": "genérico - revisar con apuntes", "estado": "generado" }
  ]
}
```

## `asignaturas/<slug>/temas/<tema>/tarjetas.json` → [`tarjetas.schema.json`](tarjetas.schema.json)

| Campo | Obligatorio | Descripción |
|---|---|---|
| `asignatura` | sí | Slug de la asignatura (= carpeta). |
| `tema` | sí | Slug del tema (= carpeta). |
| `fuente` | sí | `"apuntes"`, `"apuntes: tema2.pdf"`, `"genérico - revisar con apuntes"`… |
| `tarjetas[]` | sí | `{ id, tipo, anverso, reverso, etiquetas? }` |
| `tarjetas[].id` | sí | Único en el tema, `a-z0-9-`. **No lo cambies nunca**: el historial de repaso va ligado a `asignatura/tema/id`. |
| `tarjetas[].tipo` | sí | `concepto` o `procedimiento`. |
| `tarjetas[].anverso`, `reverso` | sí | Markdown + LaTeX. |

## `plan/plan.json` → [`plan.schema.json`](plan.schema.json)

`{ generado, desde, hasta, horasPorDia?, notas?, semanas: [{ inicio, fin, titulo, objetivo?, dias: [{ fecha, horas?, nota?, items: [{ asignatura, tema?, tipo, texto, horas? }] }] }] }`

`tipo` ∈ `aprender, practicar, repasar, simulacro, examen, preparar, descanso`. `asignatura` puede
ser `"*"` para algo general (p. ej. "repasa tarjetas de todo").

## `plan/tareas.json` → [`tareas.schema.json`](tareas.schema.json)

`{ tareas: [{ id, titulo, asignatura?, tema?, creada, fechaLimite?, archivada?, pasos: [{ id, texto, minutos (10–30), detalle?, enlace? }] }] }`

`enlace` es una ruta de la app, p. ej. `#/asignaturas/algebra/02-estructuras-algebraicas`.
Lo que marcas en la app se guarda en el móvil (IndexedDB) por `id de tarea / id de paso`:
no cambies ids de tareas que ya estés haciendo.

## Reglas extra que comprueba `npm run validate`

- `meta.slug` = carpeta; slugs únicos en todo el repo (incluido `archivo/`).
- Fechas reales (no `2026-02-30`).
- `tarjetas.json`: `asignatura`/`tema` coinciden con las carpetas; ids no repetidos.
- Cada `### Ejercicio N` tiene su `### Solución N` y viceversa; sin números repetidos (aviso si hay saltos).
- Todo el LaTeX de `.md` y tarjetas compila con KaTeX.
- `plan.json` / `tareas.json`: aviso si nombran asignaturas o temas que no existen.
