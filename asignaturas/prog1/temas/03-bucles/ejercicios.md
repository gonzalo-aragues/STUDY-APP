---
fuente: genérico - revisar con apuntes
---
# Ejercicios — Bucles

Antes de programar cada ejercicio, piensa los **tres ingredientes**: inicialización, condición y avance.

## Básico

### Ejercicio 1. ¿Cuántas vueltas?
Sin ejecutarlos, di qué imprime cada fragmento y cuántas vueltas da:
```cpp
// a)
for (int i = 0; i < 10; i += 3) {
    cout << i << " ";
}
// b)
int k = 20, vueltas = 0;
while (k > 1) {
    k = k / 2;
    vueltas++;
}
cout << vueltas;
```

### Ejercicio 2. Suma de 1 a n
Lee un entero $n\ge1$ y muestra $1+2+\dots+n$.
```text
// entrada
100
```
```text
// salida esperada
5050
```

### Ejercicio 3. Tabla de multiplicar
Lee un entero y muestra su tabla del 1 al 10 con el formato `7 x 1 = 7`.
```text
// entrada
7
```
```text
// salida esperada
7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63
7 x 10 = 70
```

### Ejercicio 4. Pares hasta n
Lee $n$ y muestra los números pares entre 1 y $n$, separados por un espacio.
```text
// entrada
10
```
```text
// salida esperada
2 4 6 8 10
```

### Ejercicio 5. Número de cifras
Lee un entero (puede ser negativo o 0) y muestra cuántas cifras tiene. El 0 tiene una cifra.
```text
// entrada
-4096
```
```text
// salida esperada
4
```

## Medio

### Ejercicio 6. Media con centinela
Lee enteros hasta que llegue un 0 (que no cuenta) y muestra cuántos se han leído y su media.
```text
// entrada
4 8 15 16 23 42 0
```
```text
// salida esperada
Leidos: 6
Media: 18
```

### Ejercicio 7. Factorial
Lee $n$ ($0\le n\le20$) y muestra $n!$. Recuerda que $0!=1$. ¿Qué tipo necesitas?
```text
// entrada
20
```
```text
// salida esperada
2432902008176640000
```

### Ejercicio 8. Máximo común divisor
Calcula el MCD de dos enteros positivos con el **algoritmo de Euclides**: mientras $b\neq0$, sustituye $(a,b)$ por $(b,\ a\bmod b)$; el MCD es el último $a$.
```text
// entrada
84 36
```
```text
// salida esperada
12
```

### Ejercicio 9. Triángulo de asteriscos
Lee $n$ y dibuja un triángulo de $n$ filas: la fila $i$ tiene $i$ asteriscos.
```text
// entrada
4
```
```text
// salida esperada
*
**
***
****
```

## Tipo examen

### Ejercicio 10. Número capicúa
Lee un entero positivo, construye el número con las cifras al revés y di si es capicúa (se lee igual al derecho y al revés).
```text
// entrada
12321
```
```text
// salida esperada
Invertido: 12321
Es capicua
```

### Ejercicio 11. Números perfectos
Un número es **perfecto** si es igual a la suma de sus divisores propios ($6=1+2+3$). Lee $N$ y muestra todos los perfectos entre 1 y $N$ separados por espacios.
```text
// entrada
1000
```
```text
// salida esperada
6 28 496
```

### Ejercicio 12. Estadística de notas
Lee notas reales hasta que se introduzca `-1`. Las notas fuera de $[0,10]$ se ignoran escribiendo `Nota ignorada: x`. Al final muestra cuántas notas válidas hay, la máxima y el porcentaje de aprobados (nota ≥ 5). Si no hay ninguna válida, escribe `Sin notas`.
```text
// entrada
7 11 3.5 9 5 -1
```
```text
// salida esperada
Nota ignorada: 11
Validas: 4
Maxima: 9
Aprobados: 75%
```
