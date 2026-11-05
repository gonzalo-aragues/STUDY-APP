---
fuente: genérico - revisar con apuntes
---
# Soluciones — Series numéricas

### Solución 1
a) Geométrica de razón $r=\frac23$, $|r|<1$ ⇒ converge. Primer término ($n=0$): $1$.
$$S=\frac{1}{1-\frac23}=\frac{1}{1/3}=3.$$

b) Razón $r=\frac12$; primer término ($n=1$): $\frac12$.
$$S=\frac{1/2}{1-1/2}=1.$$

**Resultado:** a) $3$; b) $1$.

### Solución 2
El término general $\frac{n}{n+1}\to1\neq0$. Por la condición necesaria, **diverge** (a $+\infty$: estás sumando números cada vez más cercanos a 1).

### Solución 3
Son $p$-series $\sum\frac1{n^p}$, que convergen si y solo si $p>1$:

a) $p=2>1$: **converge**. b) $\frac1{\sqrt n}=\frac1{n^{1/2}}$, $p=\frac12\le1$: **diverge**. c) $p=1{,}01>1$: **converge** (aunque muy despacio). d) $p=1$, armónica: **diverge**.

### Solución 4
Fracciones simples: $\frac{1}{n(n+1)}=\frac1n-\frac1{n+1}$ (compruébalo sumando: $\frac{(n+1)-n}{n(n+1)}$ ✓).

$$S_N=\left(1-\tfrac12\right)+\left(\tfrac12-\tfrac13\right)+\dots+\left(\tfrac1N-\tfrac1{N+1}\right)=1-\frac1{N+1}.$$
Todo se cancela salvo el primero y el último.

**Resultado:** $S_N=1-\frac{1}{N+1}\to1$, la suma es $1$.

### Solución 5
$\frac{(-1)^n}{3^n}=\left(-\frac13\right)^n$: geométrica de razón $r=-\frac13$, $|r|<1$ ⇒ converge. Primer término ($n=1$): $-\frac13$.
$$S=\frac{-1/3}{1-(-1/3)}=\frac{-1/3}{4/3}=-\frac14.$$

**Resultado:** $-\frac14$.

### Solución 6
Términos positivos y $n^2+5>n^2$, así que
$$0<\frac{1}{n^2+5}<\frac{1}{n^2}.$$
Como $\sum\frac1{n^2}$ converge ($p=2$), por comparación directa **converge**.

### Solución 7
a) Grado abajo − arriba $=3-1=2$ ⇒ comparo con $b_n=\frac1{n^2}$:
$$\lim\frac{(n+1)n^2}{n^3+2}=\lim\frac{n^3+n^2}{n^3+2}=1\in(0,\infty).$$
Mismo carácter que $\sum\frac1{n^2}$: **converge**.

b) Grado abajo − arriba $=1$ ⇒ comparo con $b_n=\frac1n$:
$$\lim\frac{1/(2n-1)}{1/n}=\lim\frac{n}{2n-1}=\frac12\in(0,\infty).$$
Mismo carácter que la armónica: **diverge**.

### Solución 8
a) $\displaystyle\frac{a_{n+1}}{a_n}=\frac{n+1}{2^{n+1}}\cdot\frac{2^n}{n}=\frac{n+1}{2n}\to\frac12<1$ ⇒ **converge**.

b) $\displaystyle\frac{a_{n+1}}{a_n}=\frac{(n+1)!}{10^{n+1}}\cdot\frac{10^n}{n!}=\frac{n+1}{10}\to+\infty>1$ ⇒ **diverge**. (De hecho $\frac{n!}{10^n}\to\infty$: ni siquiera cumple la condición necesaria.)

### Solución 9
Todo está elevado a $n$: criterio de la raíz.
$$\sqrt[n]{a_n}=\frac{n}{2n+1}\to\frac12<1\ \Rightarrow\ \textbf{converge}.$$

### Solución 10
**Absoluta:** $\sum\left|\frac{(-1)^{n+1}}{n}\right|=\sum\frac1n$ es la armónica: diverge. No converge absolutamente.

**Leibniz:** $b_n=\frac1n$ es positiva, decreciente y $\to0$. Luego la alternada **converge**.

**Resultado:** converge **condicionalmente** (su suma es $\ln2$, curiosidad).

### Solución 11
Separamos en dos series (se puede porque las dos convergen):
$$\sum_{n=1}^{\infty}\frac{2^n+1}{3^n}=\sum_{n=1}^{\infty}\left(\frac23\right)^n+\sum_{n=1}^{\infty}\left(\frac13\right)^n.$$

- Primera: $r=\frac23$, primer término $\frac23$: $\dfrac{2/3}{1/3}=2$.
- Segunda: $r=\frac13$, primer término $\frac13$: $\dfrac{1/3}{2/3}=\frac12$.

**Resultado:** converge y su suma es $2+\frac12=\frac52$.

### Solución 12
a) $n^2+3n+2=(n+1)(n+2)$. Buscamos $\frac{1}{(n+1)(n+2)}=\frac{A}{n+1}+\frac{B}{n+2}$:
$1=A(n+2)+B(n+1)$. Con $n=-1$: $A=1$. Con $n=-2$: $B=-1$.
$$\frac{1}{n^2+3n+2}=\frac{1}{n+1}-\frac{1}{n+2}.$$

b) Telescópica:
$$S_N=\left(\tfrac12-\tfrac13\right)+\left(\tfrac13-\tfrac14\right)+\dots+\left(\tfrac{1}{N+1}-\tfrac1{N+2}\right)=\frac12-\frac{1}{N+2}\to\frac12.$$

**Resultado:** $\frac12$.

### Solución 13
Términos positivos. Criterio del cociente:
$$\frac{a_{n+1}}{a_n}=\frac{a^{n+1}}{n+1}\cdot\frac{n}{a^n}=a\cdot\frac{n}{n+1}\to a.$$

- $0<a<1$: $\ell=a<1$ ⇒ **converge**.
- $a>1$: $\ell=a>1$ ⇒ **diverge**.
- $a=1$: el cociente no decide. La serie queda $\sum\frac1n$, la armónica ⇒ **diverge**.

**Resultado:** converge si y solo si $0<a<1$.
