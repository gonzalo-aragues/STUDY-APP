---
fuente: genérico - revisar con apuntes
---
# Soluciones — Matrices y sistemas lineales

### Solución 1
Suma elemento a elemento, producto por número a cada elemento, traspuesta cambiando filas por columnas:
$$A+B=\begin{pmatrix}3&3\\-2&4\end{pmatrix},\qquad 3A=\begin{pmatrix}6&-3\\0&9\end{pmatrix},\qquad A^t=\begin{pmatrix}2&0\\-1&3\end{pmatrix}.$$

### Solución 2
a) $A$ es $2\times\mathbf3$ y $B$ es $\mathbf3\times2$: coinciden, así que $AB$ existe y es $2\times2$.

- Fila 1 por columna 1: $1\cdot2+0\cdot1+2\cdot0=2$; por columna 2: $1\cdot1+0\cdot0+2\cdot4=9$.
- Fila 2 por columna 1: $-1\cdot2+3\cdot1+1\cdot0=1$; por columna 2: $-1\cdot1+3\cdot0+1\cdot4=3$.

$$AB=\begin{pmatrix}2&9\\1&3\end{pmatrix}.$$

b) $B$ es $3\times\mathbf2$ y $A$ es $\mathbf2\times3$: sí se puede; $BA$ es $3\times3$. Ni siquiera tienen el mismo tamaño que $AB$.

### Solución 3
a) $3\cdot4-2\cdot1=10$.

b) Sarrus:
- Diagonales "hacia abajo": $1\cdot(-1)\cdot1=-1$, $\ 2\cdot2\cdot1=4$, $\ 0\cdot3\cdot0=0$.
- Diagonales "hacia arriba" (se restan): $0\cdot(-1)\cdot1=0$, $\ 2\cdot3\cdot1=6$, $\ 1\cdot2\cdot0=0$.

$$(-1+4+0)-(0+6+0)=-3.$$

**Resultado:** a) $10$; b) $-3$.

### Solución 4
$\det A=2\cdot3-1\cdot5=1\neq0$, así que existe. Fórmula $2\times2$ (intercambia la diagonal, cambia el signo de la otra, divide entre el determinante):
$$A^{-1}=\frac11\begin{pmatrix}3&-1\\-5&2\end{pmatrix}=\begin{pmatrix}3&-1\\-5&2\end{pmatrix}.$$

**Comprobación:** $\begin{pmatrix}2&1\\5&3\end{pmatrix}\begin{pmatrix}3&-1\\-5&2\end{pmatrix}=\begin{pmatrix}6-5&-2+2\\15-15&-5+6\end{pmatrix}=I$. ✓

### Solución 5
$F_2\to F_2-2F_1$ y $F_3\to F_3-F_1$:
$$\begin{pmatrix}1&2&3\\0&0&0\\0&-2&-2\end{pmatrix}\xrightarrow{F_2\leftrightarrow F_3}\begin{pmatrix}1&2&3\\0&-2&-2\\0&0&0\end{pmatrix}.$$
Quedan 2 filas no nulas.

**Resultado:** $\operatorname{rg}=2$ (la fila 2 era el doble de la 1).

### Solución 6
$$\left(\begin{array}{ccc|c}1&2&-1&3\\2&1&1&6\\-1&1&2&5\end{array}\right)\xrightarrow[F_3+F_1]{F_2-2F_1}\left(\begin{array}{ccc|c}1&2&-1&3\\0&-3&3&0\\0&3&1&8\end{array}\right)$$
$$\xrightarrow{F_3+F_2}\left(\begin{array}{ccc|c}1&2&-1&3\\0&-3&3&0\\0&0&4&8\end{array}\right)$$

De abajo arriba:
- $4z=8\Rightarrow z=2$.
- $-3y+3\cdot2=0\Rightarrow y=2$.
- $x+2\cdot2-2=3\Rightarrow x=1$.

**Resultado:** $(x,y,z)=(1,2,2)$. Comprobación en la 3.ª: $-1+2+4=5$ ✓.

### Solución 7
Partimos de $(A\mid I)$:
$$\left(\begin{array}{ccc|ccc}1&0&1&1&0&0\\0&1&0&0&1&0\\1&0&2&0&0&1\end{array}\right)$$
$F_3\to F_3-F_1$:
$$\left(\begin{array}{ccc|ccc}1&0&1&1&0&0\\0&1&0&0&1&0\\0&0&1&-1&0&1\end{array}\right)$$
$F_1\to F_1-F_3$ (ya tenemos $I$ a la izquierda):
$$\left(\begin{array}{ccc|ccc}1&0&0&2&0&-1\\0&1&0&0&1&0\\0&0&1&-1&0&1\end{array}\right)$$

**Resultado:** $A^{-1}=\begin{pmatrix}2&0&-1\\0&1&0\\-1&0&1\end{pmatrix}$.

**Comprobación** (fila 1 de $A$ por columnas de $A^{-1}$): $(1,0,1)\cdot(2,0,-1)=1$, $(1,0,1)\cdot(0,1,0)=0$, $(1,0,1)\cdot(-1,0,1)=0$. ✓

