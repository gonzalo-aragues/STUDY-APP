---
fuente: genérico - revisar con apuntes
---
# Matrices y sistemas lineales

> **En una frase:** una matriz es una tabla de números que permite escribir y resolver muchas ecuaciones lineales a la vez; el método de Gauss y el rango te dicen si un sistema tiene una, ninguna o infinitas soluciones.

## Lo que necesitas saber antes

- **Sistemas de 2 o 3 ecuaciones** por sustitución o reducción (bachillerato). Gauss es "reducción ordenada".
- **Ecuación lineal:** las incógnitas aparecen solo multiplicadas por números y sumadas: $2x-y+3z=5$ sí; $xy=1$ o $x^2=4$ no.
- **Notación:** $\R^n$ es el conjunto de listas de $n$ números reales, como $(1,-2,3)\in\R^3$.
- Si en bachillerato viste matrices y determinantes, esto es un repaso ampliado; si no, empezamos de cero.

## La idea (intuición)

Un sistema como
$$\begin{cases}x+2y=5\\3x-y=1\end{cases}$$
tiene "lo importante" en los **números**: $1,2,3,-1$ y $5,1$. Las letras solo dicen qué columna es cuál. Una matriz guarda esos números en una tabla para trabajar **solo con ellos**, de forma mecánica. Es justo lo que hace un ordenador (gráficos 3D, redes neuronales, buscadores… todo son matrices).

Geométricamente, cada ecuación con dos incógnitas es una **recta**. Resolver el sistema es buscar dónde se cortan: en un punto (una solución), en ningún sitio (paralelas: ninguna) o en todos (la misma recta: infinitas). Esas tres opciones son las únicas posibles, también con más incógnitas.

## Matrices: definición y tipos

Una **matriz** $m\times n$ es una tabla de $m$ filas y $n$ columnas. Su elemento de la fila $i$, columna $j$ es $a_{ij}$:
$$A=\begin{pmatrix}a_{11}&a_{12}&a_{13}\\a_{21}&a_{22}&a_{23}\end{pmatrix}\in\mathcal M_{2\times3}(\R).$$

Tipos que hay que reconocer:

- **Cuadrada** ($n\times n$); su **diagonal principal** son los $a_{ii}$.
- **Identidad** $I_n$: unos en la diagonal, ceros fuera. Es el "1" de las matrices.
- **Triangular superior**: ceros debajo de la diagonal. **Diagonal**: ceros fuera de ella.
- **Traspuesta** $A^t$: cambia filas por columnas, $(A^t)_{ij}=a_{ji}$. **Simétrica** si $A^t=A$.

## Operaciones

- **Suma** (mismo tamaño): elemento a elemento. **Por un número**: multiplica cada elemento.
- **Producto** $AB$: solo si **columnas de $A$ = filas de $B$**. Si $A$ es $m\times n$ y $B$ es $n\times p$, $AB$ es $m\times p$ y
$$(AB)_{ij}=a_{i1}b_{1j}+a_{i2}b_{2j}+\dots+a_{in}b_{nj}$$
Es decir: fila $i$ de $A$ "por" columna $j$ de $B$ (multiplica uno a uno y suma).

¡Cuidado! El producto **no es conmutativo**: en general $AB\neq BA$ (a veces ni siquiera existen los dos). Sí se cumple: $(AB)C=A(BC)$, $A(B+C)=AB+AC$, $AI=IA=A$ y $(AB)^t=B^tA^t$.

## Determinantes

El **determinante** de una matriz cuadrada es un número, $\det A$ o $|A|$, que dice si la matriz es "invertible" ($\det A\neq0$).

