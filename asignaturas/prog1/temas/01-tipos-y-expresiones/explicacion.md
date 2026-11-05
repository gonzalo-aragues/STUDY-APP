---
fuente: genérico - revisar con apuntes
---
# Tipos de datos y expresiones en C++

> **En una frase:** un programa guarda datos en **variables**, cada una de un **tipo** (entero, real, carácter…), y calcula con ellas mediante **expresiones**; entender cómo opera cada tipo evita la mitad de los errores de primero.

## Lo que necesitas saber antes

- Nada de programación: empezamos de cero.
- **Matemáticas:** operaciones básicas, división con resto ($17=3\cdot5+2$), prioridad de operaciones (primero productos, luego sumas).
- Tener un compilador: en clase usaréis uno concreto; para probar en casa vale `g++` o cualquier IDE.

## La idea (intuición)

Un ordenador solo sabe hacer cosas muy simples, pero muy rápido. Un **programa** es una lista de instrucciones que se ejecutan **en orden, de arriba abajo**.

Una **variable** es una "caja con nombre" donde guardas un dato. La caja tiene un **tipo**: no es lo mismo una caja para números enteros que una para letras. El tipo decide **qué valores caben** y **cómo se opera** con ellos. Por ejemplo, `7/2` vale `3` con enteros y `3.5` con reales.

## El primer programa

```cpp
#include <iostream>   // para usar cin y cout
using namespace std;   // para escribir cout en vez de std::cout

int main() {           // aquí empieza el programa
    int edad;          // declaro una variable entera
    cout << "¿Cuántos años tienes? ";
    cin >> edad;       // leo un entero del teclado
    cout << "El año que viene tendrás " << edad + 1 << " años." << endl;
    return 0;          // 0 = el programa terminó bien
}
```

- `cout << x` **escribe** en pantalla; `cin >> x` **lee** del teclado y lo guarda en `x`.
- `endl` (o `"\n"`) salta de línea.
- Cada instrucción acaba en `;`. Los bloques van entre `{ }`.
- `//` empieza un comentario: el compilador lo ignora; es para personas.

## Tipos básicos

| Tipo | Guarda | Ejemplos | Detalle |
|---|---|---|---|
| `int` | enteros | `-3`, `0`, `42` | normalmente entre unos $\pm2\,147\,483\,647$ |
| `double` | reales | `3.14`, `-0.5`, `2e3` | **punto**, no coma; precisión limitada |
| `char` | un carácter | `'a'`, `'7'`, `'\n'` | comillas **simples**; por dentro es un número (código ASCII) |
| `bool` | verdad | `true`, `false` | resultado de comparaciones |
| `string` | texto | `"hola"` | comillas **dobles**; necesita `#include <string>` |

**Declarar** es crear la variable: `int n;`. **Inicializar** es darle valor al crearla: `int n = 0;`. Una variable sin inicializar tiene **basura** (cualquier valor): inicializa siempre.

**Constantes:** `const double PI = 3.14159;` — no se puede cambiar después. Por convenio, en MAYÚSCULAS.

## Expresiones y operadores

- **Aritméticos:** `+ - * /` y `%` (resto de la división entera, solo con enteros).
- **División entera:** si los **dos** operandos son `int`, `/` descarta los decimales: `7/2 == 3`, `-7/2 == -3`. Si alguno es `double`, la división es real: `7.0/2 == 3.5`.
- **Resto:** `17 % 5 == 2`. Sirve para saber si un número es par (`n % 2 == 0`) o sacar la última cifra (`n % 10`).
- **Prioridad:** primero `* / %`, luego `+ -`; a igual prioridad, de izquierda a derecha. Usa paréntesis si dudas: `(a + b) / 2`.
- **Asignación:** `x = expresión;` calcula la derecha y la guarda en `x`. ¡No es una ecuación! `x = x + 1;` significa "x pasa a valer lo que valía más 1".
- **Abreviaturas:** `x += 3;` es `x = x + 3;`. `x++;` suma 1. También `-=`, `*=`, `/=`, `%=`, `x--`.

## Conversiones de tipo

- Al guardar un `double` en un `int` se **trunca** (se quitan los decimales): `int n = 3.9;` guarda `3`.
- Mezclar `int` y `double` en una operación convierte el `int` a `double`.
- **Conversión explícita:** `static_cast<double>(a) / b` hace la división real aunque `a` y `b` sean enteros. Es la forma correcta de calcular una media.
- `char` ↔ `int`: `'A'` es 65, `'a'` es 97, `'0'` es 48. Así, `c - '0'` convierte el carácter `'7'` en el número 7.

## Ejemplos resueltos

### Ejemplo 1 (fácil): ¿qué imprime?

```cpp
int a = 7, b = 2;
cout << a / b << " " << a % b << " " << a / 2.0 << endl;
```
- `a / b`: los dos `int` ⇒ división entera ⇒ `3`.
- `a % b`: resto de 7 entre 2 ⇒ `1`.
- `a / 2.0`: `2.0` es `double` ⇒ división real ⇒ `3.5`.

**Imprime:** `3 1 3.5`

### Ejemplo 2 (típico): media de dos enteros

```cpp
#include <iostream>
using namespace std;

int main() {
    int x, y;
    cin >> x >> y;
    double media = static_cast<double>(x + y) / 2;   // división real
    cout << "Media: " << media << endl;
    return 0;
}
```
Si escribieras `double media = (x + y) / 2;`, con 3 y 4 obtendrías `3` y no `3.5`: la división se hace **entre enteros antes** de guardar en `double`.

### Ejemplo 3 (tipo examen): última y primera cifra

Dado un entero de tres cifras `n = 472`:
- Última cifra: `n % 10` ⇒ `2`.
- Cifra central: `(n / 10) % 10` ⇒ `47 % 10` ⇒ `7`.
- Primera cifra: `n / 100` ⇒ `4`.

Este truco (dividir entre 10 para "quitar" la última cifra y `% 10` para "verla") aparece muchísimo en exámenes.

## Errores típicos

- ❌ `double m = (a + b) / 2;` con `a`, `b` enteros. → ✅ `static_cast<double>(a + b) / 2` o `/ 2.0`.
- ❌ `3,5` para un decimal. → ✅ `3.5` (punto).
- ❌ `char c = "a";` → ✅ `'a'` (comillas simples para un carácter).
- ❌ Usar una variable sin inicializar: `int suma; suma = suma + x;`. → ✅ `int suma = 0;`.
- ❌ Olvidar el `;` al final de la línea, o `cin << x` / `cout >> x` (flechas al revés).
- ❌ `%` con `double`: `7.5 % 2` no compila.
- ❌ Desbordamiento: `int` no cabe todo; `100000 * 100000` se sale del rango. Usa `long long` para números muy grandes.

## Para llevar

- Programa = instrucciones en orden dentro de `int main() { ... }`.
- `int`, `double`, `char`, `bool`, `string`; inicializa siempre.
- `int / int` es **división entera**; `%` es el resto.
- `static_cast<double>(x)` para forzar división real.
- `x = x + 1` es asignación, no ecuación. `x += 1`, `x++`.
- `n % 10` última cifra; `n / 10` quita la última cifra.
