import { describe, expect, it } from 'vitest';
import { priorityTemas } from '../app/src/lib/content.ts';
import type { ContentIndex } from '../shared/types.ts';

const subj = (slug: string, fecha: string) => ({ slug, nombre: slug, abreviatura: slug, semestre: '2026-27-S1', estado: 'activa' as const, color: '#000000', examenes: [{ fecha }], temas: [], numTarjetas: 0, tarjetasUrl: null });

const index: ContentIndex = {
  version: 1,
  generado: '',
  tareas: [],
  asignaturas: [subj('prog1', '2026-12-22'), subj('algebra', '2027-01-09')],
  plan: {
    generado: '2026-11-05',
    desde: '2026-11-05',
    hasta: '2027-01-09',
    semanas: [
      {
        inicio: '2026-11-02',
        fin: '2026-11-08',
        titulo: '',
        dias: [{ fecha: '2026-11-05', items: [{ asignatura: 'prog1', tema: '01-a', tipo: 'aprender', texto: '' }, { asignatura: 'algebra', tema: '01-m', tipo: 'aprender', texto: '' }] }],
      },
    ],
  },
};

describe('priorityTemas', () => {
  it('keeps planned temas of subjects with an upcoming exam', () => {
    expect(priorityTemas(index, '2026-11-05')).toEqual(['prog1/01-a', 'algebra/01-m']);
  });
  it('drops a subject once its exam has passed', () => {
    expect(priorityTemas(index, '2026-12-23')).toEqual(['algebra/01-m']);
  });
});
