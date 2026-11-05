---
fuente: genérico - revisar con apuntes
---
# Soluciones — Estructuras algebraicas

### Solución 1
a) **Sí:** restar dos enteros da un entero.

b) **No:** $2-5=-3\notin\N$.

c) **Sí:** si $a=2k+1$ y $b=2m+1$, entonces $ab=4km+2k+2m+1=2(2km+k+m)+1$, que es impar.

d) **No:** $1+1=2$, que es par.

### Solución 2
- **Asociativa: no.** Contraejemplo: $(8-4)-2=2$ pero $8-(4-2)=6$.
- **Conmutativa: no.** $5-3=2$ pero $3-5=-2$.
- **Neutro: no.** Necesitaríamos $e$ con $a-e=a$ **y** $e-a=a$ para todo $a$. La primera da $e=0$, pero entonces $0-a=-a\neq a$ (por ejemplo con $a=1$). No existe.

### Solución 3
Suma en $\Z_5$ (resto de dividir entre 5):

| $+$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| **0** | 0 | 1 | 2 | 3 | 4 |
| **1** | 1 | 2 | 3 | 4 | 0 |
| **2** | 2 | 3 | 4 | 0 | 1 |
| **3** | 3 | 4 | 0 | 1 | 2 |
| **4** | 4 | 0 | 1 | 2 | 3 |

Producto en $\Z_5$:

| $\cdot$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| **0** | 0 | 0 | 0 | 0 | 0 |
| **1** | 0 | 1 | 2 | 3 | 4 |
| **2** | 0 | 2 | 4 | 1 | 3 |
| **3** | 0 | 3 | 1 | 4 | 2 |
| **4** | 0 | 4 | 3 | 2 | 1 |

- Neutro de la suma: $0$. Neutro del producto: $1$.
- Opuestos (buscamos el 0 en cada fila de la suma): $0\leftrightarrow0$, $1\leftrightarrow4$, $2\leftrightarrow3$.

### Solución 4
a) **Sí** (abeliano): asociativa, neutro 0, opuesto $-a$.
b) **No:** $3$ no tiene opuesto en $\N$.
c) **No:** el $0$ no tiene inverso ($0\cdot x=1$ es imposible).
d) **Sí** (abeliano): neutro 1, inverso $\frac1a$, y el producto de dos reales no nulos no es nulo (es interna).
e) **Sí** (abeliano): tabla $1\cdot1=1$, $1\cdot(-1)=-1$, $(-1)(-1)=1$. Interna, neutro 1, cada elemento es su propio inverso.

### Solución 5
- $4+5=9$; $9=6+3$ ⇒ $\mathbf{3}$.
- $4\cdot5=20$; $20=3\cdot6+2$ ⇒ $\mathbf{2}$.
- Opuesto de $2$: el que sumado da 0 (es decir, 6): $\mathbf4$.
- Inverso de $5$: $5\cdot5=25=4\cdot6+1$ ⇒ $\mathbf5$ es su propio inverso.

### Solución 6
1. **Interna:** $a+b+2\in\Z$ ✓.
2. **Asociativa:** $(a*b)*c=(a+b+2)+c+2=a+b+c+4$; $a*(b*c)=a+(b+c+2)+2=a+b+c+4$ ✓.
3. **Neutro:** $a*e=a\iff a+e+2=a\iff e=-2$. Y $(-2)*a=-2+a+2=a$ ✓. **Neutro $e=-2$.**
4. **Simétrico:** $a*a'=-2\iff a+a'+2=-2\iff a'=-4-a\in\Z$ ✓.
5. **Conmutativa:** $a+b+2=b+a+2$ ✓.

**Conclusión:** grupo abeliano, neutro $-2$, simétrico de $a$: $-4-a$. Por ejemplo, el simétrico de $1$ es $-5$: $1*(-5)=1-5+2=-2$ ✓.

### Solución 7
1. **Interna:** si $a,b\neq0$ racionales, $\frac{ab}{2}$ es racional y no nulo ✓.
2. **Asociativa:** $(a*b)*c=\frac{ab}{2}\cdot\frac{c}{2}=\frac{abc}{4}$ y $a*(b*c)=\frac{a}{2}\cdot\frac{bc}{2}=\frac{abc}{4}$ ✓.
3. **Neutro:** $\frac{ae}{2}=a\Rightarrow e=2$ (podemos dividir entre $a\neq0$). ✓
4. **Simétrico:** $\frac{aa'}{2}=2\Rightarrow a'=\frac4a$, que está en $G$ ✓.
5. **Conmutativa:** $\frac{ab}{2}=\frac{ba}{2}$ ✓.

**Resultado:** sí, grupo abeliano con neutro $2$ y simétrico $a'=\frac4a$.

### Solución 8
a) Tienen inverso los coprimos con 8: $1,3,5,7$. Cada uno es su propio inverso:
$1\cdot1=1$, $3\cdot3=9\to1$, $5\cdot5=25\to1$, $7\cdot7=49\to1$.

