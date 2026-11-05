---
fuente: genérico - revisar con apuntes
---
# Ejercicios — Matrices y sistemas lineales

## Básico

### Ejercicio 1. Operaciones básicas
Sean $A=\begin{pmatrix}2&-1\\0&3\end{pmatrix}$ y $B=\begin{pmatrix}1&4\\-2&1\end{pmatrix}$. Calcula $A+B$, $3A$ y $A^t$.

### Ejercicio 2. Producto
Sean $A=\begin{pmatrix}1&0&2\\-1&3&1\end{pmatrix}$ y $B=\begin{pmatrix}2&1\\1&0\\0&4\end{pmatrix}$.

a) ¿De qué tamaño es $AB$? Calcúlalo.
b) ¿Se puede calcular $BA$? ¿De qué tamaño sería?

### Ejercicio 3. Determinantes
Calcula: a) $\begin{vmatrix}3&2\\1&4\end{vmatrix}$  b) $\begin{vmatrix}1&2&0\\3&-1&2\\1&0&1\end{vmatrix}$

### Ejercicio 4. Inversa $2\times2$
Calcula la inversa de $A=\begin{pmatrix}2&1\\5&3\end{pmatrix}$ y comprueba que $AA^{-1}=I$.

### Ejercicio 5. Rango por Gauss
Calcula el rango de $\begin{pmatrix}1&2&3\\2&4&6\\1&0&1\end{pmatrix}$.

## Medio

### Ejercicio 6. Sistema por Gauss
Resuelve por el método de Gauss:
$$\begin{cases}x+2y-z=3\\2x+y+z=6\\-x+y+2z=5\end{cases}$$

### Ejercicio 7. Inversa por Gauss-Jordan
Calcula la inversa de $A=\begin{pmatrix}1&0&1\\0&1&0\\1&0&2\end{pmatrix}$ por Gauss-Jordan.

### Ejercicio 8. Propiedades del determinante
a) Calcula $\begin{vmatrix}1&2&3&4\\0&2&1&0\\0&0&3&5\\0&0&0&-1\end{vmatrix}$ sin desarrollar.
b) Si $A$ es $3\times3$ con $\det A=5$, calcula $\det(2A)$, $\det(A^t)$ y $\det(A^{-1})$.

### Ejercicio 9. Clasificar sin resolver
Usa el teorema de Rouché-Frobenius para clasificar:
$$\begin{cases}x+y+z=1\\x-y+z=3\\2x+2z=5\end{cases}$$

### Ejercicio 10. Sistema compatible indeterminado
Resuelve $\begin{cases}x+y+z=2\\2x+y+2z=3\end{cases}$ y da la solución en función de un parámetro.

## Tipo examen

### Ejercicio 11. Discusión con parámetro
Discute según los valores de $a\in\R$ y resuelve cuando sea compatible:
$$\begin{cases}x+y+z=1\\x+ay+z=a\\x+y+az=a^2\end{cases}$$

### Ejercicio 12. Ecuación matricial
Con $A=\begin{pmatrix}2&1\\5&3\end{pmatrix}$ y $B=\begin{pmatrix}1&0\\2&1\end{pmatrix}$, halla la matriz $X$ tal que $AX=B$. ¿Por qué no vale $X=BA^{-1}$?

### Ejercicio 13. Rango según un parámetro
Estudia el rango de $A=\begin{pmatrix}1&1&k\\1&k&1\\k&1&1\end{pmatrix}$ según los valores de $k\in\R$.