### Solución 8
a) Es **triangular superior**: el determinante es el producto de la diagonal, $1\cdot2\cdot3\cdot(-1)=-6$.

b)
- $\det(2A)=2^3\det A=8\cdot5=40$ (cada una de las 3 filas se multiplica por 2).
- $\det(A^t)=\det A=5$.
- $\det(A^{-1})=\dfrac{1}{\det A}=\dfrac15$ (porque $\det A\det A^{-1}=\det I=1$).

### Solución 9
Ampliada y Gauss:
$$\left(\begin{array}{ccc|c}1&1&1&1\\1&-1&1&3\\2&0&2&5\end{array}\right)\xrightarrow[F_3-2F_1]{F_2-F_1}\left(\begin{array}{ccc|c}1&1&1&1\\0&-2&0&2\\0&-2&0&3\end{array}\right)$$
$$\xrightarrow{F_3-F_2}\left(\begin{array}{ccc|c}1&1&1&1\\0&-2&0&2\\0&0&0&1\end{array}\right)$$

La última fila dice $0=1$. $\operatorname{rg}A=2\neq3=\operatorname{rg}(A|B)$.

**Resultado:** sistema **incompatible** (sin solución). Intuición: la 3.ª ecuación tiene los coeficientes de la suma de las dos primeras, pero el término independiente no es $1+3=4$.

### Solución 10
Restamos: $F_2-2F_1$ da $-y=-1$, así que $y=1$.

Queda $x+z=1$: 2 incógnitas y 1 ecuación ⇒ un parámetro. Tomamos $z=\lambda$, entonces $x=1-\lambda$.

**Resultado:** $(x,y,z)=(1-\lambda,\ 1,\ \lambda)$, $\lambda\in\R$ (SCI: $\operatorname{rg}=2<3$ incógnitas). Por ejemplo, $\lambda=0$ da $(1,1,0)$: $1+1+0=2$ ✓ y $2+1+0=3$ ✓.

### Solución 11
Gauss restando la primera fila a las otras dos:
$$\left(\begin{array}{ccc|c}1&1&1&1\\1&a&1&a\\1&1&a&a^2\end{array}\right)\to\left(\begin{array}{ccc|c}1&1&1&1\\0&a-1&0&a-1\\0&0&a-1&a^2-1\end{array}\right)$$
$|A|=(a-1)^2$ (triangular tras operaciones que no cambian el determinante).

**Caso $a\neq1$:** $\operatorname{rg}A=\operatorname{rg}(A|B)=3$ ⇒ **SCD**. Resolviendo:
- $(a-1)z=a^2-1=(a-1)(a+1)\Rightarrow z=a+1$.
- $(a-1)y=a-1\Rightarrow y=1$.
- $x=1-y-z=1-1-(a+1)=-a-1$.

Solución $(x,y,z)=(-a-1,\ 1,\ a+1)$. Comprobación en la 3.ª: $(-a-1)+1+a(a+1)=a^2$ ✓.

**Caso $a=1$:** las tres ecuaciones son $x+y+z=1$. $\operatorname{rg}A=\operatorname{rg}(A|B)=1<3$ ⇒ **SCI con 2 parámetros**: $y=\lambda$, $z=\mu$, $x=1-\lambda-\mu$.

### Solución 12
$A$ es invertible (ejercicio 4: $A^{-1}=\begin{pmatrix}3&-1\\-5&2\end{pmatrix}$). Multiplicamos **por la izquierda** por $A^{-1}$: $A^{-1}AX=A^{-1}B\Rightarrow X=A^{-1}B$.
$$X=\begin{pmatrix}3&-1\\-5&2\end{pmatrix}\begin{pmatrix}1&0\\2&1\end{pmatrix}=\begin{pmatrix}3-2&0-1\\-5+4&0+2\end{pmatrix}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}.$$

**Comprobación:** $AX=\begin{pmatrix}2-1&-2+2\\5-3&-5+6\end{pmatrix}=\begin{pmatrix}1&0\\2&1\end{pmatrix}=B$ ✓.

**Por qué no $BA^{-1}$:** el producto no es conmutativo. $A$ está a la izquierda de $X$, así que hay que "quitarla" por la izquierda. $BA^{-1}$ resolvería $XA=B$.

### Solución 13
Determinante (Sarrus):
$$|A|=k+k+k-k^3-1-1=-k^3+3k-2=-(k-1)^2(k+2).$$
(Comprueba la factorización: $(k-1)^2(k+2)=(k^2-2k+1)(k+2)=k^3-3k+2$.)

- **$k\neq1$ y $k\neq-2$:** $|A|\neq0$ ⇒ $\operatorname{rg}A=3$.
- **$k=1$:** todas las filas son $(1,1,1)$ ⇒ $\operatorname{rg}A=1$.
- **$k=-2$:** $|A|=0$ pero el menor $\begin{vmatrix}1&1\\1&-2\end{vmatrix}=-3\neq0$ ⇒ $\operatorname{rg}A=2$.
