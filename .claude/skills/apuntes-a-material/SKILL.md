---
name: apuntes-a-material
description: Convierte los apuntes de un tema (PDF, fotos o .md en asignaturas/<slug>/apuntes/) en el material de estudio del tema - explicacion.md, ejercicios.md graduados (básico / medio / tipo examen), soluciones.md paso a paso en fichero aparte y tarjetas.json de repaso espaciado. Úsala cuando diga "genera el material del tema X", "pasa mis apuntes de X", "hazme ejercicios y tarjetas de X". Si no hay apuntes, genera contenido estándar de primer curso marcado como genérico.
---

# apuntes-a-material

Entrada: **asignatura** (slug, p. ej. `algebra`) + **tema** (slug `nn-slug` o título).
Salida, en `asignaturas/<slug>/temas/<nn-slug>/`:

| Fichero | Contenido |
|---|---|
| `explicacion.md` | Explicación desde cero (estilo **explicar-desde-cero**) |
| `ejercicios.md` | Ejercicios numerados y graduados: `## Básico`, `## Medio`, `## Tipo examen` |
| `soluciones.md` | Solución completa paso a paso de **cada** ejercicio, mismo número |
| `tarjetas.json` | Tarjetas de concepto y de procedimiento (schema `schemas/tarjetas.schema.json`) |

## Pasos

1. **Localiza el tema.** Lee `asignaturas/<slug>/meta.json`. Si el tema no está en `temas[]`,
   añádelo con el siguiente número (`{ "slug": "03-series", "titulo": "Series", "estado": "pendiente" }`).
   Si la asignatura no existe, usa antes la skill **nueva-asignatura**.

2. **Lee los apuntes** de `asignaturas/<slug>/apuntes/`:
   - `.md` / `.txt`: léelos directamente.
   - **PDF**: usa la herramienta Read con `pages` (máx. 20 páginas por llamada) o
     `pdftotext -layout fichero.pdf -` si es texto; si es escaneado, léelo como imagen.
   - **Fotos** (`.jpg`, `.png`, `.heic`…): ábrelas con Read (las ves como imagen).
   - Quédate solo con lo que corresponde a este tema (por título, índice o numeración del profesor).
   - Anota la **notación del profesor** (símbolos, nombres, orden de los apartados, cómo escribe
     los vectores, si usa $\mathcal{M}_{m\times n}$ o $M_{m,n}$…) y **úsala en todo el material**.
   - Anota qué ejercicios hizo en clase o en las hojas: son la mejor pista de qué cae en el examen.

3. **Decide la `fuente`:**
   - Hay apuntes del tema → `"fuente": "apuntes: <ficheros usados>"` (p. ej. `"apuntes: tema3.pdf, pizarra-12-10.jpg"`).
   - **No hay apuntes** → contenido estándar de primer curso de Ingeniería Informática en España y
     `"fuente": "genérico - revisar con apuntes"`. Cíñete a lo que se ve en cualquier temario de primero;
     no metas temas avanzados.

4. **Escribe `explicacion.md`** con la estructura y reglas de la skill **explicar-desde-cero**
   (léela: `.claude/skills/explicar-desde-cero/SKILL.md`). Empieza con front matter:
   ```markdown
   ---
   fuente: genérico - revisar con apuntes
   ---
   # Números complejos
   ```
   Usa `##` para los apartados: el plan de estudio los usa para trocear la lectura ("lee de
   «La idea» a «Determinantes»"), así que pon **títulos cortos y descriptivos** (3–6 palabras) y
   evita fórmulas en ellos. El primer `# Título` no se muestra en la app (ya sale en la cabecera).

5. **Escribe `ejercicios.md`.** Formato **exacto** (lo parsea la app y el validador):
   ```markdown
   ---
   fuente: genérico - revisar con apuntes
   ---
   # Ejercicios — Números complejos

   ## Básico

   ### Ejercicio 1
   Enunciado…

   ### Ejercicio 2. Título opcional
   Enunciado…

   ## Medio

   ### Ejercicio 5
   …

   ## Tipo examen

   ### Ejercicio 9
   …
   ```
   - Numeración **global y seguida** en todo el fichero (1, 2, 3… sin saltos ni repetidos).
   - Cantidad orientativa: **4–5 básicos, 3–5 medios, 2–4 tipo examen** (10–14 en total).
   - **Básico**: aplicar la definición o un paso. **Medio**: combinar 2–3 ideas.
     **Tipo examen**: como los del profesor (si hay exámenes antiguos en apuntes, imítalos), con
     apartados a), b), c) si procede.
   - Nada de soluciones ni pistas que la revelen en este fichero. Como mucho una
     *Pista:* corta en cursiva en los tipo examen.
   - No uses `##` dentro de un ejercicio (cerraría la sección). Para apartados usa listas `a)`, `b)`.
   - **Programación**: enunciados de programas concretos, del tamaño de lo que se pide en
     prácticas/examen, en el lenguaje de la asignatura (`lenguaje` en meta.json). Da un ejemplo de
     entrada y salida con **dos bloques `text`** cuya primera línea es `// entrada` y
     `// salida esperada` (ver paso 6). Mezcla tipos: "¿qué imprime?", "encuentra el error",
     "escribe el programa", "traza". Los fragmentos con errores a propósito van en `ejercicios.md`
     (el comprobador de código no lo compila).
   - Los mensajes que imprimen los programas, **sin tildes ni ñ** (las consolas de Windows los
     muestran mal); el resto del texto, con tildes normales.

