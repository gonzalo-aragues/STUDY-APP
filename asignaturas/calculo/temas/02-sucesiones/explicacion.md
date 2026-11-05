---
fuente: genérico - revisar con apuntes
---
# Sucesiones de números reales

> **En una frase:** una sucesión es una lista infinita de números $a_1,a_2,a_3,\dots$ y lo que nos interesa es **a qué se acercan** cuando avanzamos muy lejos en la lista (su límite).

## Lo que necesitas saber antes

- **Límites de funciones en el infinito** (bachillerato): $\lim_{x\to\infty}\frac1x=0$, y en cocientes de polinomios manda el término de mayor grado.
- **Indeterminaciones:** $\frac{\infty}{\infty}$, $\infty-\infty$, $0\cdot\infty$, $1^\infty$, $\frac00$. No significan "no existe": significan "hay que trabajar más".
- **El número $e$:** $e=\lim_{x\to\infty}\left(1+\frac1x\right)^x\approx2{,}718$.
- **Valor absoluto:** $|x-L|<\varepsilon$ significa "$x$ está a menos de $\varepsilon$ de $L$".

## La idea (intuición)

Piensa en $a_n=\frac1n$: $1,\ \frac12,\ \frac13,\ \frac14,\dots$ Los términos se acercan a $0$ tanto como quieras: si alguien te reta "acércate a menos de $0{,}001$", tú respondes "a partir del término 1001 ya lo están todos".

Eso es exactamente un límite: **por muy exigente que sea la tolerancia, a partir de cierto término todos los términos la cumplen**. No basta con que algunos términos se acerquen: tienen que quedarse cerca **para siempre**.

En informática esto aparece al estudiar algoritmos: ¿qué pasa con el tiempo de ejecución cuando $n$ (el tamaño de la entrada) crece mucho?

## Definición formal

Una **sucesión** es una función $a:\N\to\R$, $n\mapsto a_n$. Se escribe $(a_n)$ o $\{a_n\}_{n\ge1}$; $a_n$ es el **término general**.

**Límite.** $(a_n)$ **converge** a $L\in\R$, y se escribe $\lim_{n\to\infty}a_n=L$ o $a_n\to L$, si
$$
\forall\varepsilon>0\ \ \exists N\in\N \text{ tal que } n\ge N \Rightarrow |a_n-L|<\varepsilon.
$$

En cristiano: "para toda tolerancia $\varepsilon$ ($\forall$ = *para todo*) existe ($\exists$) un término $N$ a partir del cual todos los términos están a menos de $\varepsilon$ de $L$".

- Si $a_n\to L$ la sucesión es **convergente**. El límite, si existe, es **único**.
- $a_n\to+\infty$ si para todo $M$ existe $N$ con $a_n>M$ cuando $n\ge N$ (**divergente**).
- Si no converge ni diverge a $\pm\infty$ es **oscilante**, por ejemplo $(-1)^n$: $-1,1,-1,1,\dots$

## Propiedades: monotonía y acotación

- $(a_n)$ es **creciente** si $a_{n+1}\ge a_n$ para todo $n$; **decreciente** si $a_{n+1}\le a_n$.
- Está **acotada** si existe $K$ con $|a_n|\le K$ para todo $n$.
- **Toda sucesión convergente está acotada.** (Lo contrario es falso: $(-1)^n$ está acotada y no converge.)
- **Teorema de la convergencia monótona:** toda sucesión **monótona y acotada** converge. Es la herramienta para sucesiones definidas por recurrencia (ejercicio tipo examen).

Para estudiar la monotonía, calcula $a_{n+1}-a_n$ (¿signo?) o, si los términos son positivos, $\frac{a_{n+1}}{a_n}$ (¿mayor o menor que 1?).

## Cálculo de límites: álgebra e indeterminaciones

Los límites respetan las operaciones: si $a_n\to a$ y $b_n\to b$, entonces $a_n\pm b_n\to a\pm b$, $a_nb_n\to ab$ y $\frac{a_n}{b_n}\to\frac ab$ (si $b\ne0$). Cuando sale una indeterminación:

- **$\frac{\infty}{\infty}$ con polinomios o raíces:** divide numerador y denominador por la mayor potencia de $n$.
  $$\lim\frac{3n^2+1}{5n^2-n}=\frac35,\qquad\lim\frac{n}{n^2+1}=0,\qquad \lim\frac{n^3}{n^2+1}=+\infty.$$
- **$\infty-\infty$ con raíces:** multiplica y divide por el **conjugado**:
  $$\sqrt{n+1}-\sqrt n=\frac{(n+1)-n}{\sqrt{n+1}+\sqrt n}=\frac{1}{\sqrt{n+1}+\sqrt n}\to0.$$
- **$1^\infty$:** usa la fórmula del número $e$. Si $a_n\to1$ y $b_n\to\infty$,
  $$\lim a_n^{\,b_n}=e^{\lim b_n(a_n-1)}.$$

## Órdenes de magnitud (quién gana en el infinito)