- $2\times2$: $\begin{vmatrix}a&b\\c&d\end{vmatrix}=ad-bc$.
- $3\times3$ (**regla de Sarrus**): suma de los productos de la diagonal principal y sus dos "paralelas", menos los de la otra diagonal y sus paralelas:
$$\begin{vmatrix}a&b&c\\d&e&f\\g&h&i\end{vmatrix}=\begin{aligned}&aei+bfg+cdh\\&-ceg-bdi-afh.\end{aligned}$$
- Cualquier tamaño: **desarrollo por una fila o columna** (elige la que tenga más ceros), con signos en tablero de ajedrez $\begin{smallmatrix}+&-&+\\-&+&-\\+&-&+\end{smallmatrix}$.

**Propiedades que ahorran cuentas:**

1. Intercambiar dos filas cambia el signo del determinante.
2. Multiplicar una fila por $k$ multiplica el determinante por $k$.
3. Sumar a una fila un múltiplo de otra **no cambia** el determinante.
4. Si hay una fila de ceros o dos filas proporcionales, $\det=0$.
5. Triangular: $\det$ = producto de la diagonal. $\det(AB)=\det A\det B$; $\det A^t=\det A$.

## Matriz inversa

$A^{-1}$ es la matriz que cumple $AA^{-1}=A^{-1}A=I$. **Existe si y solo si $\det A\neq0$** (matriz regular).

- $2\times2$: $\begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1}=\dfrac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$ (cambia la diagonal, cambia el signo de la otra).
- En general, **Gauss-Jordan**: escribe $(A\mid I)$ y haz operaciones de fila hasta obtener $(I\mid A^{-1})$.
- Con adjuntos: $A^{-1}=\frac{1}{\det A}(\operatorname{Adj}A)^t$.

## Rango

El **rango** de $A$, $\operatorname{rg}(A)$, es el número de filas (o columnas) **linealmente independientes**: las que no se pueden obtener combinando las demás. En la práctica:

- Por **Gauss**: escalona la matriz; el rango es el número de filas no nulas.
- Por **menores**: el mayor tamaño de un determinante no nulo que puedas sacar de $A$.

## Sistemas de ecuaciones lineales

Un sistema de $m$ ecuaciones y $n$ incógnitas se escribe $AX=B$, con $A$ la **matriz de coeficientes** y $(A\mid B)$ la **matriz ampliada**.

**Método de Gauss:**
1. Escribe la ampliada $(A\mid B)$.
2. Con operaciones de fila (intercambiar, multiplicar por $k\neq0$, sumar múltiplo de otra), haz **ceros debajo** de cada pivote hasta tener forma **escalonada**.
3. Resuelve de abajo arriba (sustitución regresiva).

**Teorema de Rouché-Frobenius** (clasifica sin resolver). Con $n$ = número de incógnitas:

| Situación | Tipo | Soluciones |
|---|---|---|
| $\operatorname{rg}A\neq\operatorname{rg}(A\mid B)$ | Incompatible (SI) | Ninguna |
| $\operatorname{rg}A=\operatorname{rg}(A\mid B)=n$ | Compatible determinado (SCD) | Una |
| $\operatorname{rg}A=\operatorname{rg}(A\mid B)<n$ | Compatible indeterminado (SCI) | Infinitas, con $n-\operatorname{rg}A$ parámetros |

En un SCI, las incógnitas "sobrantes" pasan a ser **parámetros** ($z=\lambda$) y las demás se expresan en función de ellos.

**Cramer:** si el sistema es cuadrado y $\det A\neq0$, $x_i=\frac{\det A_i}{\det A}$, donde $A_i$ es $A$ con la columna $i$ sustituida por $B$. Cómodo en $2\times2$ y $3\times3$.

## Ejemplos resueltos

### Ejemplo 1 (fácil): producto de matrices

$A=\begin{pmatrix}1&2\\0&-1\end{pmatrix}$, $B=\begin{pmatrix}3&1\\2&4\end{pmatrix}$. Calcula $AB$ y $BA$.

