---
fuente: genérico - revisar con apuntes
---
# Soluciones — Condicionales

### Solución 1
- Primer `if`: `7 > 5` es verdadero ⇒ imprime `A`.
- Segundo `if`: `7 > 10` es falso ⇒ se ejecuta su `else` ⇒ imprime `C`.

Son dos `if` **independientes**: el `else` pertenece solo al segundo.

**Imprime:** `AC`

### Solución 2
a) `3 < 8 && 8 < 10` → `true && true` → **true**.
b) `3 > 5 || 8 == 8` → `false || true` → **true**.
c) `!(3 == 3)` → `!true` → **false**.
d) `3 % 2 == 0 || 8 % 2 == 0` → `false || true` → **true**.
e) `x < y < 2` → se evalúa `(3 < 8) < 2` → `true < 2` → `1 < 2` → **true**. ¡Compila pero no significa "x e y menores que 2"! La forma correcta sería `x < 2 && y < 2`.

### Solución 3
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n > 0) {
        cout << "positivo" << endl;
    } else if (n < 0) {
        cout << "negativo" << endl;
    } else {
        cout << "cero" << endl;
    }
    return 0;
}
```
```text
// entrada
-4
```
```text
// salida esperada
negativo
```

### Solución 4
1. `if (n = 0)` **asigna** 0 a `n`; el valor de la expresión es 0, que cuenta como `false`. Nunca imprime "Es cero" y además **pierdes** el número leído. Corrección: `if (n == 0)`.
2. `if (n > 100);` el `;` es una instrucción vacía: el `if` controla "nada" y el bloque `{ ... }` de debajo se ejecuta **siempre**. Corrección: quitar el `;`.

```cpp
if (n == 0) {
    cout << "Es cero" << endl;
}
if (n > 100) {
    cout << "Es grande" << endl;
}
```
Compilar con `-Wall` avisa de los dos errores.

### Solución 5
```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    if (a > b) {
        cout << a << endl;
    } else if (b > a) {
        cout << b << endl;
    } else {
        cout << "iguales" << endl;
    }
    return 0;
}
```
```text
// entrada
12 9
```
```text
// salida esperada
12
```

### Solución 6
```cpp
#include <iostream>
using namespace std;

int main() {
    int anio;
    cin >> anio;
    bool bisiesto = (anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0;
    if (bisiesto) {
        cout << anio << " es bisiesto" << endl;
    } else {
        cout << anio << " no es bisiesto" << endl;
    }
    return 0;
}
```
```text
// entrada
1900
```
```text
// salida esperada
1900 no es bisiesto
```
**Pruébalo también** con 2000 (sí), 2024 (sí) y 2023 (no).

### Solución 7
Primero se descartan los valores no válidos; después la cadena va de menor a mayor, así cada condición puede ser simple.
```cpp
#include <iostream>
using namespace std;

int main() {
    double nota;
    cin >> nota;
    if (nota < 0 || nota > 10) {
        cout << "Nota no valida" << endl;
    } else if (nota < 5) {
        cout << "Suspenso" << endl;
    } else if (nota < 7) {
        cout << "Aprobado" << endl;
    } else if (nota < 9) {
        cout << "Notable" << endl;
    } else {
        cout << "Sobresaliente" << endl;
    }
    return 0;
}
```
```text
// entrada
7.5
```
```text
// salida esperada
Notable
```

### Solución 8
```cpp
#include <iostream>
using namespace std;

int main() {
    double a, b;
    char op;
    cin >> a >> op >> b;   // cin se salta los espacios
    switch (op) {
        case '+':
            cout << a + b << endl;
            break;
        case '-':
            cout << a - b << endl;
            break;
        case '*':
            cout << a * b << endl;
            break;
        case '/':
            if (b == 0) {
                cout << "Error: division por cero" << endl;
            } else {
                cout << a / b << endl;
            }
            break;
        default:
            cout << "Operador no valido" << endl;
    }
    return 0;
}
```
```text
// entrada
8 / 0
```
```text
// salida esperada
Error: division por cero
```
**Por qué funciona:** `op` es un `char`, así que `switch` sirve; los `case` comparan con caracteres entre comillas simples. Comparar `b == 0` con `double` está bien aquí porque el 0 se ha leído exacto.

### Solución 9
```cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double a, b, c;
    cin >> a >> b >> c;
    double disc = b * b - 4 * a * c;
    if (disc > 0) {
        double x1 = (-b + sqrt(disc)) / (2 * a);
        double x2 = (-b - sqrt(disc)) / (2 * a);
        cout << "x1 = " << x1 << ", x2 = " << x2 << endl;
    } else if (disc == 0) {
        cout << "Solucion doble: x = " << -b / (2 * a) << endl;
    } else {
        cout << "Sin solucion real" << endl;
    }
    return 0;
}
```
```text
// entrada
1 -3 2
```
```text
// salida esperada
x1 = 2, x2 = 1
```
**Ojo** con los paréntesis: `-b + sqrt(disc) / 2 * a` está mal; hay que dividir **todo** entre `(2 * a)`.

### Solución 10
```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a <= 0 || b <= 0 || c <= 0 || a >= b + c || b >= a + c || c >= a + b) {
        cout << "No es un triangulo" << endl;
    } else if (a == b && b == c) {
        cout << "Equilatero" << endl;
    } else if (a == b || b == c || a == c) {
        cout << "Isosceles" << endl;
    } else {
        cout << "Escaleno" << endl;
    }
    return 0;
}
```
```text
// entrada
3 3 5
```
```text
// salida esperada
Isosceles
```
**Errores típicos:** comprobar solo una de las tres desigualdades, o escribir `a == b == c` (que compara `(a == b)`, un `bool`, con `c`).

### Solución 11
Idea: calcular cuántos días tiene el mes; si el día es el último, pasar al día 1 del mes siguiente (y si el mes era diciembre, al año siguiente).
```cpp
#include <iostream>
using namespace std;

int main() {
    int d, m, a;
    cin >> d >> m >> a;

    int diasMes;
    if (m == 2) {
        bool bisiesto = (a % 4 == 0 && a % 100 != 0) || a % 400 == 0;
        diasMes = bisiesto ? 29 : 28;
    } else if (m == 4 || m == 6 || m == 9 || m == 11) {
        diasMes = 30;
    } else {
        diasMes = 31;
    }

    if (d < diasMes) {
        d++;
    } else {          // último día del mes
        d = 1;
        if (m < 12) {
            m++;
        } else {      // 31 de diciembre
            m = 1;
            a++;
        }
    }
    cout << d << "/" << m << "/" << a << endl;
    return 0;
}
```
```text
// entrada
28 2 2023
```
```text
// salida esperada
1/3/2023
```
`cond ? x : y` vale `x` si `cond` es verdadera y `y` si no; es un `if` compacto. Prueba también `31 12 2026` → `1/1/2027` y `28 2 2024` → `29/2/2024`.

### Solución 12
Regla: un `else` se empareja con el `if` **más cercano** que no tenga ya `else` (aunque la sangría engañe). Así, el `else` es del `if (y < 5)`.

- Con `y = 10`: `x > 3` verdadero → `y < 5` falso → `else` → imprime `dos`; luego `tres`. **Imprime:** `dostres`.
- Con `y = 3`: imprime `uno` y luego `tres`: `unotres`.

Con llaves (lo que realmente significa):
```cpp
if (x > 3) {
    if (y < 5) {
        cout << "uno";
    } else {
        cout << "dos";
    }
}
cout << "tres" << endl;
```
