---
name: dividir-tarea
description: Trocea una tarea grande ("estudiar tema 2 de Álgebra", "hacer la práctica 3", "preparar el examen de FAE") en pasos concretos de 15-25 minutos, cada uno con un verbo de acción y un resultado visible, y los guarda en plan/tareas.json para marcarlos en la app. Úsala cuando diga "divide", "trocea", "no sé por dónde empezar", "esto es enorme", "me da pereza X".
---

# dividir-tarea

Procrastino cuando algo parece enorme. Un buen paso es tan pequeño y concreto que **empezarlo no
da pereza**: se puede hacer en 15–25 minutos, empieza por un verbo y al terminar hay algo visible
(un ejercicio hecho, un resumen de 5 líneas, un programa que compila).

## Pasos

1. **Entiende la tarea**: asignatura, tema, y qué significa "terminado" (¿entender la teoría?
   ¿poder hacer ejercicios tipo examen? ¿entregar la práctica?). Si hay fecha límite, apúntala.

2. **Mira el material real** para que los pasos apunten a cosas concretas:
   - `asignaturas/<slug>/temas/<tema>/explicacion.md` → apartados `##` (para trocear la lectura).
   - `ejercicios.md` → números y niveles de los ejercicios.
   - `practicas/` → enunciado y apartados de la práctica.
   - Si no existe el material, el primer paso es generarlo (o "leer los apuntes de clase de X").

3. **Escribe 5–12 pasos**, cada uno de **15–25 minutos** (`minutos`: 15, 20 o 25):
   - Empieza con un **verbo**: *Lee*, *Haz*, *Escribe*, *Compila*, *Repasa*, *Explica en voz alta*.
   - Concreto: "Haz los ejercicios 1 y 2 (básicos)" ✅ — "Practica matrices" ❌.
   - El **primer paso, el más fácil** (5 min de arranque dentro de 15: abrir, leer la frase
     resumen…). Rompe la barrera de empezar.
   - Alterna leer y hacer; nunca más de 2 pasos seguidos solo leyendo.
   - Termina con un paso de **comprobación** (ejercicio tipo examen sin mirar la solución, o
     explicar el tema en 5 líneas sin mirar).
   - `detalle` (opcional): una línea con el cómo o el criterio de "hecho".
   - Cita los **títulos exactos** de los apartados (`«Grupo»`) y los **números** de ejercicio:
     así el paso se puede empezar sin pensar.
   - `enlace` (opcional): ruta de la app al material: `#/asignaturas/<slug>/<tema>` (explicación),
     `#/asignaturas/<slug>/<tema>/ejercicios`, o `#/repasar?asignatura=<slug>&tema=<tema>` (tarjetas).

4. **Guarda en `plan/tareas.json`** (créalo si no existe con `{ "tareas": [] }`):
   - **Añade** la tarea al final; no borres ni cambies otras (el progreso marcado en el móvil va
     ligado a `id de tarea / id de paso`).
   - `id` de tarea: `<asignatura>-<tema-o-resumen>-<AAAAMMDD>` en minúsculas con guiones.
   - `id` de paso: `p1`, `p2`, …
   - `creada`: fecha de hoy. Tareas viejas ya hechas: puedes poner `"archivada": true` si te lo pido.

5. **Valida:** `npm run validate` (comprueba ids repetidos, minutos 10–30 y que la asignatura
   exista). Haz commit + push para que aparezca en la app: en **Tareas** se marcan los pasos y en
   **Hoy** sale el siguiente paso pendiente de cada tarea.

6. **Respóndeme** con la lista numerada de pasos (texto + minutos) y el total, y dime cuál es el
   primero: "Empieza ya con el paso 1, son 15 minutos".

## Ejemplo — "estudiar tema 2 de Álgebra"

```json
{
  "id": "algebra-estructuras-20261105",
  "titulo": "Estudiar el tema 2 de Álgebra (estructuras algebraicas)",
  "asignatura": "algebra",
  "tema": "02-estructuras-algebraicas",
  "creada": "2026-11-05",
  "pasos": [
    { "id": "p1", "texto": "Lee «En una frase» y «Lo que necesitas saber antes»", "minutos": 15, "enlace": "#/asignaturas/algebra/02-estructuras-algebraicas" },
    { "id": "p2", "texto": "Lee «Operaciones internas» y apunta en 3 líneas qué es una operación interna", "minutos": 20, "enlace": "#/asignaturas/algebra/02-estructuras-algebraicas" },
    { "id": "p3", "texto": "Haz los ejercicios 1 y 2 (básicos) y compáralos con la solución", "minutos": 20, "enlace": "#/asignaturas/algebra/02-estructuras-algebraicas/ejercicios" }
  ]
}
```
(Ejemplo recortado; la tarea real tiene más pasos hasta cubrir el tema.)
