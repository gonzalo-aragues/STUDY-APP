---
fuente: genérico - revisar con apuntes
---
# Soluciones — Vectores

### Solución 1
- Al principio: `v = {3, 1, 4, 1, 5}`.
- `v[1] = v[0] + v[4] = 3 + 5 = 8` ⇒ `{3, 8, 4, 1, 5}`.
- `push_back(9)` ⇒ `{3, 8, 4, 1, 5, 9}`, tamaño 6.
- `v[v.size() - 1]` es el **último**: `v[5] = 9`.

**Imprime:** `6 8 9`

### Solución 2
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    for (int i = n - 1; i >= 0; i--) {
        cout << v[i];
        if (i > 0) {
            cout << " ";
        }
    }
    cout << endl;
    return 0;
}
```
```text
// entrada
5
10 20 30 40 50
```
```text
// salida esperada
50 40 30 20 10
```

### Solución 3
```cpp
#include <iostream>
#include <vector>
using namespace std;

double suma(const vector<double>& v) {
    double s = 0;
    for (double x : v) {
        s += x;
    }
    return s;
}

double media(const vector<double>& v) {
    return suma(v) / v.size();   // reutilizamos suma; v no está vacío en este programa
}

int main() {
    int n;
    cin >> n;
    vector<double> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    cout << "Suma: " << suma(v) << endl;
    cout << "Media: " << media(v) << endl;
    return 0;
}
```
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
`const vector<double>&` evita copiar el vector y garantiza que la función no lo modifica.

### Solución 4
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    int posMax = 0;
    for (int i = 1; i < n; i++) {
        if (v[i] > v[posMax]) {      // > estricto: se queda la PRIMERA aparición
            posMax = i;
        }
    }
    cout << "Maximo " << v[posMax] << " en la posicion " << posMax << endl;
    return 0;
}
```
```text
// entrada
6
-3 7 2 7 -10 0
```
```text
// salida esperada
Maximo 7 en la posicion 1
```
Con `>=` se quedaría la **última** aparición (posición 3).

### Solución 5
Dos errores de índice (*off-by-one*):

1. El primer bucle va de 1 a 5: escribe en `v[5]`, que no existe (las posiciones válidas son 0–4), y deja `v[0]` sin asignar.
2. El segundo usa `i <= v.size()`: lee `v[5]`, fuera del vector ⇒ basura o fallo.

```cpp
vector<int> v(5);
for (int i = 0; i < 5; i++) {
    v[i] = (i + 1) * (i + 1);    // mismos valores: 1 4 9 16 25
}
for (int i = 0; i < v.size(); i++) {
    cout << v[i] << " ";
}
```
Truco para depurar: `v.at(i)` en lugar de `v[i]` comprueba el índice y avisa con un error claro si te sales.

### Solución 6
```cpp
#include <iostream>
#include <vector>
using namespace std;

int buscar(const vector<int>& v, int x) {
    for (int i = 0; i < (int)v.size(); i++) {
        if (v[i] == x) {
            return i;
        }
    }
    return -1;
}

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    int x;
    cin >> x;
    int pos = buscar(v, x);
    if (pos == -1) {
        cout << "No encontrado" << endl;
    } else {
        cout << "Encontrado en la posicion " << pos << endl;
    }
    return 0;
}
```
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
`(int)v.size()` evita el aviso de comparar un `int` con un tamaño sin signo.

### Solución 7
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    int x;
    cin >> x;
    int iguales = 0;
    int mayores = 0;
    for (int e : v) {
        if (e == x) {
            iguales++;
        } else if (e > x) {
            mayores++;
        }
    }
    cout << "Aparece " << iguales << " veces" << endl;
    cout << "Mayores: " << mayores << endl;
    return 0;
}
```
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

### Solución 8
Intercambiamos `v[i]` con su "pareja" `v[n-1-i]`, **solo hasta la mitad** (si llegas hasta el final, lo vuelves a dejar como estaba).
```cpp
#include <iostream>
#include <vector>
using namespace std;

