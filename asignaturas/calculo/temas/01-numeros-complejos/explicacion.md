---
fuente: genérico - revisar con apuntes
---
# Números complejos

> **En una frase:** los números complejos amplían los reales añadiendo un número $i$ con $i^2=-1$; así **toda** ecuación polinómica tiene solución y los giros en el plano se convierten en simples multiplicaciones.

## Lo que necesitas saber antes

- **Ecuación de segundo grado:** $ax^2+bx+c=0 \Rightarrow x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}$. Si el discriminante $b^2-4ac$ es negativo, en $\R$ no hay solución.
- **Trigonometría básica:** en un triángulo rectángulo con hipotenusa $r$ y ángulo $\theta$, los catetos miden $r\cos\theta$ y $r\sin\theta$. Valores que conviene saber: $\cos 0=1$, $\sin\frac{\pi}{2}=1$, $\cos\frac{\pi}{3}=\frac12$, $\sin\frac{\pi}{3}=\frac{\sqrt3}{2}$, $\cos\frac{\pi}{4}=\sin\frac{\pi}{4}=\frac{\sqrt2}{2}$.
- **Radianes:** $180^\circ=\pi$ rad. Una vuelta entera son $2\pi$.
- **Arcotangente:** $\arctan$ devuelve un ángulo entre $-\frac{\pi}{2}$ y $\frac{\pi}{2}$. Ojo: solo "ve" la mitad derecha del plano (lo usaremos con cuidado).

## La idea (intuición)

En bachillerato, $x^2+1=0$ "no tiene solución". Los matemáticos se preguntaron: ¿y si nos **inventamos** un número cuyo cuadrado sea $-1$ y vemos si las cuentas siguen funcionando? Funcionan perfectamente.

Ese número se llama $i$ (unidad imaginaria). Con él, cualquier número complejo se escribe como $a+bi$: una parte "normal" $a$ y una parte "imaginaria" $b$.

La imagen clave: **un número complejo es un punto del plano**. El real $a$ es la coordenada horizontal y $b$ la vertical. Sumar complejos es sumar vectores; multiplicar complejos es **girar y estirar**. Por eso aparecen en señales, circuitos, gráficos por ordenador…

## Definición formal

Un **número complejo** es una expresión $z=a+bi$ con $a,b\in\R$ y donde $i^2=-1$. El conjunto de todos ellos es $\C$.

- $a=\operatorname{Re}(z)$ es la **parte real**; $b=\operatorname{Im}(z)$ es la **parte imaginaria** (¡es el número real $b$, sin la $i$!).
- Si $b=0$, $z$ es real. Si $a=0$ y $b\neq0$, $z$ es **imaginario puro**.
- Dos complejos son iguales si y solo si coinciden parte real **y** parte imaginaria.

En cristiano: un complejo son dos números reales "pegados"; la $i$ solo sirve para saber cuál es cuál y para recordar que $i\cdot i=-1$.

## Operaciones en forma binómica

La forma $a+bi$ se llama **binómica**. Se opera como con polinomios en $i$, cambiando $i^2$ por $-1$:

- **Suma:** $(a+bi)+(c+di)=(a+c)+(b+d)i$.
- **Producto:** $(a+bi)(c+di)=ac+adi+bci+bd\,i^2=(ac-bd)+(ad+bc)i$.
- **Conjugado:** $\overline{z}=a-bi$ (reflejo respecto al eje horizontal). Propiedad clave: $z\cdot\overline{z}=a^2+b^2$, que es **real** y $\ge 0$.
- **División:** se multiplica arriba y abajo por el conjugado del denominador:
$$
\frac{a+bi}{c+di}=\frac{(a+bi)(c-di)}{(c+di)(c-di)}=\frac{(a+bi)(c-di)}{c^2+d^2}.
$$
Es la misma idea que "racionalizar" en bachillerato.

**Potencias de $i$:** se repiten cada 4. $i^1=i$, $i^2=-1$, $i^3=-i$, $i^4=1$, $i^5=i$… Para $i^n$, divide $n$ entre 4 y quédate con el resto: $i^n=i^{\,\text{resto}}$.

## Módulo y argumento: forma polar

Mirando $z=a+bi$ como un punto del plano:

