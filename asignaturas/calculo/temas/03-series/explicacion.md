---
fuente: genérico - revisar con apuntes
---
# Series numéricas

> **En una frase:** una serie es una **suma infinita** $a_1+a_2+a_3+\cdots$; la pregunta es si esa suma "se estabiliza" en un número (converge) o crece sin control (diverge).

## Lo que necesitas saber antes

- **Sucesiones y límites** (tema anterior): $\lim\frac1n=0$, órdenes de magnitud, la indeterminación $1^\infty$.
- **Notación sumatorio:** $\displaystyle\sum_{n=1}^{5}n^2=1+4+9+16+25$. La $n$ es una variable "muda".
- **Progresión geométrica** (bachillerato): $1+r+r^2+\dots+r^{N}=\dfrac{1-r^{N+1}}{1-r}$ si $r\ne1$.
- **Descomposición en fracciones simples:** $\dfrac{1}{n(n+1)}=\dfrac1n-\dfrac1{n+1}$.

## La idea (intuición)

Imagina que andas hacia una pared a 2 m: primero avanzas 1 m, luego la mitad de lo que queda (0,5 m), luego la mitad otra vez (0,25 m)… Das **infinitos** pasos, pero nunca recorres más de 2 m:
$$1+\frac12+\frac14+\frac18+\cdots=2.$$
Así que una suma infinita **puede** dar un número finito. Pero no siempre: $1+1+1+\cdots$ crece sin límite, y (sorpresa) $1+\frac12+\frac13+\frac14+\cdots$ también, aunque sus términos se hagan pequeñísimos.

El truco es mirar las **sumas parciales**: sumo los $N$ primeros términos y veo qué pasa cuando $N\to\infty$. Una serie es, en el fondo, **una sucesión de sumas parciales**.

## Definición formal

Dada una sucesión $(a_n)$, la **serie** $\displaystyle\sum_{n=1}^{\infty}a_n$ es la sucesión de **sumas parciales**
$$S_N=a_1+a_2+\dots+a_N=\sum_{n=1}^{N}a_n.$$

- Si $S_N\to S\in\R$, la serie es **convergente** y su **suma** es $S$: $\sum a_n=S$.
- Si $S_N\to\pm\infty$ es **divergente**; si no tiene límite, **oscilante**.
- Estudiar el **carácter** de una serie = decir si converge o no (casi nunca se pide la suma, salvo en geométricas y telescópicas).

En cristiano: una serie converge si, al ir sumando términos, el total se acerca a un número fijo.

## Condición necesaria (el primer filtro)

Si $\sum a_n$ converge, entonces $a_n\to0$.

Por tanto: **si $a_n\not\to0$, la serie diverge** (y has terminado). Pero si $a_n\to0$ **no sabes nada todavía**: la armónica $\sum\frac1n$ tiene $\frac1n\to0$ y diverge.

## Las dos series que sí sabemos sumar

**Geométrica** (cada término es el anterior por $r$):
$$\sum_{n=0}^{\infty}r^n=1+r+r^2+\cdots=\frac{1}{1-r}\quad\text{si }|r|<1,$$
y diverge (u oscila) si $|r|\ge1$. Si no empieza en $n=0$: **suma = primer término / (1 − r)**.

**Telescópica** (los términos se cancelan en cadena): si $a_n=b_n-b_{n+1}$, entonces $S_N=b_1-b_{N+1}$. Ejemplo:
$$\sum_{n=1}^{\infty}\frac{1}{n(n+1)}=\sum\left(\frac1n-\frac1{n+1}\right),\qquad S_N=1-\frac{1}{N+1}\to1.$$

## Series de referencia: las $p$-series

$$\sum_{n=1}^{\infty}\frac{1}{n^p}\ \text{ converge si } p>1 \text{ y diverge si } p\le1.$$

- $p=1$: **serie armónica** $\sum\frac1n$, diverge (muy despacio: hacen falta ~12 000 términos para pasar de 10).
- $\sum\frac1{n^2}$ converge (su suma es $\frac{\pi^2}{6}$, curiosidad). $\sum\frac{1}{\sqrt n}$ diverge.

Son la "regla" con la que comparamos todo lo demás.

## Criterios para series de términos positivos

**1. Comparación directa.** Si $0\le a_n\le b_n$:
- $\sum b_n$ converge ⇒ $\sum a_n$ converge (lo pequeño de algo finito es finito).
- $\sum a_n$ diverge ⇒ $\sum b_n$ diverge.

**2. Comparación en el límite** (la más usada). Si $a_n,b_n>0$ y $\lim\frac{a_n}{b_n}=\ell$ con $0<\ell<\infty$, las dos series tienen el **mismo carácter**. Truco: elige $b_n=\frac{1}{n^p}$ con $p$ = (grado de abajo − grado de arriba).