Cuando $n\to\infty$, de más lento a más rápido:
$$
\log n\ \ll\ n^p\ (p>0)\ \ll\ a^n\ (a>1)\ \ll\ n!\ \ll\ n^n.
$$
"$\ll$" significa que el cociente de la izquierda entre la derecha tiende a 0. Por ejemplo $\frac{n^{100}}{2^n}\to0$ y $\frac{2^n}{n!}\to0$. ¡Esto es justo lo que verás en complejidad de algoritmos!

## Criterios útiles

- **Regla del sándwich:** si $b_n\le a_n\le c_n$ y $b_n,c_n\to L$, entonces $a_n\to L$.
  Ejemplo: $-\frac1n\le\frac{\sin n}{n}\le\frac1n$, así que $\frac{\sin n}{n}\to0$.
- **Acotada por algo que tiende a 0:** si $(b_n)$ está acotada y $a_n\to0$, entonces $a_nb_n\to0$.
- **Criterio de Stolz** (para cocientes $\frac{a_n}{b_n}$ con $b_n$ creciente hacia $+\infty$): si existe $\lim\frac{a_{n+1}-a_n}{b_{n+1}-b_n}=L$, entonces $\lim\frac{a_n}{b_n}=L$. Muy útil con sumas: $\frac{1+2+\dots+n}{n^2}$.
- **Criterio del cociente** (términos positivos): si $\frac{a_{n+1}}{a_n}\to\ell<1$ entonces $a_n\to0$; si $\ell>1$, $a_n\to+\infty$.

## Ejemplos resueltos

### Ejemplo 1 (fácil): cociente de polinomios

$\displaystyle\lim_{n\to\infty}\frac{2n^2-3n}{4n^2+7}$.

Dividimos todo por $n^2$ (la mayor potencia):
$$\frac{2-\frac3n}{4+\frac{7}{n^2}}\ \longrightarrow\ \frac{2-0}{4+0}=\frac12.$$

### Ejemplo 2 (típico): indeterminación $1^\infty$

$\displaystyle\lim_{n\to\infty}\left(\frac{n+3}{n+1}\right)^{2n}$.

1. La base $\frac{n+3}{n+1}\to1$ y el exponente $2n\to\infty$: es $1^\infty$.
2. Fórmula: $\lim a_n^{b_n}=e^{\lim b_n(a_n-1)}$.
3. $a_n-1=\frac{n+3}{n+1}-1=\frac{n+3-(n+1)}{n+1}=\frac{2}{n+1}$.
4. $b_n(a_n-1)=2n\cdot\frac{2}{n+1}=\frac{4n}{n+1}\to4$.

**Resultado:** $e^4$.

### Ejemplo 3 (tipo examen): sucesión recurrente

Sea $a_1=1$ y $a_{n+1}=\sqrt{2+a_n}$. Demuestra que converge y calcula el límite.

1. **Primeros términos:** $a_1=1$, $a_2=\sqrt3\approx1{,}73$, $a_3\approx1{,}93$. Parece creciente y acercarse a 2.
2. **Acotada por 2** (inducción): $a_1=1<2$. Si $a_n<2$, entonces $a_{n+1}=\sqrt{2+a_n}<\sqrt{4}=2$. ✓
3. **Creciente:** $a_{n+1}>a_n\iff\sqrt{2+a_n}>a_n\iff 2+a_n>a_n^2\iff a_n^2-a_n-2<0\iff(a_n-2)(a_n+1)<0$, que es cierto porque $0<a_n<2$. ✓
4. **Converge** por ser monótona y acotada. Sea $L$ su límite. Tomando límites en la recurrencia: $L=\sqrt{2+L}\Rightarrow L^2=2+L\Rightarrow L^2-L-2=0\Rightarrow L=2$ o $L=-1$.
5. Como $a_n>0$, $L\ge0$: **$L=2$**.

**Trampa:** calcular $L$ resolviendo $L=\sqrt{2+L}$ **sin** demostrar antes que converge. Sin el paso 4 no sabes si el límite existe.

## Errores típicos

- ❌ "$1^\infty=1$". → ✅ Es indeterminado; usa $e^{\lim b_n(a_n-1)}$.
- ❌ Calcular el límite de una recurrente sin probar que converge. → ✅ Primero monotonía + acotación.
- ❌ "Si está acotada, converge". → ✅ $(-1)^n$ está acotada y no converge; hace falta además que sea **monótona**.
- ❌ $\sqrt{n+1}-\sqrt n=\infty-\infty=0$ "porque se restan iguales". → ✅ Multiplica por el conjugado (aquí sí da 0, pero $\sqrt{n^2+n}-n\to\frac12$).
- ❌ En $\frac{n^2+1}{n^3}$, quedarse con "$\frac{\infty}{\infty}=1$". → ✅ Manda la mayor potencia: tiende a 0.

## Para llevar

- Límite: a partir de un término, **todos** están tan cerca de $L$ como quieras.
- Convergente ⇒ acotada. Monótona + acotada ⇒ convergente.
- $\frac\infty\infty$: divide por la mayor potencia. $\infty-\infty$ con raíces: conjugado.
- $1^\infty$: $\lim a_n^{b_n}=e^{\lim b_n(a_n-1)}$.
- $\log n\ll n^p\ll a^n\ll n!\ll n^n$.
- Sándwich, "acotada × algo que tiende a 0", Stolz, cociente.
