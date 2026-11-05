// Shared UI fragments.
import { h, svg, type Child } from './dom.ts';
import { ICONS } from './icons.ts';

export function header(title: string, opts: { back?: string; subtitle?: string; actions?: Child } = {}): HTMLElement {
  return h(
    'header',
    { class: 'screen-head' },
    opts.back ? h('a', { class: 'icon-btn back', href: opts.back, 'aria-label': 'Volver' }, svg(ICONS.back)) : null,
    h('div', { class: 'screen-titles' }, h('h1', null, title), opts.subtitle ? h('p', { class: 'subtitle' }, opts.subtitle) : null),
    opts.actions ? h('div', { class: 'screen-actions' }, opts.actions) : null,
  );
}

export function dot(color: string): HTMLElement {
  return h('span', { class: 'dot', style: `--c:${color}`, 'aria-hidden': 'true' });
}

export function empty(title: string, text: string, ...actions: Child[]): HTMLElement {
  return h('div', { class: 'empty' }, h('p', { class: 'empty-title' }, title), h('p', { class: 'muted' }, text), actions.length ? h('div', { class: 'row gap center' }, actions) : null);
}

export function toast(msg: string): void {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 2600);
}

export function genericBanner(fuente: string | null): HTMLElement | null {
  if (!fuente || !/^gen[eé]rico/i.test(fuente)) return null;
  return h('p', { class: 'banner' }, svg(ICONS.info), h('span', null, 'Material genérico: ', h('strong', null, 'revísalo con tus apuntes'), ' (puede no seguir la notación de tu profesor).'));
}

export function countdownLabel(days: number): string {
  if (days === 0) return '¡Hoy!';
  if (days === 1) return 'Mañana';
  return `${days} días`;
}
