---
fuente: genérico - revisar con apuntes
---
# Soluciones — Funciones

### Solución 1
- `x` es por **valor**: es una copia de `a`. Sumarle 10 no cambia `a`.
- `y` es por **referencia**: es la misma variable que `b`. `b` pasa a valer 12.

**Imprime:** `1 12`

### Solución 2
```cpp
#include <iostream>
using namespace std;

int maximo(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}

int main() {
    int x, y, z;
    cin >> x >> y >> z;
    cout << maximo(maximo(x, y), z) << endl;   // el resultado de una llamada es un argumento de otra
    return 0;
}
```
```text
// entrada
4 17 9
```
```text
// salida esperada
17
```

### Solución 3
```cpp
#include <iostream>
using namespace std;

bool esVocal(char c) {
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

int main() {
    char c;
    cin >> c;
    if (esVocal(c)) {
        cout << "vocal" << endl;
    } else {
        cout << "no vocal" << endl;
    }
    return 0;
}
```
```text
// entrada
e
```
```text
// salida esperada
vocal
```
**Error típico:** `c == 'a' || 'e' || ...` compila, pero `'e'` solo ya cuenta como verdadero: siempre daría `true`.

### Solución 4
1. `cuadrado` se usa antes de declararse → falta el **prototipo** `int cuadrado(int n);` antes de `main` (o mover la función arriba).
2. En la llamada no se escribe el tipo: `cuadrado(5)`, no `cuadrado(int 5)`.
3. Falta el `return`: `n * n;` calcula y tira el resultado. Debe ser `return n * n;`.

```cpp
#include <iostream>
using namespace std;

int cuadrado(int n);

int main() {
    int r = cuadrado(5);
    cout << r << endl;
    return 0;
}

int cuadrado(int n) {
    return n * n;
}
```

### Solución 5
```cpp
#include <iostream>
using namespace std;

long long potencia(int base, int exp) {
    long long resultado = 1;
    for (int i = 0; i < exp; i++) {
        resultado *= base;
    }
    return resultado;
}

int main() {
    int b, e;
    cin >> b >> e;
    cout << potencia(b, e) << endl;
    return 0;
}
```
```text
// entrada
3 13
```
```text
// salida esperada
1594323
```
Con `exp = 0` el bucle no da vueltas y devuelve 1, que es correcto ($b^0=1$).

### Solución 6
```cpp
#include <iostream>
using namespace std;

void intercambiar(int& a, int& b) {
    int aux = a;
    a = b;
    b = aux;
}

int main() {
    int x, y;
    cin >> x >> y;
    if (x > y) {
        intercambiar(x, y);
    }
    cout << x << " " << y << endl;
    return 0;
}
```
```text
// entrada
8 3
```
```text
// salida esperada
3 8
```
Sin los `&`, la función intercambiaría sus **copias** y `x`, `y` no cambiarían.

### Solución 7
```cpp
#include <iostream>
using namespace std;

bool esPrimo(int n) {
    if (n < 2) {
        return false;
    }
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return false;      // en cuanto hay un divisor, ya sabemos la respuesta
        }
    }
    return true;
}

int main() {
    int n;
    cin >> n;
    bool primero = true;
    for (int i = 2; i <= n; i++) {
        if (esPrimo(i)) {
            if (!primero) {
                cout << " ";
            }
            cout << i;
            primero = false;
        }
    }
    cout << endl;
    return 0;
}
```
```text
// entrada
30
```
```text
// salida esperada
2 3 5 7 11 13 17 19 23 29
```
Dentro de una función, `return` corta el bucle: es la forma más limpia de "parar al encontrar".

### Solución 8
```cpp
#include <iostream>
using namespace std;

void minMax(int a, int b, int c, int& menor, int& mayor) {
    menor = a;
    mayor = a;
    if (b < menor) menor = b;
    if (c < menor) menor = c;
    if (b > mayor) mayor = b;
    if (c > mayor) mayor = c;
}

int main() {
    int a, b, c, mn, mx;
    cin >> a >> b >> c;
    minMax(a, b, c, mn, mx);
    cout << "Menor: " << mn << endl;
    cout << "Mayor: " << mx << endl;
    return 0;
}
```
```text
// entrada
5 -2 9
```
```text
// salida esperada
Menor: -2
Mayor: 9
```

### Solución 9
- La `x` de `doble` es **otra variable** (parámetro por valor) aunque se llame igual. La `x` de `main` sigue valiendo 3.
- `y = doble(3) = 6`.
- `doble(doble(3)) = doble(6) = 12`.

**Imprime:** `3 6 12`

### Solución 10
```cpp
#include <iostream>
using namespace std;

int invertir(int n) {
    int inv = 0;
    while (n > 0) {
        inv = inv * 10 + n % 10;
        n /= 10;
    }
    return inv;
}

bool esCapicua(int n) {
    return invertir(n) == n;
}

int main() {
    int N;
    cin >> N;
    int cuenta = 0;
    for (int i = 1; i <= N; i++) {
        if (esCapicua(i)) {
            cuenta++;
        }
    }
    cout << cuenta << endl;
    return 0;
}
```
```text
// entrada
200
```
```text
// salida esperada
28
```
Comprobación: 9 de una cifra (1–9), 9 de dos (11, 22, …, 99) y 10 de tres hasta 200 (101, 111, …, 191) ⇒ 28 ✓. Fíjate en que `invertir` modifica su `n`, pero es una copia: el `i` de `main` no cambia.

### Solución 11
Cada función se apoya en la anterior: el problema grande queda en piezas de 3–5 líneas.
```cpp
#include <iostream>
using namespace std;

bool esBisiesto(int a) {
    return (a % 4 == 0 && a % 100 != 0) || a % 400 == 0;
}

int diasDelMes(int m, int a) {
    if (m == 2) {
        return esBisiesto(a) ? 29 : 28;
    } else if (m == 4 || m == 6 || m == 9 || m == 11) {
        return 30;
    }
    return 31;
}

bool fechaValida(int d, int m, int a) {
    if (m < 1 || m > 12) {
        return false;            // comprobar el mes ANTES de pedir sus días
    }
    return d >= 1 && d <= diasDelMes(m, a);
}

int main() {
    int d, m, a;
    cin >> d >> m >> a;
    while (d != 0) {
        if (fechaValida(d, m, a)) {
            cout << "valida" << endl;
        } else {
            cout << "no valida" << endl;
        }
        cin >> d >> m >> a;
    }
    return 0;
}
```
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

### Solución 12
```cpp
#include <iostream>
using namespace std;

int leerEntre(int min, int max) {
    int x;
    cin >> x;
    while (x < min || x > max) {
        cout << "Fuera de rango" << endl;
        cin >> x;
    }
    return x;
}

int main() {
    int nota = leerEntre(0, 10);
    cout << "Nota: " << nota << endl;
    return 0;
}
```
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
Esta función es reutilizable: `leerEntre(1, 12)` para un mes, `leerEntre(1, 5)` para una opción de menú…
