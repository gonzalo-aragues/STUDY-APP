---
fuente: genérico - revisar con apuntes
---
# Soluciones — Números complejos

### Solución 1
**Suma:** parte real con parte real, imaginaria con imaginaria:
$$z+w=(3-1)+(-2+5)i=2+3i.$$

**Producto:** multiplicamos como polinomios y cambiamos $i^2=-1$:
$$(3-2i)(-1+5i)=-3+15i+2i-10i^2=-3+17i+10=7+17i.$$

**Resultado:** $z+w=2+3i$, $\;z\cdot w=7+17i$.

### Solución 2
- Conjugado: se cambia el signo de la parte imaginaria: $\overline z=-3-4i$.
- Módulo: $|z|=\sqrt{(-3)^2+4^2}=\sqrt{25}=5$.
- Producto: $(-3+4i)(-3-4i)=9+12i-12i-16i^2=9+16=25$.

**Resultado:** $z\overline z=25=|z|^2$. Siempre se cumple $z\overline z=|z|^2$.

### Solución 3
Las potencias de $i$ se repiten cada 4, así que miramos el resto al dividir entre 4.

- $27=4\cdot6+3$ ⇒ $i^{27}=i^3=-i$.
- $100=4\cdot25+0$ ⇒ $i^{100}=i^0=1$.

**Resultado:** $i^{27}=-i$, $\;i^{100}=1$.

### Solución 4
Multiplicamos numerador y denominador por el conjugado del denominador, $3+4i$:
$$\frac{1+2i}{3-4i}=\frac{(1+2i)(3+4i)}{(3-4i)(3+4i)}=\frac{3+4i+6i+8i^2}{9+16}=\frac{-5+10i}{25}.$$

**Resultado:** $-\dfrac15+\dfrac25 i$.

**Comprobación:** $\left(-\frac15+\frac25i\right)(3-4i)=-\frac35+\frac45i+\frac65i-\frac85i^2=1+2i$. ✓

### Solución 5
a) $1+\sqrt3 i$: módulo $\sqrt{1+3}=2$. Está en el 1.er cuadrante y $\arctan\frac{\sqrt3}{1}=\frac{\pi}{3}$. **Resultado:** $2_{\pi/3}$.

b) $-2i$: módulo $2$. Está en el semieje imaginario negativo, así que el ángulo es $-\frac{\pi}{2}$. **Resultado:** $2_{-\pi/2}$.

c) $-1-i$: módulo $\sqrt{1+1}=\sqrt2$. Está en el **3.er cuadrante**. Ángulo de referencia $\arctan\left|\frac{-1}{-1}\right|=\frac{\pi}{4}$, así que $\theta=-(\pi-\frac{\pi}{4})=-\frac{3\pi}{4}$. **Resultado:** $\sqrt2_{-3\pi/4}$ (equivale a $\sqrt2_{5\pi/4}$ si tu profesor usa $[0,2\pi)$).

### Solución 6
Usamos $r_\theta=r\cos\theta+i\,r\sin\theta$.

a) $\cos\frac{2\pi}{3}=-\frac12$, $\sin\frac{2\pi}{3}=\frac{\sqrt3}{2}$:
$$4_{2\pi/3}=4\left(-\tfrac12+\tfrac{\sqrt3}{2}i\right)=-2+2\sqrt3\,i.$$

b) $\cos\pi=-1$, $\sin\pi=0$: $3_\pi=-3$.

**Resultado:** a) $-2+2\sqrt3 i$; b) $-3$.

### Solución 7
Fórmula de segundo grado con $a=1$, $b=-4$, $c=13$:

$\Delta=b^2-4ac=16-52=-36$, y $\sqrt{-36}=6i$.
$$z=\frac{4\pm6i}{2}=2\pm3i.$$

**Comprobación** con $z=2+3i$: $z^2=4+12i+9i^2=-5+12i$; $-4z=-8-12i$; sumando $13$: $-5+12i-8-12i+13=0$. ✓

**Resultado:** $z=2+3i$ y $z=2-3i$ (conjugadas, porque los coeficientes son reales).

