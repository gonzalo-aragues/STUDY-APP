---
fuente: genérico - revisar con apuntes
---
# Ejercicios — Condicionales

*Nota:* en los mensajes de los programas evitamos tildes porque algunas consolas (Windows) las muestran mal.

## Básico

### Ejercicio 1. ¿Qué imprime?
```cpp
int x = 7;
if (x > 5) cout << "A";
if (x > 10) cout << "B";
else cout << "C";
cout << endl;
```

### Ejercicio 2. Expresiones lógicas
Con `int x = 3, y = 8;`, ¿es `true` o `false`?

a) `x < y && y < 10`  b) `x > 5 || y == 8`  c) `!(x == 3)`  d) `x % 2 == 0 || y % 2 == 0`  e) `x < y < 2`

### Ejercicio 3. Signo de un número
Lee un entero y escribe `positivo`, `negativo` o `cero`.
```text
// entrada
-4
```
```text
// salida esperada
negativo
```

### Ejercicio 4. Dos errores clásicos
Explica qué hace realmente este código y corrígelo:
```cpp
int n;
cin >> n;
if (n = 0) {
    cout << "Es cero" << endl;
}
if (n > 100);
{
    cout << "Es grande" << endl;
}
```

### Ejercicio 5. El mayor de dos
Lee dos enteros y escribe el mayor, o `iguales` si lo son.
```text
// entrada
12 9
```
```text
// salida esperada
12
```

## Medio

### Ejercicio 6. Año bisiesto
Lee un año y escribe si es bisiesto (múltiplo de 4, salvo múltiplos de 100 que no lo sean de 400).
```text
// entrada
1900
```
```text
// salida esperada
1900 no es bisiesto
```

### Ejercicio 7. De número a calificación
Lee una nota real y escribe `Suspenso` (< 5), `Aprobado` (< 7), `Notable` (< 9) o `Sobresaliente` (≤ 10). Si no está entre 0 y 10, escribe `Nota no valida`.
```text
// entrada
7.5
```
```text
// salida esperada
Notable
```

### Ejercicio 8. Calculadora con `switch`
Lee una operación con el formato `número operador número` (operador `+`, `-`, `*` o `/`) y muestra el resultado. Si el operador no es válido, escribe `Operador no valido`; si se divide entre 0, `Error: division por cero`.
```text
// entrada
8 / 0
```
```text
// salida esperada
Error: division por cero
```

### Ejercicio 9. Ecuación de segundo grado
Lee `a`, `b`, `c` (reales, $a\neq0$) y resuelve $ax^2+bx+c=0$ en los reales: dos soluciones, una doble o `Sin solucion real`.
```text
// entrada
1 -3 2
```
```text
// salida esperada
x1 = 2, x2 = 1
```

## Tipo examen

### Ejercicio 10. Clasificar un triángulo
Lee tres longitudes enteras positivas. Si no forman un triángulo (cada lado debe ser **menor** que la suma de los otros dos), escribe `No es un triangulo`; si lo forman, escribe `Equilatero`, `Isosceles` o `Escaleno`.
```text
// entrada
3 3 5
```
```text
// salida esperada
Isosceles
```

### Ejercicio 11. El día siguiente
Lee una fecha válida `día mes año` y escribe la fecha del día siguiente con el formato `d/m/a`. Ten en cuenta los meses de 30 y 31 días, febrero y los años bisiestos.
```text
// entrada
28 2 2023
```
```text
// salida esperada
1/3/2023
```

### Ejercicio 12. Traza: ¿de quién es el `else`?
¿Qué imprime este fragmento? ¿Y si `y` valiera 3? Reescríbelo con llaves para que se vea claro.
```cpp
int x = 5, y = 10;
if (x > 3)
    if (y < 5)
        cout << "uno";
    else
        cout << "dos";
cout << "tres" << endl;
```
