import 'katex/dist/katex.min.css';
import './styles.css';
import { registerSW } from 'virtual:pwa-register';
import { loadIndex } from './lib/content.ts';
import { makeCtx, type Ctx, type Screen, type ScreenFn } from './lib/ctx.ts';
import { requestPersistence } from './lib/db.ts';
import { h, svg } from './lib/dom.ts';
import { ICONS } from './lib/icons.ts';
import { href, parseHash } from './lib/router.ts';
import { empty } from './lib/ui.ts';
import { renderAjustes } from './screens/ajustes.ts';
import { renderAsignaturas } from './screens/asignaturas.ts';
import { renderExamenes } from './screens/examenes.ts';
import { renderHoy } from './screens/hoy.ts';
import { renderPlan } from './screens/plan.ts';
import { renderRepasar } from './screens/repasar.ts';
import { renderTareas } from './screens/tareas.ts';

const TABS = [
  { id: 'hoy', label: 'Hoy', icon: ICONS.hoy },
  { id: 'repasar', label: 'Repasar', icon: ICONS.repasar },
  { id: 'asignaturas', label: 'Asignaturas', icon: ICONS.asignaturas },
  { id: 'examenes', label: 'Exámenes', icon: ICONS.examenes },
  { id: 'tareas', label: 'Tareas', icon: ICONS.tareas },
] as const;

const SCREENS: Record<string, ScreenFn> = {
  hoy: renderHoy,
  repasar: renderRepasar,
  asignaturas: renderAsignaturas,
  examenes: renderExamenes,
  tareas: renderTareas,
  ajustes: renderAjustes,
  plan: renderPlan,
};

const view = document.getElementById('view')!;
const tabs = document.getElementById('tabs')!;
let ctx: Ctx | null = null;
let current: Screen | null = null;
let renderSeq = 0;

tabs.append(
  h('div', { class: 'brand' }, h('img', { src: `${import.meta.env.BASE_URL}icon.svg`, alt: '', width: '28', height: '28' }), h('span', null, 'Estudio')),
  ...TABS.map((t) => h('a', { class: 'tab', href: href(t.id), dataset: { tab: t.id } }, svg(t.icon), h('span', { class: 'tab-label' }, t.label))),
  h('a', { class: 'tab tab-settings', href: href('ajustes'), dataset: { tab: 'ajustes' } }, svg(ICONS.ajustes), h('span', { class: 'tab-label' }, 'Ajustes')),
);

async function render(keepScroll = false) {
  const seq = ++renderSeq;
  const route = parseHash(location.hash);
  const name = route.path[0];
  const tabId = name === 'plan' ? 'hoy' : name;
  tabs.querySelectorAll<HTMLAnchorElement>('.tab').forEach((a) => {
    const on = a.dataset.tab === tabId;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  current?.cleanup?.();
  current = null;
  const scrollY = window.scrollY;
  try {
    ctx ??= makeCtx(await loadIndex());
    const fn = SCREENS[name];
    const screen = fn ? await fn(route, ctx) : { node: empty('Página no encontrada', 'Vuelve a Hoy.', h('a', { class: 'btn', href: href('hoy') }, 'Ir a Hoy')) };
    if (seq !== renderSeq) {
      screen.cleanup?.();
      return;
    }
    current = screen;
    view.replaceChildren(screen.node);
    document.title = screen.title ? `${screen.title} · Estudio` : 'Estudio';
    window.scrollTo(0, keepScroll ? scrollY : 0);
  } catch (e) {
    console.error(e);
    if (seq !== renderSeq) return;
    view.replaceChildren(
      empty(
        'No se pudo cargar el contenido',
        `${(e as Error).message}. Si estás sin conexión y es la primera vez que abres la app, conéctate una vez para descargarla.`,
        h('button', { class: 'btn primary', onclick: () => location.reload() }, 'Reintentar'),
      ),
    );
  }
}

window.addEventListener('hashchange', () => void render());
window.addEventListener('app:rerender', () => void render(true));
void render();

// Offline support + automatic updates when a new version is deployed.
if (import.meta.env.PROD) registerSW({ immediate: true });
void requestPersistence();
