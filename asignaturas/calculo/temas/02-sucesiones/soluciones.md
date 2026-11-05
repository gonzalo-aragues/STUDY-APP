---
fuente: genérico - revisar con apuntes
---
# Soluciones — Sucesiones

### Solución 1
$a_1=-1,\ a_2=\frac12,\ a_3=-\frac13,\ a_4=\frac14,\ a_5=-\frac15$.

- **No es monótona:** los signos se alternan (sube, baja, sube…).
- **Converge a 0:** $|a_n|=\frac1n\to0$, y si $|a_n|\to0$ entonces $a_n\to0$.

**Resultado:** no monótona, convergente, $\lim a_n=0$.

### Solución 2
Es $\frac{\infty}{\infty}$. Dividimos numerador y denominador por $n^3$:
$$\frac{5-\frac{2}{n^2}}{2+\frac1n+\frac1{n^3}}\longrightarrow\frac{5}{2}.$$

**Resultado:** $\frac52$.

### Solución 3
a) Dividimos por $n^3$ (mayor potencia del denominador):
$$\frac{\frac1n+\frac1{n^3}}{1-\frac4{n^3}}\to\frac{0}{1}=0.$$

b) Dividimos por $n^3$: $\dfrac{2n}{1+\frac1{n^2}}\to+\infty$.

**Resultado:** a) $0$; b) $+\infty$. Regla: si el grado de arriba es menor, 0; si es mayor, $\pm\infty$; si es igual, el cociente de coeficientes principales.

### Solución 4
Es $\infty-\infty$ con raíz: multiplicamos y dividimos por el conjugado $\sqrt{n^2+3n}+n$:
$$\sqrt{n^2+3n}-n=\frac{(n^2+3n)-n^2}{\sqrt{n^2+3n}+n}=\frac{3n}{\sqrt{n^2+3n}+n}.$$
Dividimos por $n$ (dentro de la raíz es dividir por $n^2$):
$$\frac{3}{\sqrt{1+\frac3n}+1}\to\frac{3}{1+1}=\frac32.$$

**Resultado:** $\frac32$.

### Solución 5
**Monotonía:**
$$\begin{aligned}a_{n+1}-a_n&=\frac{n+1}{n+2}-\frac{n}{n+1}=\frac{(n+1)^2-n(n+2)}{(n+2)(n+1)}\\&=\frac{1}{(n+2)(n+1)}>0.\end{aligned}$$
Luego es **estrictamente creciente**.

**Acotación:** $0<\frac{n}{n+1}<1$ para todo $n$ (el numerador es menor que el denominador).

**Límite:** dividiendo por $n$, $\frac{1}{1+\frac1n}\to1$.

**Resultado:** creciente, acotada entre 0 y 1, $\lim a_n=1$ (cuadra con el teorema de la convergencia monótona).

### Solución 6
Es $1^\infty$. Con $a_n=1+\frac3n$ y $b_n=n$:
$$b_n(a_n-1)=n\cdot\frac3n=3\quad\Rightarrow\quad\lim\left(1+\frac3n\right)^n=e^3.$$

**Resultado:** $e^3$.

### Solución 7
Es $1^\infty$: la base tiende a 1 y el exponente a $\infty$.
$$a_n-1=\frac{2n+1}{2n-1}-1=\frac{2}{2n-1},\qquad b_n(a_n-1)=\frac{2n}{2n-1}\to1.$$

**Resultado:** $e^1=e$.

### Solución 8
a) Como $-1\le\cos n\le1$:
$$-\frac1n\le\frac{\cos n}{n}\le\frac1n,$$
y los dos extremos tienden a 0. Por el sándwich, el límite es **0**. (También: $\cos n$ acotada por $\frac1n\to0$.)

b) Separamos: $\dfrac{n+\sin n}{n}=1+\dfrac{\sin n}{n}$. Igual que en a), $\frac{\sin n}{n}\to0$, así que el límite es **1**.

### Solución 9
Usamos $\log n\ll n^p\ll a^n\ll n!$ (lo de la izquierda crece mucho más despacio).

a) $n^5\ll3^n$ ⇒ $\frac{n^5}{3^n}\to0$.
b) $3^n\ll n!$ ⇒ $\frac{3^n}{n!}\to0$. (Con el criterio del cociente: $\frac{a_{n+1}}{a_n}=\frac{3}{n+1}\to0<1$.)
c) $\log n\ll n^{1/2}$ ⇒ $\frac{\log n}{\sqrt n}\to0$.

**Resultado:** los tres límites valen 0.

### Solución 10
Sea $a_n=1+2+\dots+n$ y $b_n=n^2$ (creciente y tiende a $+\infty$, así que Stolz se puede usar).

$a_{n+1}-a_n=n+1$ y $b_{n+1}-b_n=(n+1)^2-n^2=2n+1$. Entonces
$$\lim\frac{a_{n+1}-a_n}{b_{n+1}-b_n}=\lim\frac{n+1}{2n+1}=\frac12.$$
Por Stolz, $\lim\frac{a_n}{b_n}=\frac12$.

**Comprobación:** $\dfrac{n(n+1)/2}{n^2}=\dfrac{n^2+n}{2n^2}\to\frac12$. ✓

### Solución 11
a) **Inducción.** Caso base: $a_1=3<4$. ✓ Paso: si $a_n<4$, entonces $a_{n+1}=\frac{a_n+4}{2}<\frac{4+4}{2}=4$. ✓ Luego $a_n<4$ para todo $n$.

b) **Creciente:** $a_{n+1}-a_n=\frac{a_n+4}{2}-a_n=\frac{4-a_n}{2}>0$ por el apartado a).

c) Es creciente y acotada superiormente por 4 ⇒ **converge** (convergencia monótona). Si $L$ es el límite, en la recurrencia: $L=\frac{L+4}{2}\Rightarrow 2L=L+4\Rightarrow L=4$.

**Resultado:** $\lim a_n=4$.

### Solución 12
Base: $\frac{n^2-1}{n^2+n}\to1$; exponente: $\frac{n^2+2}{n}\to\infty$. Es $1^\infty$.

$$a_n-1=\frac{n^2-1-(n^2+n)}{n^2+n}=\frac{-n-1}{n(n+1)}=-\frac1n.$$
$$b_n(a_n-1)=\frac{n^2+2}{n}\cdot\left(-\frac1n\right)=-\frac{n^2+2}{n^2}\to-1.$$

**Resultado:** $e^{-1}=\dfrac1e$.

### Solución 13
a) Conjugado:
$$\sqrt n\left(\sqrt{n+1}-\sqrt n\right)=\sqrt n\cdot\frac{1}{\sqrt{n+1}+\sqrt n}=\frac{\sqrt n}{\sqrt{n+1}+\sqrt n}.$$
Dividiendo por $\sqrt n$: $\dfrac{1}{\sqrt{1+\frac1n}+1}\to\frac12$.

b) Conjugado:
$$n\left(\sqrt{n^2+1}-n\right)=n\cdot\frac{1}{\sqrt{n^2+1}+n}=\frac{n}{\sqrt{n^2+1}+n}.$$
Dividiendo por $n$: $\dfrac{1}{\sqrt{1+\frac1{n^2}}+1}\to\frac12$.

**Resultado:** a) $\frac12$; b) $\frac12$.
