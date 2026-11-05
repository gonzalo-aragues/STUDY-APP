// Types shared by the build scripts (scripts/) and the web app (app/).
// Source files (meta.json, tarjetas.json, plan.json, tareas.json) use Spanish keys
// because the student edits them; JSON Schemas live in /schemas.

export type ISODate = string; // YYYY-MM-DD

export interface Examen {
  fecha: ISODate;
  hora?: string;
  tipo?: 'final' | 'parcial' | 'practicas' | 'recuperacion' | 'otro';
  titulo?: string;
  lugar?: string;
  notas?: string;
}

export interface TemaMeta {
  slug: string;
  titulo: string;
  horas?: number;
  fuente?: string;
  estado?: 'pendiente' | 'generado' | 'revisado';
}

export interface Meta {
  slug: string;
  nombre: string;
  abreviatura?: string;
  curso?: number;
  semestre: string;
  estado?: 'activa' | 'archivada';
  color?: string;
  dificultad?: number;
  lenguaje?: string;
  examenes: Examen[];
  temas: TemaMeta[];
  notas?: string;
}

export interface TarjetaFuente {
  id: string;
  tipo: 'concepto' | 'procedimiento';
  anverso: string;
  reverso: string;
  etiquetas?: string[];
}

export interface TarjetasFile {
  asignatura: string;
  tema: string;
  fuente: string;
  tarjetas: TarjetaFuente[];
}

export type TipoItemPlan = 'aprender' | 'practicar' | 'repasar' | 'simulacro' | 'examen' | 'preparar' | 'descanso';

export interface ItemPlan {
  asignatura: string;
  tema?: string;
  tipo: TipoItemPlan;
  texto: string;
  horas?: number;
}

export interface DiaPlan {
  fecha: ISODate;
  horas?: number;
  nota?: string;
  items: ItemPlan[];
}

export interface SemanaPlan {
  inicio: ISODate;
  fin: ISODate;
  titulo: string;
  objetivo?: string;
  dias: DiaPlan[];
}

export interface Plan {
  generado: ISODate;
  desde: ISODate;
  hasta: ISODate;
  horasPorDia?: number;
  notas?: string[];
  semanas: SemanaPlan[];
}

export interface Paso {
  id: string;
  texto: string;
  minutos: number;
  detalle?: string;
  enlace?: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  asignatura?: string;
  tema?: string;
  creada: ISODate;
  fechaLimite?: ISODate;
  archivada?: boolean;
  pasos: Paso[];
}

export interface TareasFile {
  tareas: Tarea[];
}

// ---------- Built output consumed by the app (content/*.json) ----------

export type Nivel = 'basico' | 'medio' | 'examen' | 'otro';

export interface EjercicioIndex {
  numero: number;
  nivel: Nivel;
  titulo: string;
  html: string;
  solucionHtml: string | null;
}

export interface TemaContent {
  asignatura: string;
  tema: string;
  titulo: string;
  fuente: string | null;
  explicacionHtml: string | null;
  ejercicios: EjercicioIndex[];
}

export interface TemaIndex {
  slug: string;
  titulo: string;
  fuente: string | null;
  estado: string;
  tieneExplicacion: boolean;
  numEjercicios: number;
  numTarjetas: number;
  url: string | null; // content/temas/<asig>/<tema>.json
}

export interface AsignaturaIndex {
  slug: string;
  nombre: string;
  abreviatura: string;
  semestre: string;
  estado: 'activa' | 'archivada';
  color: string;
  examenes: Examen[];
  temas: TemaIndex[];
  numTarjetas: number;
  tarjetasUrl: string | null; // content/tarjetas/<asig>.json
}

export interface TarjetaIndex {
  id: string; // "<asignatura>/<tema>/<id>" — stable key for review history
  asignatura: string;
  tema: string;
  tipo: 'concepto' | 'procedimiento';
  anversoHtml: string;
  reversoHtml: string;
}

export interface ContentIndex {
  version: 1;
  generado: string;
  asignaturas: AsignaturaIndex[];
  plan: Plan | null;
  tareas: Tarea[];
}
