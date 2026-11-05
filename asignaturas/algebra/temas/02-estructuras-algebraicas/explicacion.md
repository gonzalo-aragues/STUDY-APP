---
fuente: genérico - revisar con apuntes
---
# Estructuras algebraicas: grupos, anillos y cuerpos

> **En una frase:** un grupo, un anillo o un cuerpo es un conjunto con una o dos operaciones que cumplen ciertas reglas; en vez de estudiar cada conjunto por separado, estudiamos **las reglas** y lo que se deduce de ellas sirve para todos a la vez.

Este tema asusta por los nombres, pero la idea es muy sencilla. Vamos **despacio**: primero repasamos lo que ya sabes de los números de siempre, y luego simplemente le ponemos nombre.

## Lo que necesitas saber antes

- **Conjuntos de números:** $\N=\{0,1,2,\dots\}$ (en algunos libros empieza en 1), $\Z$ (enteros, con negativos), $\Q$ (fracciones), $\R$ (reales), $\C$ (complejos).
- **Símbolos de lógica** que vamos a leer en voz alta:
  - $\in$: "pertenece a". $3\in\Z$.
  - $\forall$: "para todo". $\exists$: "existe".
  - $G\times G$: el conjunto de **parejas** $(a,b)$ con $a,b\in G$.
- **División entera y resto:** $17=3\cdot5+2$, así que el resto de dividir 17 entre 5 es 2. Se escribe $17\bmod 5=2$.

## Primera idea: ¿qué es una operación?

Una **operación interna** en un conjunto $G$ es una regla que coge **dos** elementos de $G$ y devuelve **otro elemento de $G$**. Se escribe $*:G\times G\to G$, $(a,b)\mapsto a*b$.

La clave está en "otro elemento **de $G$**" (se dice que $G$ es **cerrado** para la operación):

- La suma en $\N$ es interna: sumar dos naturales da un natural.
- La resta en $\N$ **no** es interna: $2-5=-3\notin\N$.
- La división en $\Z$ **no** es interna: $1\div2\notin\Z$ (y además no se puede dividir entre 0).

El símbolo $*$ es genérico: puede ser $+$, $\cdot$, componer funciones, multiplicar matrices… Lo usamos para hablar de **cualquier** operación a la vez.

## Las propiedades, una a una

Piensa siempre en la suma de enteros para entender cada una.

1. **Asociativa:** $(a*b)*c=a*(b*c)$. Da igual dónde pongas los paréntesis. $(2+3)+4=2+(3+4)$. La resta **no** lo es: $(8-4)-2=2$, pero $8-(4-2)=6$.
2. **Elemento neutro:** existe $e\in G$ que "no hace nada": $e*a=a*e=a$ para todo $a$. Para la suma es $0$; para el producto es $1$.
3. **Elemento simétrico (inverso):** para cada $a$ existe $a'$ que lo "deshace": $a*a'=a'*a=e$. Para la suma, el simétrico de $5$ es $-5$ (se llama **opuesto**). Para el producto en $\Q$, el de $5$ es $\frac15$ (se llama **inverso**). El $0$ no tiene inverso para el producto.
4. **Conmutativa:** $a*b=b*a$. El orden da igual. El producto de matrices **no** es conmutativo.

Para comprobar una propiedad hay que verla **para todos** los elementos; para **refutarla** basta **un** contraejemplo.

## Grupo

Un **grupo** $(G,*)$ es un conjunto con una operación interna que es **asociativa**, tiene **neutro** y **todo elemento tiene simétrico**. Si además es **conmutativa**, el grupo es **abeliano** (o conmutativo).

En cristiano: puedes combinar elementos, hay uno que no hace nada y todo se puede deshacer.

| Ejemplo | ¿Grupo? | Por qué |
|---|---|---|
| $(\Z,+)$ | Sí, abeliano | neutro 0, opuesto $-a$ |
| $(\N,+)$ | No | $3$ no tiene opuesto en $\N$ |
| $(\Q,\cdot)$ | No | el $0$ no tiene inverso |
| $(\Q\setminus\{0\},\cdot)$ | Sí, abeliano | neutro 1, inverso $\frac1a$ |
| $(\Z,\cdot)$ | No | $2$ no tiene inverso en $\Z$ |
| Matrices $2\times2$ invertibles con $\cdot$ | Sí, **no** abeliano | $AB\neq BA$ en general |

