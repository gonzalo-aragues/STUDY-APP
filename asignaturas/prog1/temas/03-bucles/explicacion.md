---
fuente: genérico - revisar con apuntes
---
# Bucles: `while`, `do-while` y `for`

> **En una frase:** un bucle repite un bloque de instrucciones mientras se cumpla una condición; con él, un programa de 10 líneas puede procesar mil datos.

## Lo que necesitas saber antes

- Condiciones `bool` y `if` (tema 2).
- Asignaciones del tipo `suma = suma + x` y `i++` (tema 1).
- **Sumatorio:** $\sum_{i=1}^{n}i=1+2+\dots+n$ es exactamente lo que calcula un bucle con un acumulador.

## La idea (intuición)

Si te piden sumar los números del 1 al 5 escribes `1 + 2 + 3 + 4 + 5`. ¿Y del 1 al un millón? Haces lo mismo que harías a mano con una calculadora: **llevas una suma** y vas añadiendo el siguiente número, **una y otra vez**, hasta llegar al final.

Un bucle tiene siempre tres ingredientes:
1. **Inicialización:** cómo empiezan las variables (`suma = 0`, `i = 1`).
2. **Condición:** mientras sea verdadera, se repite (`i <= n`).
3. **Avance:** algo dentro del bucle tiene que acercarte al final (`i++`). Si no, el bucle es **infinito**.

## `while`: mientras se cumpla

```cpp
int i = 1;            // 1. inicialización
int suma = 0;
while (i <= n) {      // 2. condición (se comprueba ANTES de cada vuelta)
    suma = suma + i;
    i++;              // 3. avance
}
```
Si la condición es falsa desde el principio, el cuerpo **no se ejecuta ninguna vez**.

## `do-while`: al menos una vez

```cpp
int n;
do {
    cout << "Introduce un numero positivo: ";
    cin >> n;
} while (n <= 0);     // la condición se comprueba DESPUÉS; ¡lleva ;!
```
Perfecto para **validar la entrada**: hay que leer al menos una vez antes de saber si el dato es correcto.

## `for`: cuando sabes cuántas vueltas

```cpp
for (int i = 1; i <= n; i++) {   // inicialización; condición; avance
    suma += i;
}
```
Es un `while` con los tres ingredientes en una línea. La variable `i` solo existe dentro del `for`.

Formas habituales:
- `for (int i = 0; i < n; i++)` → $n$ vueltas, con `i` de 0 a $n-1$ (la que usarás con vectores).
- `for (int i = 1; i <= n; i++)` → $n$ vueltas, con `i` de 1 a $n$.
- `for (int i = n; i >= 1; i--)` → cuenta atrás.

## Patrones que se repiten siempre

| Patrón | Inicializa | En cada vuelta |
|---|---|---|
| **Contador** (¿cuántos cumplen…?) | `cont = 0` | `if (cond) cont++;` |
| **Acumulador** (suma) | `suma = 0` | `suma += x;` |
| **Producto** (factorial, potencia) | `prod = 1` | `prod *= x;` |
| **Máximo / mínimo** | `max = primer dato` | `if (x > max) max = x;` |
| **Bandera** (¿existe alguno…?) | `encontrado = false` | `if (cond) encontrado = true;` |

**Centinela:** leer datos hasta un valor especial que marca el final (por ejemplo, 0):
```cpp
int x, suma = 0;
cin >> x;
while (x != 0) {      // el 0 es el centinela: no se procesa
    suma += x;
    cin >> x;         // leer el siguiente AL FINAL de la vuelta
}
```

## Bucles anidados

Un bucle dentro de otro: por cada vuelta del exterior, el interior da **todas** sus vueltas. Es lo que se usa para tablas, figuras con asteriscos o recorrer filas y columnas.

```cpp
for (int fila = 1; fila <= 3; fila++) {
    for (int col = 1; col <= fila; col++) {
        cout << "*";
    }
    cout << endl;
}
```
Imprime `*`, `**`, `***` en tres líneas.

## Ejemplos resueltos

### Ejemplo 1 (fácil): tabla de multiplicar

```cpp
int n;
cin >> n;
for (int i = 1; i <= 10; i++) {
    cout << n << " x " << i << " = " << n * i << endl;
}
```

### Ejemplo 2 (típico): contar las cifras de un número

```cpp
int n;
cin >> n;              // supongamos n > 0
int cifras = 0;
while (n > 0) {
    n = n / 10;        // quito la última cifra
    cifras++;
}
```
Traza con $n=472$: $472\to47\to4\to0$: 3 vueltas, `cifras = 3`. (Con $n=0$ daría 0 cifras: si importa, trátalo aparte.)

### Ejemplo 3 (tipo examen): ¿es primo?

Un número $n\ge2$ es primo si no tiene divisores entre 2 y $n-1$. Basta probar hasta $\sqrt n$ (si $n=a\cdot b$, uno de los dos es $\le\sqrt n$).

```cpp
bool primo = (n >= 2);
for (int d = 2; d * d <= n && primo; d++) {
    if (n % d == 0) {
        primo = false;    // encontré un divisor: ya no es primo
    }
}
```
La condición `&& primo` hace que el bucle pare en cuanto se encuentra un divisor (sin necesidad de `break`).

## Errores típicos

- ❌ **Bucle infinito:** olvidar `i++` en un `while`, o una condición que nunca se hace falsa.
- ❌ **Uno de más o de menos** (*off-by-one*): `i <= n` frente a `i < n`. Haz siempre una traza con $n=1$ o $n=2$.
- ❌ Inicializar el acumulador **dentro** del bucle: se reinicia en cada vuelta.
- ❌ `for (int i = 0; i < n; i++);` con `;` al final: el cuerpo queda vacío.
- ❌ Inicializar el máximo a 0: falla si todos los datos son negativos. Inicialízalo con el primer dato.
- ❌ En el centinela, procesar el valor centinela (sumar el 0 no molesta, pero contarlo sí: la media sale mal).
- ❌ Factoriales con `int`: $13!$ ya no cabe. Usa `long long`.

## Para llevar

- Tres ingredientes: inicialización, condición, avance.
- `while`: 0 o más vueltas. `do-while`: 1 o más (validar datos). `for`: número de vueltas conocido.
- Patrones: contador, acumulador (empieza en 0), producto (empieza en 1), máximo (empieza en el primer dato), bandera.
- Centinela: leer antes del bucle y al final de cada vuelta.
- Antes de dar por bueno un bucle, haz una **traza** a mano con un caso pequeño.
