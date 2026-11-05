---
fuente: genérico - revisar con apuntes
---
# Ejercicios — Tipos y expresiones

Escribe los programas en tu ordenador y **pruébalos** con la entrada de ejemplo antes de mirar la solución.

## Básico

### Ejercicio 1. ¿Qué imprime?
Sin ejecutarlo, di qué imprime:
```cpp
cout << 17 / 5 << " " << 17 % 5 << " " << 17.0 / 5 << " " << 17 / 5 * 5 << endl;
```

### Ejercicio 2. Operaciones con dos enteros
Escribe un programa que lea dos enteros y muestre su suma, su diferencia y su producto, uno por línea.
```text
// entrada
7 3
```
```text
// salida esperada
Suma: 10
Diferencia: 4
Producto: 21
```

### Ejercicio 3. Encuentra los errores
Indica qué pasa en cada línea (error de compilación o valor inesperado) y cómo arreglarlo:
```cpp
int x = 3.7;
char c = "a";
double d = 1 / 3;
int y
cout << "y vale " << y;
```

### Ejercicio 4. Prioridad de operadores
¿Cuánto vale cada expresión (todas con enteros)?

a) `2 + 3 * 4`  b) `(2 + 3) * 4`  c) `10 - 4 - 3`  d) `17 % 5 * 2`  e) `20 / 3 / 2`

### Ejercicio 5. Celsius a Fahrenheit
Escribe un programa que lea una temperatura en grados Celsius (puede tener decimales) y muestre su valor en Fahrenheit: $F=\frac95C+32$.
```text
// entrada
36.6
```
```text
// salida esperada
97.88 F
```

## Medio

### Ejercicio 6. Segundos a horas, minutos y segundos
Lee un número de segundos (entero) y muéstralo como horas, minutos y segundos.
```text
// entrada
3725
```
```text
// salida esperada
1 h 2 min 5 s
```

### Ejercicio 7. Media de tres notas
Lee tres notas enteras y muestra su media **con decimales**.
```text
// entrada
7 8 8
```
```text
// salida esperada
Media: 7.66667
```

### Ejercicio 8. Intercambiar dos variables
Lee dos enteros en `a` y `b`, intercambia sus valores (sin escribirlos al revés en el `cout`: los valores de las variables deben cambiar) y muéstralos.
```text
// entrada
5 9
```
```text
// salida esperada
a = 9, b = 5
```

### Ejercicio 9. Suma de las cifras
Lee un entero de tres cifras y muestra la suma de sus cifras.
```text
// entrada
472
```
```text
// salida esperada
13
```

## Tipo examen

### Ejercicio 10. Traza
Haz una tabla con el valor de cada variable tras cada línea y di qué se imprime:
```cpp
int a = 5, b = 2;
double c = a / b;
double d = static_cast<double>(a) / b;
a += b * 2;
b = a % 4;
cout << a << " " << b << " " << c << " " << d << endl;
```

### Ejercicio 11. El cambio en monedas
Una máquina recibe el precio y el dinero entregado, **en céntimos**, y devuelve el cambio usando el menor número de monedas de 200, 100, 50, 20, 10, 5, 2 y 1 céntimos. Muestra cuántas monedas de cada tipo (también las que salen 0).
```text
// entrada
135 500
```
```text
// salida esperada
Cambio: 365 centimos
200: 1
100: 1
50: 1
20: 0
10: 1
5: 1
2: 0
1: 0
```

### Ejercicio 12. Distancia entre dos puntos
Lee las coordenadas de dos puntos del plano $(x_1,y_1)$ y $(x_2,y_2)$ (reales) y muestra la distancia entre ellos, $\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$. Usa `sqrt` de `<cmath>`.
```text
// entrada
1 2 4 6
```
```text
// salida esperada
Distancia: 5
```
