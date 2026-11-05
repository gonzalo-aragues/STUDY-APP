---
fuente: genérico - revisar con apuntes
---
# Ejercicios — Vectores

Formato de entrada habitual: primero el número de elementos $n$ y después los $n$ valores.

## Básico

### Ejercicio 1. ¿Qué imprime?
```cpp
vector<int> v = {3, 1, 4, 1, 5};
v[1] = v[0] + v[4];
v.push_back(9);
cout << v.size() << " " << v[1] << " " << v[v.size() - 1] << endl;
```

### Ejercicio 2. Al revés
Lee $n$ enteros en un vector y muéstralos en orden inverso, separados por espacios.
```text
// entrada
5
10 20 30 40 50
```
```text
// salida esperada
50 40 30 20 10
```

### Ejercicio 3. Suma y media
Lee $n$ reales y muestra su suma y su media. Hazlo con dos funciones: `double suma(const vector<double>& v)` y `double media(const vector<double>& v)`.
```text
// entrada
4
2.5 3.5 6 8
```
```text
// salida esperada
Suma: 20
Media: 5
```

### Ejercicio 4. Máximo y posición
Lee $n\ge1$ enteros y muestra el máximo y la posición (empezando en 0) de su **primera** aparición.
```text
// entrada
6
-3 7 2 7 -10 0
```
```text
// salida esperada
Maximo 7 en la posicion 1
```

### Ejercicio 5. Encuentra el error
Este código a veces imprime un número raro al final o el programa se cuelga. ¿Por qué? Corrígelo.
```cpp
vector<int> v(5);
for (int i = 1; i <= 5; i++) {
    v[i] = i * i;
}
for (int i = 0; i <= v.size(); i++) {
    cout << v[i] << " ";
}
```

## Medio

### Ejercicio 6. Buscar
Escribe `int buscar(const vector<int>& v, int x)` que devuelva la posición de la primera aparición de `x` o `-1`. Lee $n$, los $n$ valores y luego el valor a buscar.
```text
// entrada
5
4 8 15 16 23
16
```
```text
// salida esperada
Encontrado en la posicion 3
```

### Ejercicio 7. Contar apariciones
Lee $n$ enteros y un valor `x`, y muestra cuántas veces aparece `x` y cuántos elementos son mayores que `x`.
```text
// entrada
8
3 5 3 9 1 3 7 3
3
```
```text
// salida esperada
Aparece 4 veces
Mayores: 3
```

### Ejercicio 8. Invertir en el propio vector
Escribe `void invertir(vector<int>& v)` que dé la vuelta al vector **sin usar otro vector** (intercambiando extremos). Muestra el resultado.
```text
// entrada
6
1 2 3 4 5 6
```
```text
// salida esperada
6 5 4 3 2 1
```

### Ejercicio 9. Por encima de la media
Lee $n$ notas (reales) y muestra la media y las notas que están **estrictamente** por encima de ella. ¿Por qué aquí sí hace falta guardar los datos en un vector?
```text
// entrada
5
4 6 8 5 7
```
```text
// salida esperada
Media: 6
Por encima: 8 7
```

## Tipo examen

### Ejercicio 10. Ordenar por selección
Escribe `void ordenar(vector<int>& v)` (selección) y `void mostrar(const vector<int>& v)`. Lee $n$ enteros, ordénalos de menor a mayor y muéstralos.
```text
// entrada
7
5 -2 9 0 3 3 1
```
```text
// salida esperada
-2 0 1 3 3 5 9
```

### Ejercicio 11. Histograma de notas
Lee $n$ notas **enteras** del 0 al 10 y muestra, para cada nota que aparezca al menos una vez, cuántas veces aparece con asteriscos. Usa un vector de 11 contadores.
```text
// entrada
8
5 7 5 10 3 7 5 0
```
```text
// salida esperada
0: *
3: *
5: ***
7: **
10: *
```

### Ejercicio 12. Eliminar repetidos
Escribe `vector<int> sinRepetidos(const vector<int>& v)` que devuelva un vector nuevo con los elementos de `v` en el mismo orden pero sin repeticiones (se queda la primera aparición). Puedes usar tu función `buscar` del ejercicio 6.
```text
// entrada
9
4 2 4 7 2 2 9 7 1
```
```text
// salida esperada
4 2 7 9 1
```