- **Módulo** $|z|=r=\sqrt{a^2+b^2}$: distancia al origen (Pitágoras).
- **Argumento** $\arg(z)=\theta$: ángulo que forma con el semieje real positivo. Se cumple $\cos\theta=\frac{a}{r}$, $\sin\theta=\frac{b}{r}$.

El **argumento principal** suele tomarse en $(-\pi,\pi]$ (algunos profesores usan $[0,2\pi)$: mira tus apuntes). Para calcularlo:

1. Dibuja el punto $(a,b)$ y mira el **cuadrante**.
2. Calcula el ángulo de referencia $\alpha=\arctan\left|\frac{b}{a}\right|$.
3. Ajusta: 1.er cuadrante $\theta=\alpha$; 2.º $\theta=\pi-\alpha$; 3.º $\theta=-(\pi-\alpha)$; 4.º $\theta=-\alpha$. Si $a=0$: $\theta=\frac{\pi}{2}$ (si $b>0$) o $-\frac{\pi}{2}$ (si $b<0$).

Con módulo y argumento se escribe la **forma trigonométrica** y la **forma polar** (o exponencial):
$$
z=r(\cos\theta+i\sin\theta)=r_\theta=re^{i\theta}.
$$
La notación $e^{i\theta}=\cos\theta+i\sin\theta$ es la **fórmula de Euler**. De momento tómala como una abreviatura cómoda: se comporta como una exponencial ($e^{i\alpha}e^{i\beta}=e^{i(\alpha+\beta)}$).

## Producto, cociente y potencias en polar

Aquí está la magia: en polar, **multiplicar es multiplicar módulos y sumar ángulos**.
$$
r_\alpha\cdot s_\beta=(rs)_{\alpha+\beta},\qquad \frac{r_\alpha}{s_\beta}=\left(\frac{r}{s}\right)_{\alpha-\beta}.
$$

**Fórmula de De Moivre:** elevar a $n$ es multiplicar $n$ veces:
$$
\left(r_\theta\right)^n=\left(r^n\right)_{n\theta}\quad\text{es decir}\quad \big(r(\cos\theta+i\sin\theta)\big)^n=r^n(\cos n\theta+i\sin n\theta).
$$
Calcular $(1+i)^{10}$ en binómica sería horrible; en polar es inmediato (ejemplo 2).

## Raíces $n$-ésimas

Buscamos $w$ con $w^n=z$, siendo $z=r_\theta$. Si $w=s_\varphi$, De Moivre dice $s^n=r$ y $n\varphi=\theta+2k\pi$ (los ángulos que se diferencian en vueltas enteras son el mismo). Por tanto:
$$
\sqrt[n]{z}=\left(\sqrt[n]{r}\right)_{\frac{\theta+2k\pi}{n}},\qquad k=0,1,\dots,n-1.
$$

- Hay **exactamente $n$ raíces** distintas (para $z\neq0$).
- Todas tienen el mismo módulo $\sqrt[n]{r}$: están en una circunferencia.
- Están separadas $\frac{2\pi}{n}$: forman un **polígono regular** de $n$ lados.

## Teorema fundamental del álgebra

Todo polinomio de grado $n\ge1$ con coeficientes complejos tiene **exactamente $n$ raíces** en $\C$ (contando repeticiones). Consecuencia útil: si los coeficientes son **reales** y $z$ es raíz, su conjugado $\overline{z}$ también lo es.

Por ejemplo, $x^2+2x+5=0$: $\Delta=4-20=-16$, $\sqrt{-16}=4i$, así que $x=\frac{-2\pm4i}{2}=-1\pm2i$. Una raíz y su conjugada.

## Ejemplos resueltos

### Ejemplo 1 (fácil): operar en binómica

Sea $z=2+3i$ y $w=1-i$. Calcula $z\cdot w$ y $\frac{z}{w}$.

**Producto:** $(2+3i)(1-i)=2-2i+3i-3i^2=2+i+3=5+i$.