**Consecuencias que se deducen solo de las reglas** (valen en cualquier grupo):

- El neutro es **único** y el simétrico de cada elemento es **único**.
- Se puede **simplificar**: si $a*b=a*c$, entonces $b=c$ (opera por la izquierda con el simétrico de $a$).
- El simétrico de $a*b$ es $b'*a'$ (como calcetín y zapato: para deshacer, primero te quitas el zapato).

## Los enteros módulo $n$: $\Z_n$

Este ejemplo es **el más importante para un informático** (relojes, `%` en C++, criptografía, códigos de error).

$\Z_n=\{0,1,2,\dots,n-1\}$ con la suma y el producto "**módulo $n$**": operas normal y te quedas con el resto al dividir entre $n$.

Es como un reloj: en $\Z_{12}$, $9+5=14\to2$ (las 9 más 5 horas son las 2). En C++ sería `(9 + 5) % 12`.

Tabla de la suma en $\Z_4$:

| $+$ | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **0** | 0 | 1 | 2 | 3 |
| **1** | 1 | 2 | 3 | 0 |
| **2** | 2 | 3 | 0 | 1 |
| **3** | 3 | 0 | 1 | 2 |

- $(\Z_n,+)$ es siempre un **grupo abeliano**: neutro $0$; opuesto de $a$ es $n-a$ (en $\Z_4$, el opuesto de 1 es 3, porque $1+3=4\to0$).
- Con el **producto** la cosa cambia: en $\Z_4$, $2\cdot2=4\to0$ y $2\cdot1=2$, $2\cdot3=6\to2$: el 2 **no tiene inverso** (nunca da 1).
- **Regla:** $a$ tiene inverso multiplicativo en $\Z_n$ si y solo si $\operatorname{mcd}(a,n)=1$.

## Anillo

Ahora con **dos** operaciones, normalmente llamadas $+$ y $\cdot$. Un **anillo** $(A,+,\cdot)$ cumple:

1. $(A,+)$ es un **grupo abeliano**.
2. El producto es **asociativo**.
3. **Distributiva:** $a\cdot(b+c)=a\cdot b+a\cdot c$ y $(a+b)\cdot c=a\cdot c+b\cdot c$.

Si el producto es conmutativo, **anillo conmutativo**; si tiene neutro para el producto (un "1"), **anillo unitario** o con unidad. (Ojo: hay profesores que incluyen la unidad en la definición de anillo; mira tus apuntes.)

Ejemplos: $(\Z,+,\cdot)$, $(\Z_n,+,\cdot)$, los polinomios $\R[x]$ y las matrices cuadradas $\mathcal M_n(\R)$ (este último **no conmutativo**).

En un anillo puede pasar algo raro: $a\cdot b=0$ con $a\neq0$ y $b\neq0$. Esos elementos se llaman **divisores de cero**. En $\Z_6$: $2\cdot3=6\to0$. En $\Z$ no pasa nunca (es un **dominio de integridad**).

## Cuerpo

Un **cuerpo** $(K,+,\cdot)$ es un anillo conmutativo con unidad ($1\neq0$) en el que **todo elemento distinto de 0 tiene inverso** para el producto.

En cristiano: un cuerpo es un sitio donde puedes **sumar, restar, multiplicar y dividir** (entre lo que no sea 0) sin salirte. Es el ambiente en el que se hace álgebra lineal: los sistemas de ecuaciones del tema 1 se resuelven igual en cualquier cuerpo.

- $\Q$, $\R$ y $\C$ son cuerpos.
- $\Z$ **no** es cuerpo: $2$ no tiene inverso entero.
- $\Z_n$ es cuerpo **si y solo si $n$ es primo**. $\Z_5$ sí (todos los no nulos son coprimos con 5); $\Z_6$ no ($2\cdot3=0$).
- Un cuerpo **nunca** tiene divisores de cero.

## Resumen visual de la jerarquía

$$\text{Grupo }(G,*)\ \subset\ \text{Anillo }(A,+,\cdot)\ \subset\ \text{Cuerpo }(K,+,\cdot)$$

