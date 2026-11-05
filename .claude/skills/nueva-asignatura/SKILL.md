---
name: nueva-asignatura
description: Da de alta una asignatura (carpeta asignaturas/<slug>/ con apuntes/, temas/ y un meta.json válido) a partir de su nombre, lista de temas y fechas de examen; y el flujo nuevo-semestre, que archiva las asignaturas del semestre anterior en archivo/<semestre>/ sin borrar nada. Úsala cuando diga "añade la asignatura X", "nueva asignatura", "empiezo el segundo cuatrimestre", "nuevo semestre", "archiva las del semestre pasado", o "cambia la fecha del examen de X".
---

# nueva-asignatura (y nuevo-semestre)

## A. Dar de alta una asignatura

1. **Reúne los datos** (pregunta lo que falte; si no puedo responder, decide algo razonable y dilo):
   - **Nombre** completo ("Matemática Discreta") y **abreviatura** para la app ("MD", ≤ 12 caracteres).
   - **Slug**: minúsculas sin tildes con guiones (`matematica-discreta`; el script lo calcula del nombre).
   - **Semestre**: `AAAA-AA-S1` (sept–ene) o `AAAA-AA-S2` (feb–jun). Curso 2026/27, primer
     cuatrimestre → `2026-27-S1`.
   - **Curso** (1–4), **dificultad** para mí (1–5; si dudas, 3), **lenguaje** si es de programación.
   - **Exámenes**: fecha (y hora/tipo si los sé).
   - **Temas** en orden (pueden estar vacíos y añadirse luego).

2. **Ejecuta el script** (crea carpetas y valida el `meta.json`):
   ```bash
   npm run nueva-asignatura -- --nombre "Matemática Discreta" --abreviatura MD \
     --semestre 2026-27-S2 --curso 1 --dificultad 4 \
     --examen 2027-06-10 --examen 2027-07-01:recuperacion \
     --tema "Lógica" --tema "Conjuntos y funciones" --tema "Combinatoria"
   ```
   - `--examen` admite `AAAA-MM-DD`, `AAAA-MM-DD@09:00` y `AAAA-MM-DD:parcial`.
   - `--temas "A; B; C"` es un atajo. `--horas 6` pone la estimación a todos los temas.
   - Si la asignatura ya existe, `--actualizar` **añade** temas/exámenes sin tocar lo demás.
   - Para **cambiar** una fecha o renombrar algo, edita `meta.json` directamente (no cambies slugs
     de temas que ya tengan tarjetas: se perdería el historial de repaso).

3. **Ajusta a mano** si hace falta `meta.json` (p. ej. `color`, `horas` de cada tema, `notas`).

4. **Valida**: `npm run validate`.

5. **Siguiente paso**: dime que deje los apuntes en `asignaturas/<slug>/apuntes/` y que después
   use **apuntes-a-material** tema a tema; y que regenere el plan con **plan-de-examenes**.

## B. Nuevo semestre (archivar el anterior)

1. **Confirma qué semestre se cierra** (p. ej. `2026-27-S1`) y lista las asignaturas activas con
   ese `semestre` (`asignaturas/*/meta.json`). Si alguna se suspendió y sigue el semestre que viene,
   **no** la archives: cámbiale el `semestre` y las fechas de examen en su `meta.json`.

2. **Simula y luego archiva:**
   ```bash
   npm run nuevo-semestre -- --semestre 2026-27-S1 --dry-run
   npm run nuevo-semestre -- --semestre 2026-27-S1
   ```
   Mueve `asignaturas/<slug>/` → `archivo/2026-27-S1/<slug>/` con `"estado": "archivada"`, mueve
   `plan/plan.md` y `plan/plan.json` a `archivo/2026-27-S1/_plan/` y marca como archivadas las
   tareas de esas asignaturas en `plan/tareas.json`. **No borra nada.**

3. **Da de alta las asignaturas nuevas** con la parte A, y genera el plan nuevo con
   **plan-de-examenes**.

4. `npm run validate`, commit y push. En la app, las asignaturas archivadas siguen visibles en
   *Asignaturas → Archivadas* y su historial de repaso se conserva (va ligado al slug).

## Ejemplo

> **Yo:** añade FAE, examen el 14 de enero, aún no sé los temas
>
> **Claude:** ejecuta
> `npm run nueva-asignatura -- --slug fae --nombre "Fundamentos de Administración de Empresas" --abreviatura FAE --semestre 2026-27-S1 --curso 1 --dificultad 2 --examen 2027-01-14`,
> valida y responde: "Creada `asignaturas/fae/` (sin temas). Deja tus apuntes en
> `asignaturas/fae/apuntes/` y dime 'genera el material del tema 1 de FAE'."
