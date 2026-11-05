---
fuente: genérico - revisar con apuntes
---
# Vectores

> **En una frase:** un vector guarda **muchos datos del mismo tipo bajo un solo nombre**, numerados por posición (`v[0]`, `v[1]`, …), para poder recorrerlos con un bucle.

## Lo que necesitas saber antes

- Bucles `for` (tema 3), sobre todo `for (int i = 0; i < n; i++)`.
- Funciones y paso por referencia (tema 4).
- **Vectores en matemáticas:** $(3,-1,4)$ es una lista ordenada; la componente 2 es $-1$. En C++ se empieza a contar en **0**.

## La idea (intuición)

Si quieres guardar las notas de 5 alumnos, podrías declarar `nota1`, `nota2`, … `nota5`. ¿Y si son 200? Imposible. Un vector es una **fila de cajas numeradas** con un único nombre: `notas[0]`, `notas[1]`, …, `notas[199]`. Como el número de la caja puede ser una **variable**, un bucle recorre todas con tres líneas.

```
índice:   0     1     2     3     4
        +-----+-----+-----+-----+-----+
notas:  | 7.5 | 4.0 | 9.0 | 6.5 | 5.0 |
        +-----+-----+-----+-----+-----+
```

## `vector` de la biblioteca estándar

```cpp
#include <vector>
using namespace std;

vector<int> v(5);          // 5 enteros, todos a 0
vector<double> notas(3, 5.0); // 3 doubles, todos a 5.0
vector<int> w = {4, 8, 15}; // con valores concretos
vector<int> vacio;          // sin elementos
```

- **Acceso:** `v[i]` es el elemento de la posición `i`, de `0` a `v.size() - 1`.
- **Tamaño:** `v.size()`.
- **Añadir al final:** `v.push_back(42);` (el vector crece).
- **Recorrer:**
```cpp
for (int i = 0; i < v.size(); i++) {   // con índice: sabes la posición
    cout << v[i] << " ";
}
for (int x : v) {                       // "para cada x de v": solo lectura cómoda
    cout << x << " ";
}
```
(Si el compilador avisa de comparar `int` con `size()`, usa `size_t i` o `int n = v.size();` antes del bucle.)

> **Tablas de tamaño fijo.** Muchos profesores de PROG1 usan tablas "de C": `const int N = 100; int t[N];` y llevan aparte cuántos elementos están ocupados (`int n`). Funcionan igual con `t[i]`, pero no saben su tamaño (no hay `.size()`) y se pasan a funciones como `int t[], int n`. **Mira en tus apuntes cuál usa tu profesor**; los algoritmos son idénticos.

## Vectores y funciones

- Para **leer** un vector sin copiarlo: `const vector<int>& v`.
- Para **modificarlo**: `vector<int>& v`.
- Se puede **devolver** un vector: `vector<int> leerVector(int n)`.

```cpp
double media(const vector<double>& v) {
    double suma = 0;
    for (double x : v) {
        suma += x;
    }
    return suma / v.size();     // ¡cuidado si v está vacío!
}
```

## Algoritmos básicos (los verás en todos los exámenes)

| Problema | Idea |
|---|---|
| Suma / media | acumulador recorriendo todo |
| Máximo y su posición | supón `v[0]`, corrige al encontrar uno mayor; guarda el índice |
| Contar los que cumplen algo | contador |
| **Búsqueda** de un valor | recorrer hasta encontrarlo; devolver la posición o `-1` |
| Invertir | intercambiar `v[i]` con `v[n-1-i]` hasta la mitad |
| **Ordenar** (selección) | para cada posición `i`, busca el mínimo de `v[i..n-1]` e intercámbialo con `v[i]` |

**Búsqueda que para al encontrar:**
```cpp
int buscar(const vector<int>& v, int x) {
    for (int i = 0; i < v.size(); i++) {
        if (v[i] == x) {
            return i;           // primera aparición
        }
    }
    return -1;                  // no está
}
```

## Ejemplos resueltos

### Ejemplo 1 (fácil): leer y mostrar al revés

```cpp
int n;
cin >> n;
vector<int> v(n);
for (int i = 0; i < n; i++) {
    cin >> v[i];
}
for (int i = n - 1; i >= 0; i--) {   // del último (n-1) al primero (0)
    cout << v[i] << " ";
}
```

### Ejemplo 2 (típico): máximo y su posición

```cpp
int posMax = 0;                       // supongo que el mayor es el primero
for (int i = 1; i < v.size(); i++) {
    if (v[i] > v[posMax]) {
        posMax = i;
    }
}
cout << "Maximo " << v[posMax] << " en la posicion " << posMax;
```
Guardar la **posición** en lugar del valor te da las dos cosas.

### Ejemplo 3 (tipo examen): ordenar por selección

```cpp
void ordenar(vector<int>& v) {          // por referencia: lo modificamos
    int n = v.size();
    for (int i = 0; i < n - 1; i++) {
        int posMin = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[posMin]) {
                posMin = j;
            }
        }
        int aux = v[i];                  // intercambiar v[i] y v[posMin]
        v[i] = v[posMin];
        v[posMin] = aux;
    }
}
```
Traza con $(5,2,8,1)$: $i=0$: mínimo 1 ⇒ $(1,2,8,5)$; $i=1$: mínimo 2 (ya está) ⇒ igual; $i=2$: mínimo 5 ⇒ $(1,2,5,8)$.

## Errores típicos

- ❌ `for (int i = 0; i <= v.size(); i++)` → accede a `v[v.size()]`, que **no existe** (comportamiento indefinido: basura o el programa se cae). ✅ `i < v.size()`.
- ❌ Empezar en 1: el primer elemento es `v[0]`.
- ❌ `vector<int> v;` y luego `v[0] = 5;` → el vector está vacío. ✅ `vector<int> v(n);` o `push_back`.
- ❌ Pasar el vector por valor a una función que debe modificarlo (se modifica la copia).
- ❌ Inicializar el máximo a 0 (falla con negativos) o la posición fuera de rango.
- ❌ Dividir entre `v.size()` sin comprobar que no está vacío.
- ❌ Usar `cout << v;` para mostrar un vector: no compila; hay que recorrerlo.

## Para llevar

- `vector<T> v(n);` posiciones `0 … n-1`; `v.size()`; `v.push_back(x)`.
- Recorrido estándar: `for (int i = 0; i < v.size(); i++)`.
- A funciones: `const vector<T>&` para leer, `vector<T>&` para modificar.
- Algoritmos clave: suma, máximo con posición, contar, buscar (posición o −1), invertir, ordenar por selección.
- `i <= v.size()` es el error más típico de todo PROG1.
