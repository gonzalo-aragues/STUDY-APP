// Shrinks display formulas that are wider than the screen (down to 70 %), so most of them fit on
// a phone without horizontal scrolling. Wider ones keep scrolling inside their own box.
const MIN_SCALE = 0.7;

export function fitMath(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('.katex-display').forEach((box) => {
    const k = box.querySelector<HTMLElement>(':scope > .katex');
    if (!k) return;
    k.style.fontSize = '';
    const avail = box.clientWidth;
    if (!avail) return; // hidden (e.g. inside a closed <details>)
    const need = box.scrollWidth;
    if (need <= avail + 1) return;
    const base = parseFloat(getComputedStyle(k).fontSize) / parseFloat(getComputedStyle(box).fontSize);
    const scale = Math.max(MIN_SCALE, (avail - 2) / need);
    k.style.fontSize = `${(base * scale).toFixed(3)}em`;
  });
}

/** Re-fit when a <details> (e.g. "Ver solución") opens and when the window is resized. */
export function installFitMath(view: HTMLElement): void {
  view.addEventListener('toggle', (e) => fitMath(e.target as HTMLElement), true);
  let t: number | undefined;
  window.addEventListener('resize', () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fitMath(view), 150);
  });
}
