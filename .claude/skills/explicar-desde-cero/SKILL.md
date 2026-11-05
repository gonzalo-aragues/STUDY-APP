---
name: explicar-desde-cero
description: Explica cualquier tema de la carrera partiendo de nivel de 2.º de bachillerato — intuición primero, luego definición formal, 2-3 ejemplos resueltos y errores típicos, en párrafos cortos y con LaTeX. Úsala cuando pida "explícame X", "no entiendo X", "explícalo desde cero", o cuando otra skill (apuntes-a-material) necesite redactar una explicacion.md.
---

# explicar-desde-cero

Objetivo: que alguien con **matemáticas de 2.º de bachillerato** y poco tiempo entienda un tema de
primero de carrera **sin bloquearse**. Todo en **español de España**.

## Antes de escribir

1. Identifica la asignatura y el tema. Si existe `asignaturas/<slug>/apuntes/`, mira si hay apuntes
   del tema y **usa la notación del profesor** (nombres de conjuntos, símbolos, cómo llama a las cosas).
2. Haz la lista de **requisitos previos** (lo que hay que saber antes). Para cada uno decide: ¿lo da
   bachillerato? Si no, explícalo en 2–4 líneas dentro de "Lo que necesitas saber" antes de usarlo.
3. Decide los **2–3 ejemplos resueltos**: el primero trivial (para coger confianza), el segundo típico,
   el tercero con la trampa más habitual o tipo examen.

## Estructura (siempre en este orden)

```markdown
# <Título del tema>

> **En una frase:** <qué es y para qué sirve, sin tecnicismos>

## Lo que necesitas saber antes
<requisitos de bachillerato que vas a usar, repasados en 1-3 líneas cada uno>

## La idea (intuición)
<analogía o dibujo mental; por qué existe esto; qué problema resuelve>

## Definición formal
<la definición rigurosa, en LaTeX, y justo después "En cristiano:" traduciéndola símbolo a símbolo>

## <Una sección por subapartado del tema: propiedades, métodos, teoremas…>
<cada resultado: enunciado + por qué es razonable + cuándo se usa>

## Ejemplos resueltos
### Ejemplo 1 (fácil)
### Ejemplo 2 (típico)
### Ejemplo 3 (tipo examen / con trampa)

## Errores típicos
- ❌ <error> → ✅ <lo correcto> (y por qué)

## Para llevar
<5-8 viñetas: lo mínimo que tienes que recordar; sirve de chuleta>
```

## Reglas de estilo

- **Párrafos cortos**: máximo 3–4 líneas. Una idea por párrafo. Usa listas y negritas para lo clave.
- **Intuición antes que formalismo.** Nunca empieces por la definición.
- Cada símbolo nuevo se presenta con palabras la primera vez ("$\forall$ se lee *para todo*").
- Matemáticas en LaTeX: en línea con `$...$`, en bloque con `$$...$$` **en su propia línea**.
  Macros disponibles: `\R \N \Z \Q \C \K`. Un dólar literal: `\$`.
- **Pensado para el móvil (390 px de ancho):** una fórmula en bloque no debería tener más de
  ~35–40 símbolos por línea. Las cadenas largas de igualdades, pártelas con
  `\begin{aligned} a&=b\\ &=c \end{aligned}`; los pasos de Gauss, uno por bloque `$$...$$` con la
  operación escrita antes ("$F_3\to F_3-F_1$:"). La app encoge hasta un 70 % lo que no cabe, y lo
  demás se desplaza de lado, pero es incómodo.
- En los ejemplos **muestra todos los pasos**, sin "es fácil ver que". Justifica cada paso en una
  línea ("multiplicamos por el conjugado para quitar la $i$ del denominador").
- Código (asignaturas de programación): bloques con lenguaje (```` ```cpp ````), programas cortos
  y completos que compilen, con comentarios en español.
- Tono cercano y directo (tú), sin paja motivacional. Nada de "como es bien sabido".
- No inventes datos del profesor ni del examen. Si algo depende del temario, dilo ("según tu profesor
  esto puede llamarse…").
- Longitud orientativa: lo que se lee en 20–40 minutos. Si sale más largo, el tema es demasiado
  grande: divídelo en subsecciones claras.

## Si es una pregunta suelta en el chat

Usa la misma estructura pero recortada (idea → definición → 1-2 ejemplos → error típico) y
pregúntame al final si quiero que lo guarde como `explicacion.md` del tema.

## Ejemplo (fragmento) — "Explícame qué es un grupo" (Álgebra)

```markdown
# Grupos

> **En una frase:** un grupo es un conjunto con una operación que "se porta bien": se puede
> combinar, deshacer y tiene un elemento neutro.

## Lo que necesitas saber antes
- **Conjunto**: una colección de cosas, p. ej. $\Z = \{\dots,-2,-1,0,1,2,\dots\}$.
- **Operación**: una regla que a dos elementos les asigna otro, como la suma $3+4=7$.

## La idea (intuición)
Piensa en girar un cuadrado: puedes encadenar giros, deshacer un giro girando al revés y
"no girar" no cambia nada. Eso —combinar, deshacer, no hacer nada— es exactamente un grupo.

## Definición formal
Un **grupo** es un par $(G,*)$ donde $*: G\times G\to G$ cumple:
1. **Asociativa:** $(a*b)*c = a*(b*c)$ para todo $a,b,c\in G$.
2. **Elemento neutro:** existe $e\in G$ con $e*a=a*e=a$ para todo $a$.
3. **Inverso:** para cada $a$ existe $a'$ con $a*a'=a'*a=e$.

En cristiano: puedes poner los paréntesis donde quieras, hay un elemento que "no hace nada" y
todo se puede deshacer.
...
## Errores típicos
- ❌ "$(\N,+)$ es un grupo" → ✅ No: $3$ no tiene inverso en $\N$ ($-3\notin\N$).
```

## Comprobación final

- [ ] ¿Se entiende la intuición sin leer la definición?
- [ ] ¿Cada ejemplo tiene todos los pasos?
- [ ] ¿Hay al menos 3 errores típicos?
- [ ] ¿Todo el LaTeX compila? Si se guarda en el repo: `npm run validate`.