**3. Cociente (D'Alembert).** $\ell=\lim\frac{a_{n+1}}{a_n}$. Si $\ell<1$ converge; si $\ell>1$ diverge; si $\ell=1$ **no decide**. Ideal con factoriales y potencias $a^n$.

**4. Raíz (Cauchy).** $\ell=\lim\sqrt[n]{a_n}$. Mismas conclusiones. Ideal cuando todo está elevado a $n$.

## Series alternadas y convergencia absoluta

- $\sum a_n$ **converge absolutamente** si $\sum|a_n|$ converge. **Absoluta ⇒ convergente.**
- **Criterio de Leibniz:** si $b_n\ge0$ es **decreciente** y $b_n\to0$, la serie alternada $\sum(-1)^nb_n$ converge.
- Si converge pero no absolutamente, se dice **condicionalmente convergente**. Ejemplo: $\sum\frac{(-1)^{n+1}}{n}=1-\frac12+\frac13-\cdots$ converge (a $\ln2$), pero $\sum\frac1n$ no.

## ¿Qué criterio uso? (diagrama mental)

1. ¿$a_n\to0$? Si no → **diverge**.
2. ¿Es geométrica o telescópica? → calcula la suma.
3. ¿Cociente de polinomios/raíces? → **comparación en el límite** con $\frac1{n^p}$.
4. ¿Hay $n!$ o $a^n$? → **cociente**.
5. ¿Todo elevado a $n$? → **raíz**.
6. ¿Signos alternos? → absoluta primero; si falla, **Leibniz**.

## Ejemplos resueltos

### Ejemplo 1 (fácil): geométrica

$\displaystyle\sum_{n=1}^{\infty}\frac{5}{4^n}$.

Es geométrica de razón $r=\frac14$ ($|r|<1$, converge). Primer término ($n=1$): $\frac54$.
$$S=\frac{\text{primer término}}{1-r}=\frac{5/4}{1-1/4}=\frac{5/4}{3/4}=\frac53.$$

### Ejemplo 2 (típico): comparación en el límite

$\displaystyle\sum_{n=1}^{\infty}\frac{2n+3}{n^3+1}$.

1. $a_n\to0$ (grado de abajo mayor): no descartamos.
2. Grado abajo − grado arriba $=3-1=2$ ⇒ comparamos con $b_n=\frac1{n^2}$.
3. $\displaystyle\lim\frac{a_n}{b_n}=\lim\frac{(2n+3)n^2}{n^3+1}=\lim\frac{2n^3+3n^2}{n^3+1}=2$, que está entre 0 e $\infty$.
4. Mismo carácter que $\sum\frac1{n^2}$ ($p=2>1$): **converge**.

### Ejemplo 3 (tipo examen): cociente con factorial

$\displaystyle\sum_{n=1}^{\infty}\frac{2^n}{n!}$.

$$\frac{a_{n+1}}{a_n}=\frac{2^{n+1}}{(n+1)!}\cdot\frac{n!}{2^n}=\frac{2}{n+1}\to0<1.$$
Por el criterio del cociente, **converge**. (Recuerda: $(n+1)!=(n+1)\cdot n!$, así se simplifica.)

## Errores típicos

- ❌ "Como $a_n\to0$, la serie converge." → ✅ Es necesario, no suficiente: $\sum\frac1n$ diverge.
- ❌ Confundir el límite de la sucesión con la suma de la serie: $\frac{1}{2^n}\to0$ pero $\sum_{n\ge1}\frac1{2^n}=1$.
- ❌ Usar el cociente con $\frac{1}{n^2}$ y concluir algo con $\ell=1$. → ✅ $\ell=1$ no decide: usa comparación con $p$-series.
- ❌ Sumar una geométrica que empieza en $n=1$ con $\frac{1}{1-r}$. → ✅ Primer término $/(1-r)$.
- ❌ Aplicar comparación a series con términos negativos. → ✅ Los criterios 1–4 son para términos **positivos**.

## Para llevar

- Serie = límite de sumas parciales $S_N$.
- $a_n\not\to0$ ⇒ diverge. $a_n\to0$ ⇒ no sabes nada.
- Geométrica: converge si $|r|<1$, suma $=\frac{\text{primer término}}{1-r}$.
- $\sum\frac1{n^p}$ converge $\iff p>1$. Armónica diverge.
- Comparación en el límite con $\frac1{n^p}$; cociente con $n!$ y $a^n$; raíz con potencias $n$-ésimas.
- Absoluta ⇒ convergente. Leibniz para alternadas: $b_n$ decreciente y $\to0$.