Cada nivel añade reglas: un grupo tiene **una** operación que se puede deshacer; un anillo tiene **dos** (la suma se puede deshacer, el producto no tiene por qué); un cuerpo permite deshacer **también el producto** (salvo con el 0).

## Ejemplos resueltos

### Ejemplo 1 (fácil): ¿es una operación interna?

¿Es interna la operación $a*b=\frac{a+b}{2}$ (la media) en $\Z$? ¿Y en $\Q$?

- En $\Z$: $1*2=\frac32\notin\Z$. **No es interna** (basta un contraejemplo).
- En $\Q$: la media de dos fracciones es una fracción. **Sí es interna.**

### Ejemplo 2 (típico): comprobar que es grupo

En $\Z$ definimos $a*b=a+b-3$. ¿Es $(\Z,*)$ un grupo?

1. **Interna:** $a+b-3$ es entero. ✓
2. **Asociativa:** $(a*b)*c=(a+b-3)+c-3=a+b+c-6$ y $a*(b*c)=a+(b+c-3)-3=a+b+c-6$. Iguales ✓.
3. **Neutro:** buscamos $e$ con $a*e=a$: $a+e-3=a\Rightarrow e=3$. Comprobamos $3*a=3+a-3=a$ ✓. **El neutro es 3, no 0.**
4. **Simétrico:** buscamos $a'$ con $a*a'=3$: $a+a'-3=3\Rightarrow a'=6-a$, que es entero ✓.
5. **Conmutativa:** $a+b-3=b+a-3$ ✓.

**Conclusión:** $(\Z,*)$ es un grupo abeliano con neutro $3$ y simétrico $a'=6-a$.

### Ejemplo 3 (tipo examen): inversos en $\Z_7$ y $\Z_8$

a) Halla el inverso de $3$ en $\Z_7$. b) ¿Tiene inverso $6$ en $\Z_8$?

a) Buscamos $x$ con $3x\equiv1\pmod 7$. Probamos: $3\cdot1=3$, $3\cdot2=6$, $3\cdot3=9\to2$, $3\cdot4=12\to5$, $3\cdot5=15\to1$ ✓. **El inverso es 5.** (Debía existir: 7 es primo, $\Z_7$ es cuerpo.)

b) $\operatorname{mcd}(6,8)=2\neq1$ ⇒ **no tiene inverso**. Comprobación: $6x$ es siempre par y al restar múltiplos de 8 (par) sigue siendo par: nunca da 1. Además $6\cdot4=24\to0$: el 6 es divisor de cero.

## Errores típicos

- ❌ Dar por hecho que el neutro es 0 (o 1). → ✅ **Calcúlalo** resolviendo $a*e=a$ (en el ejemplo 2 era 3).
- ❌ Comprobar una propiedad con un ejemplo y decir "se cumple". → ✅ Para "sí" hay que probarlo en general; un ejemplo solo sirve para decir "no".
- ❌ Olvidar comprobar que la operación es **interna** antes que todo lo demás.
- ❌ "$\Z_n$ es un cuerpo" para cualquier $n$. → ✅ Solo si $n$ es **primo**.
- ❌ Confundir "abeliano" con "grupo": un grupo puede no ser conmutativo (matrices).
- ❌ En un anillo, simplificar $ab=ac\Rightarrow b=c$. → ✅ En $\Z_6$: $2\cdot3=2\cdot0$ pero $3\neq0$.

## Para llevar

- **Operación interna:** dos elementos de $G$ dan otro de $G$.
- **Grupo:** asociativa + neutro + simétricos. **Abeliano:** además conmutativa.
- **Anillo:** $(A,+)$ grupo abeliano, $\cdot$ asociativo, distributiva.
- **Cuerpo:** anillo conmutativo con 1 donde todo $a\neq0$ tiene inverso. $\Q,\R,\C,\Z_p$ ($p$ primo).
- En $\Z_n$: $a$ tiene inverso $\iff\operatorname{mcd}(a,n)=1$. $\Z_n$ cuerpo $\iff n$ primo.
- Para negar una propiedad basta **un** contraejemplo.
