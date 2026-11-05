import { formatWithYear, toISODate } from '../../../shared/dates.ts';
import { backupFileName, parseBackup } from '../lib/backup.ts';
import type { ScreenFn } from '../lib/ctx.ts';
import { exportBackup, getReviewLog, importBackup, requestPersistence, setSetting } from '../lib/db.ts';
import { h, svg } from '../lib/dom.ts';
import { ICONS } from '../lib/icons.ts';
import { href } from '../lib/router.ts';
import { applyTheme, getTheme, loadSettings, saveSetting, type Theme } from '../lib/settings.ts';
import { header, toast } from '../lib/ui.ts';

export const renderAjustes: ScreenFn = async (_route, ctx) => {
  const settings = await loadSettings();
  const log = await getReviewLog();
  const node = h('div', { class: 'screen ajustes' }, header('Ajustes', { back: href('hoy') }));

  // --- Theme
  const theme = getTheme();
  const themes: [Theme, string][] = [
    ['auto', 'Automático'],
    ['light', 'Claro'],
    ['dark', 'Oscuro'],
  ];
  const seg = h(
    'div',
    { class: 'segmented', role: 'radiogroup', 'aria-label': 'Tema de color' },
    themes.map(([v, label]) =>
      h(
        'button',
        {
          class: v === theme ? 'active' : '',
          role: 'radio',
          'aria-checked': String(v === theme),
          onclick: (e: Event) => {
            applyTheme(v);
            seg.querySelectorAll('button').forEach((b) => {
              b.classList.toggle('active', b === e.currentTarget);
              b.setAttribute('aria-checked', String(b === e.currentTarget));
            });
          },
        },
        label,
      ),
    ),
  );
  node.append(h('section', { class: 'card' }, h('h2', null, 'Apariencia'), seg));

  // --- Review settings
  const newInput = h('input', { type: 'number', min: '0', max: '200', step: '1', value: String(settings.newPerDay), class: 'input', id: 'newPerDay' }) as HTMLInputElement;
  newInput.addEventListener('change', async () => {
    const v = Math.max(0, Math.min(200, Math.round(Number(newInput.value) || 0)));
    newInput.value = String(v);
    await saveSetting('newPerDay', v);
    toast('Guardado');
  });
  const retSel = h(
    'select',
    { class: 'select', id: 'retention' },
    [
      [0.85, '85 % (menos repasos)'],
      [0.9, '90 % (recomendado)'],
      [0.95, '95 % (más repasos)'],
    ].map(([v, l]) => h('option', { value: String(v), selected: v === settings.retention ? true : undefined }, String(l))),
  ) as HTMLSelectElement;
  retSel.addEventListener('change', async () => {
    await saveSetting('retention', Number(retSel.value));
    toast('Guardado');
  });
  const arch = h('input', { type: 'checkbox', id: 'includeArchived', checked: settings.includeArchived ? true : undefined }) as HTMLInputElement;
  arch.addEventListener('change', async () => {
    await saveSetting('includeArchived', arch.checked);
    toast('Guardado');
  });
  node.append(
    h(
      'section',
      { class: 'card form' },
      h('h2', null, 'Repaso'),
      h('label', { class: 'field', for: 'newPerDay' }, h('span', null, 'Tarjetas nuevas por día'), newInput),
      h('label', { class: 'field', for: 'retention' }, h('span', null, 'Objetivo de recuerdo'), retSel),
      h('label', { class: 'field inline', for: 'includeArchived' }, arch, h('span', null, 'Incluir asignaturas archivadas en el repaso')),
      h('p', { class: 'muted small' }, 'El repaso usa el algoritmo FSRS. Antes de cada examen, las tarjetas de esa asignatura se adelantan para que las veas al menos una vez el día anterior.'),
    ),
  );

  // --- Backup
  const last = settings.lastBackup;
  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', class: 'visually-hidden', id: 'importFile' }) as HTMLInputElement;
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files?.[0];
    if (!f) return;
    try {
      const b = parseBackup(await f.text());
      const ok = confirm(`¿Reemplazar todo tu progreso de este dispositivo por la copia del ${formatWithYear(b.exportado.slice(0, 10))}?\n\n${b.cards.length} tarjetas, ${b.reviews.length} repasos, ${b.tasks.length} pasos marcados.\n\nLo que no esté en la copia se perderá.`);
      if (!ok) return;
      await importBackup(b);
      toast('Copia importada');
      dispatchEvent(new Event('app:rerender'));
    } catch (e) {
      alert(`No se pudo importar: ${(e as Error).message}`);
    } finally {
      fileInput.value = '';
    }
  });
  node.append(
    h(
      'section',
      { class: 'card' },
      h('h2', null, 'Copia de seguridad'),
      h('p', { class: 'muted small' }, 'Tu progreso (repasos, tareas marcadas, ejercicios hechos) se guarda solo en este dispositivo. Exporta una copia de vez en cuando y guárdala en tu nube o en el ordenador.'),
      h('p', { class: 'small' }, `${log.length} repasos guardados · última copia: ${last ? formatWithYear(toISODate(new Date(last))) : 'nunca'}`),
      h(
        'div',
        { class: 'row gap wrap' },
        h(
          'button',
          {
            class: 'btn primary',
            onclick: async () => {
              const b = await exportBackup();
              const blob = new Blob([JSON.stringify(b)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = h('a', { href: url, download: backupFileName() });
              document.body.append(a);
              a.click();
              a.remove();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
              await setSetting('lastBackup', Date.now());
              toast('Copia exportada');
            },
          },
          svg(ICONS.download),
          'Exportar copia de seguridad',
        ),
        h('label', { class: 'btn', for: 'importFile' }, svg(ICONS.upload), 'Importar copia de seguridad'),
        fileInput,
      ),
    ),
  );

  // --- About
  const persisted = await (navigator.storage?.persisted?.() ?? Promise.resolve(false)).catch(() => false);
  node.append(
    h(
      'section',
      { class: 'card' },
      h('h2', null, 'Acerca de'),
      h('p', { class: 'small' }, `Contenido generado el ${formatWithYear(ctx.index.generado.slice(0, 10))} · ${ctx.index.asignaturas.length} asignaturas.`),
      h(
        'p',
        { class: 'small' },
        persisted ? 'Almacenamiento persistente activado ✓' : 'El navegador podría borrar los datos si le falta espacio. ',
        persisted
          ? null
          : h(
              'button',
              {
                class: 'btn small ghost',
                onclick: async () => toast((await requestPersistence()) ? 'Almacenamiento persistente activado' : 'El navegador no lo ha permitido (instala la app para mejorarlo)'),
              },
              'Pedir almacenamiento persistente',
            ),
      ),
      h('p', { class: 'muted small' }, 'Esta app no usa ninguna IA ni necesita claves: solo muestra el material del repositorio. Todo funciona sin conexión.'),
    ),
  );
  return { node, title: 'Ajustes' };
};
