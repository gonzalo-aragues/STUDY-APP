---
fuente: genérico - revisar con apuntes
---
# Soluciones — Tipos y expresiones

### Solución 1
- `17 / 5`: enteros ⇒ división entera ⇒ `3`.
- `17 % 5`: resto ⇒ `2`.
- `17.0 / 5`: hay un `double` ⇒ `3.4`.
- `17 / 5 * 5`: de izquierda a derecha, `(17 / 5) * 5 = 3 * 5 = 15` (¡no 17!).

**Imprime:** `3 2 3.4 15`

### Solución 2
```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << "Suma: " << a + b << endl;
    cout << "Diferencia: " << a - b << endl;
    cout << "Producto: " << a * b << endl;
    return 0;
}
```
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

### Solución 3
- `int x = 3.7;` → compila, pero `x` vale **3** (se trunca). Si querías decimales: `double x = 3.7;`.
- `char c = "a";` → **error**: `"a"` es un texto (string). Un carácter va con comillas simples: `char c = 'a';`.
- `double d = 1 / 3;` → compila, pero `d` vale **0**: `1/3` es división entera. Arreglo: `1.0 / 3`.
- `int y` → **error**: falta el `;`.
- `cout << "y vale " << y;` → `y` no está inicializada: imprime basura. Arreglo: `int y = 0;` (o leerla con `cin`).

### Solución 4
a) `2 + 3 * 4` → primero el producto: `2 + 12 = 14`.
b) `(2 + 3) * 4` → `5 * 4 = 20`.
c) `10 - 4 - 3` → de izquierda a derecha: `(10 - 4) - 3 = 3`.
d) `17 % 5 * 2` → misma prioridad, izquierda a derecha: `2 * 2 = 4`.
e) `20 / 3 / 2` → `(20 / 3) / 2 = 6 / 2 = 3`.

### Solución 5
```cpp
#include <iostream>
using namespace std;

int main() {
    double c;
    cin >> c;
    double f = c * 9 / 5 + 32;   // c es double: toda la cuenta es real
    cout << f << " F" << endl;
    return 0;
}
```
```text
// entrada
36.6
```
```text
// salida esperada
97.88 F
```
**Ojo:** si escribieras `9 / 5 * c`, la parte `9 / 5` se calcula primero **entre enteros** y vale `1`. Pon la variable real delante o usa `9.0 / 5`.

### Solución 6
La idea: una hora son 3600 s. Con `/` sacas cuántas horas enteras caben y con `%` lo que sobra.
```cpp
#include <iostream>
using namespace std;

int main() {
    int total;
    cin >> total;
    int horas = total / 3600;
    int resto = total % 3600;      // segundos que no llegan a una hora
    int minutos = resto / 60;
    int segundos = resto % 60;
    cout << horas << " h " << minutos << " min " << segundos << " s" << endl;
    return 0;
}
```
```text
// entrada
3725
```
```text
// salida esperada
1 h 2 min 5 s
```
Comprobación: $1\cdot3600+2\cdot60+5=3725$ ✓.

### Solución 7
```cpp
#include <iostream>
using namespace std;

int main() {
    int n1, n2, n3;
    cin >> n1 >> n2 >> n3;
    double media = static_cast<double>(n1 + n2 + n3) / 3;
    cout << "Media: " << media << endl;
    return 0;
}
```
```text
// entrada
7 8 8
```
```text
// salida esperada
Media: 7.66667
```
**Por qué funciona:** convertimos la suma a `double` **antes** de dividir. `cout` muestra 6 cifras significativas por defecto.

### Solución 8
Necesitas una variable auxiliar: si haces `a = b; b = a;`, pierdes el valor original de `a`.
```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    int aux = a;   // guardo a
    a = b;
    b = aux;
    cout << "a = " << a << ", b = " << b << endl;
    return 0;
}
```
```text
// entrada
5 9
```
```text
// salida esperada
a = 9, b = 5
```

### Solución 9
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int unidades = n % 10;         // 472 % 10 = 2
    int decenas = (n / 10) % 10;   // 47 % 10 = 7
    int centenas = n / 100;        // 4
    cout << unidades + decenas + centenas << endl;
    return 0;
}
```
```text
// entrada
472
```
```text
// salida esperada
13
```

### Solución 10
| Línea | `a` | `b` | `c` | `d` |
|---|---|---|---|---|
| `int a = 5, b = 2;` | 5 | 2 | – | – |
| `double c = a / b;` | 5 | 2 | 2 | – |
| `double d = static_cast<double>(a) / b;` | 5 | 2 | 2 | 2.5 |
| `a += b * 2;` | 9 | 2 | 2 | 2.5 |
| `b = a % 4;` | 9 | 1 | 2 | 2.5 |

- `c` vale `2` (no 2.5) porque `a / b` es división **entera** y luego se guarda en `double`.
- `a += b * 2` es `a = 5 + 4 = 9`. `9 % 4 = 1`.

**Imprime:** `9 1 2 2.5`

### Solución 11
Algoritmo "voraz": para cada moneda, de mayor a menor, cuántas caben (`/`) y lo que queda (`%`).
```cpp
#include <iostream>
using namespace std;

int main() {
    int precio, pagado;
    cin >> precio >> pagado;
    int cambio = pagado - precio;
    cout << "Cambio: " << cambio << " centimos" << endl;

    cout << "200: " << cambio / 200 << endl;  cambio %= 200;
    cout << "100: " << cambio / 100 << endl;  cambio %= 100;
    cout << "50: " << cambio / 50 << endl;    cambio %= 50;
    cout << "20: " << cambio / 20 << endl;    cambio %= 20;
    cout << "10: " << cambio / 10 << endl;    cambio %= 10;
    cout << "5: " << cambio / 5 << endl;      cambio %= 5;
    cout << "2: " << cambio / 2 << endl;      cambio %= 2;
    cout << "1: " << cambio << endl;
    return 0;
}
```
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
**Errores típicos:** trabajar en euros con `double` (aparecen errores de redondeo como `0.30000000000000004`): por eso se trabaja en céntimos con `int`. Cuando veáis bucles y vectores, esta repetición se escribirá en 4 líneas.

### Solución 12
```cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double x1, y1, x2, y2;
    cin >> x1 >> y1 >> x2 >> y2;
    double dx = x2 - x1;
    double dy = y2 - y1;
    double distancia = sqrt(dx * dx + dy * dy);
    cout << "Distancia: " << distancia << endl;
    return 0;
}
```
```text
// entrada
1 2 4 6
```
```text
// salida esperada
Distancia: 5
```
Comprobación: $dx=3$, $dy=4$, $\sqrt{9+16}=5$ ✓. Para cuadrados es más claro y rápido `dx * dx` que `pow(dx, 2)`.
