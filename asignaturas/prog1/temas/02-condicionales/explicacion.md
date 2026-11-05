---
fuente: genérico - revisar con apuntes
---
# Condicionales: `if`, `else` y `switch`

> **En una frase:** un condicional permite que el programa **decida** qué instrucciones ejecutar según si una condición es verdadera o falsa.

## Lo que necesitas saber antes

- Variables, tipos y expresiones (tema 1). En especial `%` para saber si un número es par.
- **Lógica de "y" / "o"** del día a día: "aprobado si tienes un 5 **y** has entregado las prácticas".

## La idea (intuición)

Hasta ahora los programas hacían siempre lo mismo, de arriba abajo. En la vida real decides: *si llueve, cojo el paraguas; si no, no*. Un condicional es eso: una **bifurcación** en el camino. El programa evalúa una condición (algo que es `true` o `false`) y elige un camino.

## Condiciones: expresiones `bool`

**Comparaciones** (dan `true` o `false`):

| Operador | Significa | Ejemplo |
|---|---|---|
| `==` | igual | `n % 2 == 0` |
| `!=` | distinto | `x != 0` |
| `<`, `<=` | menor, menor o igual | `nota < 5` |
| `>`, `>=` | mayor, mayor o igual | `edad >= 18` |

**Operadores lógicos:**

- `&&` (**y**): verdadero solo si **las dos** lo son. `nota >= 5 && practicas`
- `||` (**o**): verdadero si **al menos una** lo es. `dia == 6 || dia == 7`
- `!` (**no**): invierte. `!(x > 0)` es lo mismo que `x <= 0`.

**Evaluación en cortocircuito:** en `a && b`, si `a` es falso ya no se mira `b`. Útil para evitar errores: `d != 0 && n / d > 2` nunca divide entre 0.

**Intervalos:** en matemáticas escribes $0\le x\le10$; en C++ es `0 <= x && x <= 10`. (¡`0 <= x <= 10` compila pero hace otra cosa!)

## `if` y `else`

```cpp
if (condición) {
    // se ejecuta si la condición es verdadera
} else {
    // se ejecuta si es falsa (el else es opcional)
}
```

**Cadena de casos** con `else if`: se comprueban **en orden** y se ejecuta **solo el primero** que se cumpla.

```cpp
if (nota < 5) {
    cout << "Suspenso";
} else if (nota < 7) {      // aquí ya sabemos que nota >= 5
    cout << "Aprobado";
} else if (nota < 9) {
    cout << "Notable";
} else {
    cout << "Sobresaliente";
}
```

Fíjate: en el segundo caso no hace falta escribir `nota >= 5 && nota < 7`, porque si llegamos ahí es que la primera condición fue falsa.

## `switch`

Cuando comparas **una variable entera o `char`** con varios valores concretos:

```cpp
switch (opcion) {
    case 1:
        cout << "Nuevo";
        break;            // ¡sin break sigue ejecutando el caso siguiente!
    case 2:
    case 3:               // varios valores, mismo código
        cout << "Abrir";
        break;
    default:              // ninguno de los anteriores
        cout << "Opción no válida";
}
```

`switch` no sirve para intervalos (`nota < 5`) ni para `double` o `string`: para eso, `if`.

## Ejemplos resueltos

### Ejemplo 1 (fácil): par o impar

```cpp
int n;
cin >> n;
if (n % 2 == 0) {
    cout << n << " es par" << endl;
} else {
    cout << n << " es impar" << endl;
}
```
Funciona también con negativos: `-4 % 2 == 0`. (Ojo: `-3 % 2 == -1`, así que para impar mejor `n % 2 != 0` que `n % 2 == 1`.)

### Ejemplo 2 (típico): el mayor de tres

```cpp
int a, b, c;
cin >> a >> b >> c;
int mayor = a;          // supongo que es a...
if (b > mayor) {
    mayor = b;          // ...y corrijo si encuentro uno mayor
}
if (c > mayor) {
    mayor = c;
}
cout << mayor << endl;
```
Esta técnica (suponer y corregir) escala a muchos valores y es la que usarás con vectores.

### Ejemplo 3 (tipo examen): año bisiesto

Un año es bisiesto si es múltiplo de 4, **salvo** los múltiplos de 100, que solo lo son si también son múltiplos de 400 (2000 sí, 1900 no, 2024 sí).

```cpp
bool bisiesto = (anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0;
```
Pruébalo con los tres casos de arriba: con 1900, `1900 % 100 != 0` es falso y `1900 % 400 == 0` también ⇒ no bisiesto ✓.

## Errores típicos

- ❌ `if (x = 0)` → **asigna** 0 a `x` y la condición es falsa siempre. ✅ `if (x == 0)`. (Activa los avisos del compilador, `-Wall`, que lo detectan.)
- ❌ `if (x > 0);` con punto y coma: el `if` termina ahí y el bloque de abajo se ejecuta **siempre**.
- ❌ `if (0 <= x <= 10)` → ✅ `if (0 <= x && x <= 10)`.
- ❌ Olvidar `break` en un `case`.
- ❌ Sin llaves, solo la **primera** instrucción depende del `if`. Pon siempre `{ }`.
- ❌ Comparar `double` con `==`: `0.1 + 0.2 == 0.3` es **falso**. Compara con un margen: `fabs(a - b) < 1e-9`.
- ❌ Condiciones mal ordenadas en una cadena `else if` (si pones `nota < 9` antes que `nota < 5`, un 3 sale "Notable").

## Para llevar

- Comparar: `== != < <= > >=`. Combinar: `&&` (y), `||` (o), `!` (no).
- Intervalo: `a <= x && x <= b`.
- `if / else if / else`: se ejecuta **solo el primer** caso verdadero, en orden.
- `switch` para valores concretos de `int`/`char`; no olvides `break` ni `default`.
- `=` asigna, `==` compara. Llaves siempre.
- Bisiesto: `(a % 4 == 0 && a % 100 != 0) || a % 400 == 0`.