6. **Escribe `soluciones.md`**, en fichero aparte:
   ```markdown
   ---
   fuente: genérico - revisar con apuntes
   ---
   # Soluciones — Números complejos

   ### Solución 1
   Paso 1…
   **Resultado:** $3+2i$
   ```
   - Una `### Solución N` por cada `### Ejercicio N`, **mismo número**.
   - **Paso a paso completo**: qué se hace, por qué, y el cálculo intermedio. Termina con el
     resultado en negrita. Si hay una comprobación rápida (sustituir, derivar…), inclúyela.
   - En ejercicios de programación: programa **completo** (con `#include` y `int main`), comentado,
     seguido de los bloques de prueba y luego "Por qué funciona" / "Errores típicos" en 2–4 viñetas:
     ````markdown
     ```cpp
     #include <iostream>
     ...
     ```
     ```text
     // entrada
     3725
     ```
     ```text
     // salida esperada
     1 h 2 min 5 s
     ```
     ````
     **`npm run check-code`** compila con `-Wall -Wextra -Werror` cada programa completo de
     `explicacion.md` y `soluciones.md`, lo ejecuta con la `// entrada` y compara con la
     `// salida esperada`. Tiene que salir ✅ (los fragmentos sin `#include` se ignoran).
     Usa `(int)v.size()` o `size_t` en comparaciones para que `-Werror` no se queje.
   - **Comprueba cada resultado** de matemáticas: rehaz el cálculo y, si es numérico, verifícalo
     con `python3 -c "..."` (hay `numpy` para matrices y determinantes).

7. **Escribe `tarjetas.json`:**
   ```json
   {
     "$schema": "../../../../schemas/tarjetas.schema.json",
     "asignatura": "calculo",
     "tema": "01-numeros-complejos",
     "fuente": "genérico - revisar con apuntes",
     "tarjetas": [
       { "id": "def-modulo", "tipo": "concepto", "anverso": "¿Qué es el módulo de $z=a+bi$?", "reverso": "La distancia de $z$ al origen: $|z|=\\sqrt{a^2+b^2}$." },
       { "id": "proc-dividir", "tipo": "procedimiento", "anverso": "¿Cómo se divide $\\frac{z}{w}$ en forma binómica?", "reverso": "1. Multiplica arriba y abajo por $\\overline{w}$.\n2. Abajo queda $|w|^2$ (real).\n3. Separa parte real e imaginaria." }
     ]
   }
   ```
   - **12–20 tarjetas** por tema: ~60 % `concepto` (definiciones, por qué, cuándo se usa) y
     ~40 % `procedimiento` (pasos de un método, en lista numerada).
   - Anverso: **una sola pregunta**, corta. Reverso: 1–6 líneas. Una idea por tarjeta.
   - `id`: minúsculas con guiones, único en el tema. Prefijos útiles: `def-`, `prop-`, `proc-`, `error-`.
   - **Nunca cambies ni reutilices el `id` de una tarjeta existente** (el historial de repaso
     está ligado a él). Si regeneras un tema que ya tenía tarjetas, conserva los ids de las que
     sigan teniendo sentido y añade nuevas con ids nuevos.
   - En JSON la barra invertida se escapa: `\\frac`, `\\sqrt`. Saltos de línea: `\n`.

8. **Actualiza `meta.json`** del tema: `"estado": "generado"`, `"fuente"` igual que arriba y
   `"horas"` estimadas para estudiarlo desde cero (4–10; temas de matemáticas largos, 8–10;
   temas cortos de programación, 4–6). El plan reparte el tiempo con estas horas.
   Cuando lo revises con el profesor o tus apuntes, cambia el estado a `"revisado"`.

9. **Valida y corrige** hasta 0 errores:
   ```bash
   npm run validate
   npm run check-code   # solo asignaturas de programación
   ```
   El validador comprueba schemas, que cada ejercicio tenga su solución (y al revés) y que todo el
   LaTeX compile. Si cambiaste temas, regenera el plan (`npm run plan`, skill **plan-de-examenes**).

10. **Resume** en 3–5 líneas qué has generado, la `fuente`, y qué conviene revisar con el profesor.

## Checklist de calidad

- [ ] La explicación sigue intuición → definición → ejemplos → errores típicos.
- [ ] La notación coincide con los apuntes (o es la estándar si es genérico).
- [ ] Ejercicios de los tres niveles, numeración seguida, sin soluciones en `ejercicios.md`.
- [ ] Cada solución está verificada y tiene todos los pasos.
- [ ] Tarjetas cortas, una idea cada una, ids estables.
- [ ] `npm run validate` sin errores.

## Ejemplo de uso

> **Yo:** genera el material del tema 2 de álgebra
>
> **Claude:** lee `asignaturas/algebra/meta.json` → tema `02-estructuras-algebraicas`; no hay nada
> en `apuntes/` → fuente genérica. Escribe los cuatro ficheros (explicación con requisitos de
> conjuntos y operaciones, 12 ejercicios: 5 básicos, 4 medios, 3 tipo examen; 12 soluciones;
> 18 tarjetas), marca el tema como `generado`, ejecuta `npm run validate` (0 errores) y resume:
> "Material genérico del tema 2. Revisa con tus apuntes si tu profesor define anillo con o sin
> unidad."
