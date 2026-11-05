---
fuente: genérico - revisar con apuntes
---
# Funciones

> **En una frase:** una función es un trozo de programa con nombre que recibe datos (parámetros), hace una tarea concreta y puede devolver un resultado; sirven para **no repetir código** y para **dividir un problema grande en problemas pequeños**.

## Lo que necesitas saber antes

- Tipos, condicionales y bucles (temas 1–3).
- **Funciones en matemáticas:** $f(x)=x^2+1$ recibe un $x$ y devuelve un valor. En C++ es la misma idea: `f(3)` "vale" 10.
- Ya has usado funciones sin saberlo: `sqrt(x)`, `pow(b, e)`, `fabs(x)` de `<cmath>`.

## La idea (intuición)

Imagina una receta de cocina que dice "haz una bechamel" en tres sitios distintos. No copias los pasos tres veces: escribes la receta de la bechamel **una vez** y la **llamas** cuando la necesitas.

Una función es eso: escribes una vez *cómo* se calcula algo (¿es primo?, el máximo de dos números…) y lo **llamas** tantas veces como quieras. Además, `main` queda corto y se lee como un índice: "leer datos, calcular, mostrar".

## Anatomía de una función

```cpp
// tipo que devuelve   nombre    parámetros (entrada)
   int                 maximo   (int a, int b) {
       if (a > b) {
           return a;     // return devuelve el valor y TERMINA la función
       }
       return b;
   }
```

- **Tipo de retorno:** qué devuelve (`int`, `double`, `bool`…) o `void` si no devuelve nada.
- **Parámetros:** variables que reciben los datos de la llamada. Pueden ser cero o más.
- **`return`:** devuelve el valor. Una función no `void` tiene que hacer `return` en todos los caminos.
- **Llamada:** `int m = maximo(3, 8);` — los **argumentos** `3` y `8` se copian en `a` y `b`.

## Dónde se escriben: prototipos

El compilador lee de arriba abajo: una función tiene que estar **declarada antes** de usarse. Dos opciones:

1. Definir las funciones **antes** de `main`.
2. Escribir arriba el **prototipo** (la cabecera terminada en `;`) y la definición después de `main`:

```cpp
bool esPar(int n);          // prototipo

int main() {
    cout << esPar(4);       // OK: ya conoce esPar
}

bool esPar(int n) {         // definición
    return n % 2 == 0;
}
```

## Paso por valor y por referencia

**Por valor** (lo normal): el parámetro es una **copia**. Cambiarlo dentro **no afecta** a la variable original.

**Por referencia** (`&`): el parámetro es **otro nombre para la misma variable**. Cambiarlo dentro **sí la cambia** fuera.

```cpp
void duplicaValor(int x) { x = 2 * x; }        // cambia la copia
void duplicaRef(int& x)  { x = 2 * x; }        // cambia el original

int main() {
    int n = 5;
    duplicaValor(n);   // n sigue valiendo 5
    duplicaRef(n);     // n pasa a valer 10
}
```

¿Cuándo usar referencia?
- Cuando la función tiene que **modificar** la variable (`intercambiar(a, b)`, `leerDatos(...)`).
- Cuando tiene que "devolver" **más de un resultado** (cociente **y** resto).
- Con datos grandes (vectores, `string`) que no quieres copiar: `const vector<int>& v` (referencia que no se puede modificar).

Con referencia, el argumento tiene que ser una **variable**: `duplicaRef(5)` no compila.

## Ámbito de las variables

Una variable existe solo **dentro del bloque `{ }` donde se declara** (variable **local**). Las variables de `main` no se ven desde otras funciones y viceversa, aunque se llamen igual. Los datos entran por parámetros y salen por `return` o por referencia. Evita las variables **globales** (fuera de todas las funciones): hacen el programa difícil de seguir.

## Diseñar con funciones

- Cada función hace **una sola cosa** y su nombre lo dice: `esPrimo`, `sumaCifras`, `leerPositivo`.
- Las funciones que calculan **no** deberían leer de `cin` ni escribir en `cout`: reciben datos y devuelven resultados. Así se pueden reutilizar y probar.
- Primero escribe el `main` con llamadas a funciones que aún no existen ("qué hay que hacer") y luego rellena cada función ("cómo se hace").

## Ejemplos resueltos

### Ejemplo 1 (fácil): función que devuelve `bool`

```cpp
bool esPar(int n) {
    return n % 2 == 0;    // la comparación ya es un bool: no hace falta if
}
```
Uso: `if (esPar(x)) { ... }`.

### Ejemplo 2 (típico): potencia con un bucle

```cpp
// Devuelve base^exp, con exp >= 0
double potencia(double base, int exp) {
    double resultado = 1;
    for (int i = 0; i < exp; i++) {
        resultado *= base;
    }
    return resultado;
}
```
`potencia(2, 10)` devuelve `1024`. El bucle y sus variables quedan "escondidos" dentro: quien la usa no necesita saber cómo funciona.

### Ejemplo 3 (tipo examen): dos resultados por referencia

```cpp
// Calcula el cociente y el resto de a entre b (b != 0)
void divisionEntera(int a, int b, int& cociente, int& resto) {
    cociente = a / b;
    resto = a % b;
}

int main() {
    int c, r;
    divisionEntera(17, 5, c, r);   // c = 3, r = 2
}
```
`a` y `b` son **datos de entrada** (por valor); `cociente` y `resto` son **resultados** (por referencia).

## Errores típicos

- ❌ Usar una función antes de declararla → error "was not declared in this scope". ✅ Prototipo arriba.
- ❌ Olvidar el `return` en algún camino de una función no `void` (devuelve basura). Compila con `-Wall`.
- ❌ Esperar que una función por valor modifique la variable: `intercambiar(int a, int b)` no intercambia nada.
- ❌ Escribir `cout` dentro de una función que debería **devolver** el valor: `int maximo(...) { cout << a; }`.
- ❌ Poner el tipo en la llamada: `maximo(int x, int y)`. → ✅ `maximo(x, y)`.
- ❌ Código después de `return`: nunca se ejecuta.

## Para llevar

- `tipo nombre(parámetros) { ...; return valor; }`; `void` si no devuelve nada.
- Declarar antes de usar (o prototipo).
- Por valor = copia (no cambia el original). Por referencia `&` = la misma variable.
- Más de un resultado ⇒ parámetros por referencia. Datos grandes ⇒ `const tipo&`.
- Una función, una tarea. Las que calculan no usan `cin`/`cout`.