$$AB=\begin{pmatrix}1\cdot3+2\cdot2&1\cdot1+2\cdot4\\0\cdot3+(-1)\cdot2&0\cdot1+(-1)\cdot4\end{pmatrix}$$
$$AB=\begin{pmatrix}7&9\\-2&-4\end{pmatrix},\qquad BA=\begin{pmatrix}3&5\\2&0\end{pmatrix}.$$
Distintos: el orden importa.

### Ejemplo 2 (típico): sistema por Gauss

$$\begin{cases}x+y+z=6\\2x-y+z=3\\x+2y-z=2\end{cases}\quad\rightarrow\quad\left(\begin{array}{ccc|c}1&1&1&6\\2&-1&1&3\\1&2&-1&2\end{array}\right)$$

- $F_2\to F_2-2F_1$ y $F_3\to F_3-F_1$: $\left(\begin{array}{ccc|c}1&1&1&6\\0&-3&-1&-9\\0&1&-2&-4\end{array}\right)$
- $F_3\to 3F_3+F_2$: $\left(\begin{array}{ccc|c}1&1&1&6\\0&-3&-1&-9\\0&0&-7&-21\end{array}\right)$
- Abajo arriba: $-7z=-21\Rightarrow z=3$; $-3y-3=-9\Rightarrow y=2$; $x+2+3=6\Rightarrow x=1$.

**Solución:** $(x,y,z)=(1,2,3)$. Comprueba en la 3.ª: $1+4-3=2$ ✓.

### Ejemplo 3 (tipo examen): discutir según un parámetro

Discute según $a\in\R$: $\begin{cases}x+y=1\\x+ay=a\end{cases}$.

1. $|A|=\begin{vmatrix}1&1\\1&a\end{vmatrix}=a-1$. Se anula si $a=1$.
2. **Si $a\neq1$:** $\operatorname{rg}A=2=\operatorname{rg}(A|B)=n$ ⇒ **SCD**. (De hecho: restando, $(a-1)y=a-1$, $y=1$, $x=0$.)
3. **Si $a=1$:** las dos ecuaciones son $x+y=1$ ⇒ $\operatorname{rg}A=\operatorname{rg}(A|B)=1<2$ ⇒ **SCI** con 1 parámetro: $y=\lambda$, $x=1-\lambda$.

**Trampa:** olvidar estudiar aparte los valores que anulan el determinante: ahí es donde pasa lo interesante.

## Errores típicos

- ❌ Multiplicar matrices "elemento a elemento". → ✅ Fila por columna.
- ❌ Suponer $AB=BA$ o simplificar $AX=AY\Rightarrow X=Y$ sin que $A$ sea invertible.
- ❌ $\det(A+B)=\det A+\det B$ o $\det(kA)=k\det A$. → ✅ $\det(kA)=k^n\det A$ si $A$ es $n\times n$.
- ❌ En Gauss, operar con la fila que estás cambiando: $F_2\to F_2-2F_1$ está bien; $F_2\to F_1-2F_2$ también es válido, pero no mezcles dos filas que cambian a la vez.
- ❌ Concluir "SCI" cuando $\det A=0$ sin mirar la ampliada: puede ser **incompatible**.
- ❌ Olvidar la columna de términos independientes al hacer operaciones de fila.

## Para llevar

- $A_{m\times n}\cdot B_{n\times p}=C_{m\times p}$; fila por columna; $AB\neq BA$.
- $\det$: $ad-bc$; Sarrus en $3\times3$; sumar a una fila múltiplo de otra no lo cambia.
- $A^{-1}$ existe $\iff\det A\neq0$; Gauss-Jordan: $(A|I)\to(I|A^{-1})$.
- Rango = filas no nulas tras escalonar.
- Rouché-Frobenius: rangos distintos ⇒ SI; iguales $=n$ ⇒ SCD; iguales $<n$ ⇒ SCI con $n-\operatorname{rg}$ parámetros.
- Con parámetros: anula el determinante y estudia esos casos aparte.