void invertir(vector<int>& v) {
    int n = v.size();
    for (int i = 0; i < n / 2; i++) {
        int aux = v[i];
        v[i] = v[n - 1 - i];
        v[n - 1 - i] = aux;
    }
}

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    invertir(v);
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << v[i];
    }
    cout << endl;
    return 0;
}
```
```text
// entrada
6
1 2 3 4 5 6
```
```text
// salida esperada
6 5 4 3 2 1
```
Con $n$ impar, el del medio no se mueve (y $n/2$ entero ya lo excluye).

### Solución 9
Hace falta un vector porque hay que recorrer los datos **dos veces**: una para calcular la media y otra para compararlos con ella (y `cin` no se puede "rebobinar").
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<double> notas(n);
    double suma = 0;
    for (int i = 0; i < n; i++) {
        cin >> notas[i];
        suma += notas[i];
    }
    double media = suma / n;
    cout << "Media: " << media << endl;
    cout << "Por encima:";
    for (double x : notas) {
        if (x > media) {
            cout << " " << x;
        }
    }
    cout << endl;
    return 0;
}
```
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

### Solución 10
```cpp
#include <iostream>
#include <vector>
using namespace std;

void ordenar(vector<int>& v) {
    int n = v.size();
    for (int i = 0; i < n - 1; i++) {
        int posMin = i;                     // mínimo de v[i..n-1]
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[posMin]) {
                posMin = j;
            }
        }
        int aux = v[i];
        v[i] = v[posMin];
        v[posMin] = aux;
    }
}

void mostrar(const vector<int>& v) {
    for (int i = 0; i < (int)v.size(); i++) {
        if (i > 0) cout << " ";
        cout << v[i];
    }
    cout << endl;
}

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    ordenar(v);
    mostrar(v);
    return 0;
}
```
```text
// entrada
7
5 -2 9 0 3 3 1
```
```text
// salida esperada
-2 0 1 3 3 5 9
```
**Por qué funciona:** tras la vuelta `i`, las posiciones `0..i` tienen los `i+1` menores ya en orden. Hace del orden de $n^2/2$ comparaciones.

### Solución 11
La nota sirve directamente de **índice**: `cuenta[nota]++`. Es un patrón muy potente.
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> cuenta(11, 0);         // cuenta[k] = veces que aparece la nota k
    for (int i = 0; i < n; i++) {
        int nota;
        cin >> nota;
        if (nota >= 0 && nota <= 10) {  // protegerse de índices fuera de rango
            cuenta[nota]++;
        }
    }
    for (int k = 0; k <= 10; k++) {
        if (cuenta[k] > 0) {
            cout << k << ": ";
            for (int j = 0; j < cuenta[k]; j++) {
                cout << "*";
            }
            cout << endl;
        }
    }
    return 0;
}
```
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

### Solución 12
```cpp
#include <iostream>
#include <vector>
using namespace std;

int buscar(const vector<int>& v, int x) {
    for (int i = 0; i < (int)v.size(); i++) {
        if (v[i] == x) {
            return i;
        }
    }
    return -1;
}

vector<int> sinRepetidos(const vector<int>& v) {
    vector<int> r;                     // empieza vacío
    for (int x : v) {
        if (buscar(r, x) == -1) {      // si aún no lo he guardado...
            r.push_back(x);            // ...lo añado al final
        }
    }
    return r;
}

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    vector<int> r = sinRepetidos(v);
    for (int i = 0; i < (int)r.size(); i++) {
        if (i > 0) cout << " ";
        cout << r[i];
    }
    cout << endl;
    return 0;
}
```
```text
// entrada
9
4 2 4 7 2 2 9 7 1
```
```text
// salida esperada
4 2 7 9 1
```
**Reutilizar** `buscar` hace que `sinRepetidos` tenga 6 líneas y se lea casi como el enunciado.
