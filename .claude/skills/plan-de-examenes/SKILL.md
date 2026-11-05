---
name: plan-de-examenes
description: Genera o actualiza el plan de estudio semana a semana hasta los exámenes (plan/plan.md legible + plan/plan.json para la app) a partir de las fechas de examen de todos los meta.json y de mis horas disponibles (3 h/día por defecto, más en los 10 días antes de cada examen, teniendo en cuenta exámenes que se solapan). No es un horario por horas sino una guía de qué toca cada día. Úsala cuando diga "hazme un plan", "actualiza el plan", "me he retrasado", "han cambiado las fechas", o después de añadir temas o asignaturas.
---

# plan-de-examenes

El reparto lo calcula un script determinista (`scripts/lib/plan.ts`) para que sea reproducible y
esté testeado; tu trabajo es **preparar los datos, ejecutarlo, revisar el resultado con criterio y
explicármelo**.

## Cómo reparte el script (para que puedas explicarlo y ajustarlo)

- Cada día tiene `horasPorDia` (3 por defecto). Si algún examen cae en los próximos
  `diasIntensivos` días (10), ese día tiene `horasIntensivas` (5). `diasEspeciales` manda sobre todo.
- Las horas se cortan en **bloques de 1–2 h**. Cada asignatura acumula "derecho a horas" cada día en
  proporción a `dificultad / días que faltan` (×2 en sus 10 últimos días). Cada bloque va a la
  asignatura con más horas "debidas". Así, con exámenes solapados, manda el más cercano pero los
  siguientes no se quedan a cero.
- Dentro de cada asignatura, sus bloques se rellenan **en orden de temas**: leer la explicación
  (troceada por sus apartados `##`: "lee la explicación (2/3), de «Operaciones» a «Matriz
  inversa»"), ejercicios básicos, medios y tipo examen (con sus números). El ritmo se estira hasta
  ×1,5 si sobra tiempo; lo que sigue sobrando se convierte en **repasos rotatorios** (rehacer tipo
  examen → chuleta + ejercicios medios → tarjetas y errores típicos). Si falta tiempo, avisa
  "vas justo" en `plan.notas`.
- No empieza una unidad nueva en los últimos minutos de un bloque, y agrupa en cada día los bloques
  de la misma asignatura.
- 3 días antes del examen: **simulacro**; 2 días antes: **corregirlo** y repasar lo flojo; el día
  antes: **repaso final**. El día del examen: solo examen (y 1,5 h para el siguiente examen si está a
  ≤ 4 días; si no, descanso).
- Asignaturas sin temas en `meta.json` (p. ej. IC/FAE al principio): bloques de "organiza tus
  apuntes y genera el material" y luego "estudia con tus apuntes".
- Cada día empieza con 10–15 min de tarjetas de la app.

## Pasos

1. **Revisa los datos de entrada:**
   - Todas las asignaturas activas en `asignaturas/*/meta.json` tienen sus `examenes` con fecha real
     y `dificultad` (1–5) razonable. Pregúntame (o, si no puedo responder, decide y dilo) si una
     fecha falta.
   - Los temas tienen `horas` estimadas (si no, el script usa `4 + dificultad`).
   - `plan/config.json`: horas por día, horas intensivas, días especiales (festivos, viajes,
     días de prácticas…). Si te digo "el sábado no puedo" o "esta semana solo 2 h", ponlo aquí como
     `"AAAA-MM-DD": horas`:
     ```json
     {
       "horasPorDia": 3, "horasIntensivas": 5, "diasIntensivos": 10,
       "horasDiaExamen": 1.5, "diasExamenCercano": 4,
       "diasEspeciales": { "2026-12-25": 1, "2027-01-01": 1, "2026-11-21": 0 },
       "notas": ["El 21 de noviembre tengo boda: día libre"]
     }
     ```
     `notas` aparece arriba del plan y en la app.

2. **Ejecuta el plan desde hoy** (o desde la fecha que diga):
   ```bash
   npm run plan -- --desde AAAA-MM-DD
   ```
   Escribe `plan/plan.json` (lo lee la app, pantalla **Hoy**) y `plan/plan.md` (para leer).
   Usa `--dry-run` para ver el resultado sin escribir nada.

3. **Revisa el resultado con criterio** (lee `plan/plan.md` entero):
   - ¿Cada asignatura termina sus temas antes de su simulacro? Si sale el aviso "vas justo",
     propón subir horas, bajar `horas` de temas menos importantes o aceptar el riesgo.
   - ¿Hay días con demasiadas asignaturas distintas? (más de 3 = cambia `horasPorDia` o bloques).
   - ¿Las semanas de exámenes solapados (p. ej. enero) tienen sentido? Si no, ajusta
     `dificultad`, `diasIntensivos` o días especiales y **vuelve a ejecutar**. No edites
     `plan.json` a mano: se sobrescribe en la próxima ejecución.

4. **Valida:** `npm run validate` (el plan referencia temas que deben existir).

5. **Explícamelo en ≤ 10 líneas:** horas totales por asignatura, qué semanas son críticas, qué
   hago **hoy** y **mañana**, y el aviso de que si me retraso basta con volver a ejecutar la skill.

## Ejemplo real (5 nov 2026, cinco asignaturas)

`npm run plan -- --desde 2026-11-05` → 11 semanas, 246,5 h. Semanas 1–6 reparten entre las cinco
(PROG1 algo más porque examina antes; IC y FAE empiezan con "organiza tus apuntes"); semana 7
(14–20 dic) es casi toda PROG1 a 5 h/día; Navidad con días reducidos; del 30 dic al 16 ene manda
el examen más cercano pero Cálculo, FAE e IC siguen recibiendo bloques.

## Ejemplo de conversación

> **Yo:** me he retrasado una semana con álgebra, rehaz el plan
>
> **Claude:** comprueba los `meta.json` (5 asignaturas, exámenes 22 dic – 16 ene), ve que el
> tema 1 de Álgebra sigue en estado `generado`, ejecuta `npm run plan -- --desde 2026-11-12`,
> lee el plan: Álgebra pasa de 1,5 h a 2 h algunos días en noviembre y no salta ningún aviso.
> Valida y resume: "Hoy: PROG1 bucles (1,5 h) + Álgebra matrices, ejercicios básicos 1–5 (1,5 h).
> Semana crítica: 14–21 dic (PROG1). Del 2 al 16 de enero hay 4 exámenes en 8 días: el plan ya
> mete Cálculo, FAE e IC desde Navidad."