### Solución 8
1. Módulo: $|\sqrt3+i|=\sqrt{3+1}=2$.
2. Argumento: 1.er cuadrante, $\arctan\frac{1}{\sqrt3}=\frac{\pi}{6}$.
3. De Moivre: $(2_{\pi/6})^6=(2^6)_{6\cdot\pi/6}=64_{\pi}$.
4. $64_\pi=64(\cos\pi+i\sin\pi)=-64$.

**Resultado:** $(\sqrt3+i)^6=-64$.

### Solución 9
Despejamos dividiendo: $z=\dfrac{3-i}{2+i}$. Multiplicamos por el conjugado $2-i$:
$$z=\frac{(3-i)(2-i)}{(2+i)(2-i)}=\frac{6-3i-2i+i^2}{4+1}=\frac{5-5i}{5}=1-i.$$

**Comprobación:** $(2+i)(1-i)=2-2i+i-i^2=3-i$. ✓

**Resultado:** $z=1-i$.

### Solución 10
a) $|z-i|$ es la **distancia** entre $z$ y el punto $i=(0,1)$. Pedir que sea $\le1$ es: el **disco** (círculo relleno) de centro $(0,1)$ y radio 1, borde incluido.

Con cuentas: si $z=x+yi$, $|z-i|=\sqrt{x^2+(y-1)^2}\le1 \iff x^2+(y-1)^2\le1$.

b) Si $z=x+yi$, la condición es $x=y$: la **recta** $y=x$ (bisectriz del 1.er y 3.er cuadrante).

### Solución 11
1. En polar: $-16=16_\pi$.
2. Raíces cuartas: módulo $\sqrt[4]{16}=2$, ángulos $\frac{\pi+2k\pi}{4}$ con $k=0,1,2,3$: $\frac{\pi}{4},\frac{3\pi}{4},\frac{5\pi}{4},\frac{7\pi}{4}$.
3. A binómica (usando $\cos\frac{\pi}{4}=\sin\frac{\pi}{4}=\frac{\sqrt2}{2}$, por tanto $2\cdot\frac{\sqrt2}{2}=\sqrt2$):
   - $2_{\pi/4}=\sqrt2+\sqrt2 i$
   - $2_{3\pi/4}=-\sqrt2+\sqrt2 i$
   - $2_{5\pi/4}=-\sqrt2-\sqrt2 i$
   - $2_{7\pi/4}=\sqrt2-\sqrt2 i$

**Figura:** un **cuadrado** inscrito en la circunferencia de radio 2, con un vértice en cada cuadrante.

**Comprobación** de una: $(\sqrt2+\sqrt2i)^2=2+4i+2i^2=4i$, y $(4i)^2=-16$. ✓

### Solución 12
a) Multiplicamos por el conjugado del denominador:
$$z=\frac{(1+i)(1+i)}{(1-i)(1+i)}=\frac{1+2i+i^2}{2}=\frac{2i}{2}=i.$$

b) $z^{2027}=i^{2027}$. Como $2027=4\cdot506+3$, $i^{2027}=i^3=-i$.

**Resultado:** a) $z=i$; b) $z^{2027}=-i$.

### Solución 13
a) $1+i$ en polar: módulo $\sqrt2$, argumento $\frac{\pi}{4}$, es decir $1+i=\sqrt2_{\pi/4}$.

Raíces cúbicas: módulo $\sqrt[3]{\sqrt2}=2^{1/6}$ y ángulos $\dfrac{\frac{\pi}{4}+2k\pi}{3}$:

- $k=0$: $\frac{\pi}{12}$ → $z_0=\left(2^{1/6}\right)_{\pi/12}$
- $k=1$: $\frac{\pi/4+2\pi}{3}=\frac{9\pi}{12}=\frac{3\pi}{4}$ → $z_1=\left(2^{1/6}\right)_{3\pi/4}$
- $k=2$: $\frac{\pi/4+4\pi}{3}=\frac{17\pi}{12}$ → $z_2=\left(2^{1/6}\right)_{17\pi/12}$ (equivale a $-\frac{7\pi}{12}$)

**Comprobación** de $z_1$: $(2^{1/6})^3=2^{1/2}=\sqrt2$ y $3\cdot\frac{3\pi}{4}=\frac{9\pi}{4}=2\pi+\frac{\pi}{4}$. ✓

b) Forman un **triángulo equilátero** inscrito en la circunferencia de radio $2^{1/6}\approx1{,}12$ (los ángulos se separan $\frac{2\pi}{3}$).