b) Divisores de cero: $2,4,6$ (los que comparten factor con 8):
$2\cdot4=8\to0$, $4\cdot2=8\to0$ (también $4\cdot4=16\to0$), $6\cdot4=24\to0$.

### Solución 9
Inversos en $\Z_5$ (mirando la tabla del producto del ejercicio 3, buscamos el 1):
$1\cdot1=1$, $2\cdot3=6\to1$, $3\cdot2=1$, $4\cdot4=16\to1$.

Todo elemento no nulo tiene inverso y $\Z_5$ es un anillo conmutativo con unidad ⇒ **es un cuerpo**.

$\Z_6$ no lo es porque $2$ no tiene inverso ($\operatorname{mcd}(2,6)=2$): de hecho $2\cdot3=0$, y un cuerpo no tiene divisores de cero.

### Solución 10
a) Restamos 2 (sumamos su opuesto): $3x=4$. El inverso de 3 en $\Z_7$ es 5 ($3\cdot5=15\to1$). Multiplicamos por 5: $x=4\cdot5=20\to6$.

**Comprobación:** $3\cdot6+2=20\to6$ ✓. **Resultado:** $x=6$.

b) $2x$ en $\Z_6$ solo puede valer $0,2,4,0,2,4$ para $x=0,\dots,5$. Nunca 3. **No tiene solución.** (El 2 no tiene inverso en $\Z_6$.)

### Solución 11
a) **Conmutativa:** $a+b-ab=b+a-ba$ ✓.
**Asociativa:**
$$\begin{aligned}(a*b)*c&=(a+b-ab)+c-(a+b-ab)c\\&=a+b+c-ab-ac-bc+abc,\end{aligned}$$
$$\begin{aligned}a*(b*c)&=a+(b+c-bc)-a(b+c-bc)\\&=a+b+c-ab-ac-bc+abc.\end{aligned}$$
Iguales ✓.

b) **Neutro:** $a+e-ae=a\iff e(1-a)=0$ para todo $a$ ⇒ $e=0$. Comprobación: $a*0=a+0-0=a$ ✓.

c) **Simétrico:** $a+a'-aa'=0\iff a'(1-a)=-a$.
- Si $a\neq1$: $a'=\dfrac{-a}{1-a}=\dfrac{a}{a-1}$.
- Si $a=1$: queda $0=-1$, imposible. **El 1 no tiene simétrico** ⇒ $(\R,*)$ **no es grupo**.

d) En $G=\R\setminus\{1\}$:
- **Interna:** hay que ver que $a*b\neq1$ si $a,b\neq1$. Observa que $1-(a*b)=1-a-b+ab=(1-a)(1-b)\neq0$ ✓.
- Asociativa, conmutativa y neutro $0\in G$: heredadas de a) y b).
- Simétrico $a'=\frac{a}{a-1}$: está en $G$, porque $\frac{a}{a-1}=1$ daría $a=a-1$, imposible ✓.

**Conclusión:** $(\R\setminus\{1\},*)$ es un grupo abeliano.

### Solución 12
a) Supón que $e$ y $f$ son neutros. Como $e$ es neutro, $e*f=f$. Como $f$ es neutro, $e*f=e$. Luego $e=f$: **solo hay uno**.

b) Basta comprobar que $b'*a'$ "deshace" $a*b$, usando la asociativa para mover paréntesis:
$$(a*b)*(b'*a')=a*(b*b')*a'=a*e*a'=a*a'=e,$$
$$(b'*a')*(a*b)=b'*(a'*a)*b=b'*e*b=b'*b=e.$$
Como el simétrico es único, $(a*b)'=b'*a'$. ∎

### Solución 13
a) **Sí es anillo:** $(\mathcal M_2,+)$ es grupo abeliano (neutro la matriz nula, opuesto $-A$), el producto es asociativo y se cumple la distributiva. **Tiene unidad**: la identidad $I$. **No es conmutativo**: por ejemplo $\begin{pmatrix}1&1\\0&0\end{pmatrix}\begin{pmatrix}1&0\\1&0\end{pmatrix}=\begin{pmatrix}2&0\\0&0\end{pmatrix}$ pero al revés da $\begin{pmatrix}1&1\\1&1\end{pmatrix}$.

b) $A=\begin{pmatrix}1&0\\0&0\end{pmatrix}$, $B=\begin{pmatrix}0&0\\0&1\end{pmatrix}$: $AB=\begin{pmatrix}0&0\\0&0\end{pmatrix}$ con $A,B\neq0$ (divisores de cero).

c) **No es cuerpo**, por dos motivos (basta uno): no es conmutativo, y $A$ del apartado b) es no nula pero $\det A=0$, así que no tiene inverso.