**Cociente:** multiplicamos por el conjugado de $w$, que es $1+i$:
$$
\frac{2+3i}{1-i}=\frac{(2+3i)(1+i)}{(1-i)(1+i)}=\frac{2+2i+3i+3i^2}{1+1}=\frac{-1+5i}{2}=-\frac12+\frac52 i.
$$
**Comprobación:** $\left(-\frac12+\frac52i\right)(1-i)=-\frac12+\frac12 i+\frac52 i-\frac52i^2=2+3i$. ✓

### Ejemplo 2 (típico): potencia con De Moivre

Calcula $(1+i)^{10}$.

1. Módulo: $|1+i|=\sqrt{1+1}=\sqrt2$.
2. Argumento: está en el 1.er cuadrante y $\arctan\frac11=\frac{\pi}{4}$, así que $\theta=\frac{\pi}{4}$.
3. De Moivre: $(1+i)^{10}=\left(\sqrt2\right)^{10}_{\,10\cdot\frac{\pi}{4}}=32_{\frac{5\pi}{2}}$.
4. Simplificamos el ángulo: $\frac{5\pi}{2}=2\pi+\frac{\pi}{2}$, es decir, $\frac{\pi}{2}$.
5. $32_{\pi/2}=32(\cos\frac{\pi}{2}+i\sin\frac{\pi}{2})=32i$.

**Resultado:** $(1+i)^{10}=32i$.

### Ejemplo 3 (tipo examen, con trampa): raíces cúbicas de $-8$

Calcula $\sqrt[3]{-8}$ en $\C$.

**Trampa:** en $\R$ la respuesta es solo $-2$, pero en $\C$ hay **tres** raíces.

1. $-8$ en polar: módulo $8$; está en el semieje real negativo, así que $\theta=\pi$. $-8=8_\pi$.
2. Raíces: módulo $\sqrt[3]8=2$ y ángulos $\frac{\pi+2k\pi}{3}$, $k=0,1,2$:
   - $k=0$: $2_{\pi/3}=2\left(\frac12+\frac{\sqrt3}{2}i\right)=1+\sqrt3\,i$.
   - $k=1$: $2_{\pi}=-2$.
   - $k=2$: $2_{5\pi/3}=2\left(\frac12-\frac{\sqrt3}{2}i\right)=1-\sqrt3\,i$.
3. Forman un triángulo equilátero en la circunferencia de radio 2. Observa que $1\pm\sqrt3 i$ son conjugadas (los coeficientes de $w^3+8=0$ son reales).

## Errores típicos

- ❌ Decir que $\operatorname{Im}(3-4i)=-4i$. → ✅ Es $-4$ (un número real).
- ❌ Calcular el argumento de $-1-i$ como $\arctan\frac{-1}{-1}=\arctan1=\frac{\pi}{4}$. → ✅ El punto está en el 3.er cuadrante: $\theta=-\frac{3\pi}{4}$ (o $\frac{5\pi}{4}$). **Dibuja siempre el punto.**
- ❌ $|a+bi|=a+b$ o $\sqrt{a^2-b^2}$. → ✅ $\sqrt{a^2+b^2}$ (la $i$ no entra en el módulo).
- ❌ Dar una sola raíz $n$-ésima. → ✅ Hay $n$; da todas con $k=0,\dots,n-1$.
- ❌ Dividir "parte real entre parte real": $\frac{2+3i}{1-i}\ne 2-3i$. → ✅ Multiplica por el conjugado.
- ❌ Olvidar que $i^2=-1$ al final de un producto. → ✅ Repasa el signo de $bd$ en $(ac-bd)$.

## Para llevar

- $i^2=-1$; $z=a+bi$ es el punto $(a,b)$.
- Conjugado $\overline z=a-bi$; $z\overline z=|z|^2$; para dividir, multiplica por el conjugado del denominador.
- $|z|=\sqrt{a^2+b^2}$; el argumento depende del **cuadrante**.
- Polar: $z=r_\theta=r(\cos\theta+i\sin\theta)=re^{i\theta}$.
- Producto: módulos se multiplican, ángulos se suman. De Moivre: $(r_\theta)^n=(r^n)_{n\theta}$.
- $n$ raíces $n$-ésimas: $\left(\sqrt[n]r\right)_{(\theta+2k\pi)/n}$, polígono regular.
- Coeficientes reales ⇒ raíces complejas por parejas conjugadas.
