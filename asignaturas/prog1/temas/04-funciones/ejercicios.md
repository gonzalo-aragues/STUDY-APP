---
fuente: genérico - revisar con apuntes
---
# Ejercicios — Funciones

En todos los ejercicios con programa, la función **no** debe usar `cin` ni `cout` (salvo que se diga lo contrario): lee y escribe en `main`.

## Básico

### Ejercicio 1. Valor o referencia
¿Qué imprime este programa?
```cpp
void f(int x, int& y) {
    x = x + 10;
    y = y + 10;
}

int main() {
    int a = 1, b = 2;
    f(a, b);
    cout << a << " " << b << endl;
    return 0;
}
```

### Ejercicio 2. Máximo de dos
Escribe `int maximo(int a, int b)` y úsala para mostrar el mayor de tres números leídos (llamándola dos veces).
```text
// entrada
4 17 9
```
```text
// salida esperada
17
```

### Ejercicio 3. ¿Es vocal?
Escribe `bool esVocal(char c)` (minúsculas, sin tildes). En `main`, lee un carácter y escribe `vocal` o `no vocal`.
```text
// entrada
e
```
```text
// salida esperada
vocal
```

### Ejercicio 4. Encuentra los errores
Este programa no compila. Encuentra los tres errores:
```cpp
int main() {
    int r = cuadrado(int 5);
    cout << r << endl;
    return 0;
}

int cuadrado(int n) {
    n * n;
}
```

### Ejercicio 5. Potencia
Escribe `long long potencia(int base, int exp)` (con `exp >= 0`) usando un bucle, sin `pow`.
```text
// entrada
3 13
```
```text
// salida esperada
1594323
```

## Medio

### Ejercicio 6. Intercambiar
Escribe `void intercambiar(int& a, int& b)`. En `main`, lee dos números, ordénalos de menor a mayor llamando a la función si hace falta y muéstralos.
```text
// entrada
8 3
```
```text
// salida esperada
3 8
```

### Ejercicio 7. Primos hasta n
Escribe `bool esPrimo(int n)` y úsala para mostrar todos los primos entre 2 y $n$ separados por espacios.
```text
// entrada
30
```
```text
// salida esperada
2 3 5 7 11 13 17 19 23 29
```

### Ejercicio 8. Dos resultados
Escribe `void minMax(int a, int b, int c, int& menor, int& mayor)` que calcule el menor y el mayor de tres números.
```text
// entrada
5 -2 9
```
```text
// salida esperada
Menor: -2
Mayor: 9
```

### Ejercicio 9. Traza de ámbito
¿Qué imprime? Sigue con cuidado qué `x` es cada una.
```cpp
int doble(int x) {
    x = 2 * x;
    return x;
}

int main() {
    int x = 3;
    int y = doble(x);
    cout << x << " " << y << " " << doble(doble(x)) << endl;
    return 0;
}
```

## Tipo examen

### Ejercicio 10. Capicúa con funciones
Escribe `int invertir(int n)` y `bool esCapicua(int n)` (que use `invertir`). En `main`, lee un entero $N$ y muestra cuántos números capicúa hay entre 1 y $N$.
```text
// entrada
200
```
```text
// salida esperada
28
```

### Ejercicio 11. Fechas válidas
Escribe `bool esBisiesto(int a)`, `int diasDelMes(int m, int a)` y `bool fechaValida(int d, int m, int a)`. En `main`, lee fechas (`d m a`) hasta que el día sea 0 y escribe `valida` o `no valida` para cada una.
```text
// entrada
29 2 2024
29 2 2023
31 4 2026
15 13 2026
0 0 0
```
```text
// salida esperada
valida
no valida
no valida
no valida
```

### Ejercicio 12. Leer con validación
Escribe `int leerEntre(int min, int max)` que lea enteros de `cin` hasta que uno esté en $[min,max]$ y lo devuelva (esta función sí usa `cin`; si el número no vale escribe `Fuera de rango`). Úsala para leer una nota del 0 al 10 y mostrarla.
```text
// entrada
12 -1 7
```
```text
// salida esperada
Fuera de rango
Fuera de rango
Nota: 7
```
