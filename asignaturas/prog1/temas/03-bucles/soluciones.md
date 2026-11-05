---
fuente: genérico - revisar con apuntes
---
# Soluciones — Bucles

### Solución 1
a) `i` toma los valores 0, 3, 6, 9; el siguiente sería 12, que no cumple `i < 10`. **4 vueltas**, imprime `0 3 6 9 `.

b) Traza de `k` (división entera): 20 → 10 → 5 → 2 → 1. Al llegar a 1 la condición `k > 1` es falsa. **4 vueltas**, imprime `4`.

### Solución 2
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int suma = 0;                    // acumulador: empieza en 0
    for (int i = 1; i <= n; i++) {
        suma += i;
    }
    cout << suma << endl;
    return 0;
}
```
```text
// entrada
100
```
```text
// salida esperada
5050
```
Comprobación con la fórmula de Gauss: $\frac{n(n+1)}{2}=\frac{100\cdot101}{2}=5050$ ✓.

### Solución 3
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= 10; i++) {
        cout << n << " x " << i << " = " << n * i << endl;
    }
    return 0;
}
```
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

### Solución 4
Dos opciones: recorrer todos y filtrar con `if (i % 2 == 0)`, o (más eficiente) saltar de 2 en 2. Para no dejar un espacio al final, escribimos el espacio **antes** de cada número salvo el primero.
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 2; i <= n; i += 2) {
        if (i > 2) {
            cout << " ";
        }
        cout << i;
    }
    cout << endl;
    return 0;
}
```
```text
// entrada
10
```
```text
// salida esperada
2 4 6 8 10
```

### Solución 5
Pasamos a positivo y usamos `do-while`, que da al menos una vuelta: así el 0 cuenta como una cifra sin caso especial.
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n < 0) {
        n = -n;
    }
    int cifras = 0;
    do {
        n = n / 10;
        cifras++;
    } while (n > 0);
    cout << cifras << endl;
    return 0;
}
```
```text
// entrada
-4096
```
```text
// salida esperada
4
```

### Solución 6
Patrón centinela: leer **antes** del bucle y **al final** de cada vuelta, para que el 0 nunca se procese.
```cpp
#include <iostream>
using namespace std;

int main() {
    int x;
    int cuenta = 0;
    int suma = 0;
    cin >> x;
    while (x != 0) {
        suma += x;
        cuenta++;
        cin >> x;
    }
    cout << "Leidos: " << cuenta << endl;
    if (cuenta > 0) {
        cout << "Media: " << static_cast<double>(suma) / cuenta << endl;
    }
    return 0;
}
```
```text
// entrada
4 8 15 16 23 42 0
```
```text
// salida esperada
Leidos: 6
Media: 18
```
El `if (cuenta > 0)` evita dividir entre 0 si el primer dato ya es 0.

### Solución 7
$20!\approx2{,}4\cdot10^{18}$ no cabe en `int` (máx. $\approx2{,}1\cdot10^9$): hace falta `long long` (máx. $\approx9{,}2\cdot10^{18}$).
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long fact = 1;              // producto: empieza en 1 (y así 0! = 1)
    for (int i = 2; i <= n; i++) {
        fact *= i;
    }
    cout << fact << endl;
    return 0;
}
```
```text
// entrada
20
```
```text
// salida esperada
2432902008176640000
```

### Solución 8
```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    cout << a << endl;
    return 0;
}
```
```text
// entrada
84 36
```
```text
// salida esperada
12
```
Traza: $(84,36)\to(36,12)\to(12,0)$. MCD $=12$ ✓.

### Solución 9
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int fila = 1; fila <= n; fila++) {
        for (int j = 1; j <= fila; j++) {   // la fila "fila" tiene "fila" asteriscos
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}
```
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

### Solución 10
Para invertir: en cada vuelta saco la última cifra (`% 10`) y la "añado por la derecha" al invertido (`inv * 10 + cifra`). Guardo una copia del original para comparar al final.
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int original = n;
    int inv = 0;
    while (n > 0) {
        int cifra = n % 10;
        inv = inv * 10 + cifra;
        n = n / 10;
    }
    cout << "Invertido: " << inv << endl;
    if (inv == original) {
        cout << "Es capicua" << endl;
    } else {
        cout << "No es capicua" << endl;
    }
    return 0;
}
```
```text
// entrada
12321
```
```text
// salida esperada
Invertido: 12321
Es capicua
```
Traza con 123: inv = 3 → 32 → 321. **Error típico:** comparar con `n` al final (ya vale 0).

### Solución 11
Bucle anidado: el exterior recorre los candidatos; el interior suma sus divisores propios.
```cpp
#include <iostream>
using namespace std;

int main() {
    int N;
    cin >> N;
    bool primero = true;
    for (int n = 2; n <= N; n++) {
        int suma = 0;                    // se reinicia para cada candidato
        for (int d = 1; d < n; d++) {
            if (n % d == 0) {
                suma += d;
            }
        }
        if (suma == n) {
            if (!primero) {
                cout << " ";
            }
            cout << n;
            primero = false;
        }
    }
    cout << endl;
    return 0;
}
```
```text
// entrada
1000
```
```text
// salida esperada
6 28 496
```
**Mejora** (opcional): basta buscar divisores hasta `n / 2`.

### Solución 12
```cpp
#include <iostream>
using namespace std;

int main() {
    double nota;
    int validas = 0;
    int aprobados = 0;
    double maxima = 0;
    cin >> nota;
    while (nota != -1) {
        if (nota < 0 || nota > 10) {
            cout << "Nota ignorada: " << nota << endl;
        } else {
            if (validas == 0 || nota > maxima) {
                maxima = nota;           // la primera válida inicializa el máximo
            }
            validas++;
            if (nota >= 5) {
                aprobados++;
            }
        }
        cin >> nota;
    }
    if (validas == 0) {
        cout << "Sin notas" << endl;
    } else {
        cout << "Validas: " << validas << endl;
        cout << "Maxima: " << maxima << endl;
        cout << "Aprobados: " << 100.0 * aprobados / validas << "%" << endl;
    }
    return 0;
}
```
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
**Por qué funciona:** combina centinela (`-1`), filtro (`if`), contador, máximo inicializado con el primer dato válido y un porcentaje con `100.0` para forzar división real.
