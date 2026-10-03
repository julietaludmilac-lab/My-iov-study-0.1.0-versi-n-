// implementa: {fuente_9}, {funcion_existente_3}, {funcion_existente_4}, {funcion_existente_5}, {funcion_existente_11}, {funcion_existente_12}, {funcion_existente_13}, {funcion_existente_14}, {funcion_existente_15}, {funcion_existente_16}, {funcion_existente_17}, {funcion_existente_18}, {funcion_existente_19}, {funcion_existente_20}

export const syntheticStudent = {
  alias: 'estudiante.demo',
  name: 'Persona Estudiante Sintética',
  matricula: 'A-2026-001',
  carrera: 'Carrera Universitaria Sintética',
  facultad: 'Facultad de Demostración',
};

export const homeData = {
  notifications: ['2 nuevas inscripciones a comisiones.', '1 nueva inscripción a exámenes.', 'Un mensaje sintético.'],
  coursesToday: [
    { time: 'De 08:00 a 10:00', room: 'Aula sintética 1', subject: 'Asignatura Sintética I', commission: 'Comisión A', teacher: 'Docente Sintético A' },
    { time: 'De 14:00 a 16:00', room: 'Aula sintética 2', subject: 'Asignatura Sintética II', commission: 'Comisión B', teacher: 'Docente Sintético B' },
  ],
};

export const currentCommissions = [
  { level: 'Nivel 1', subject: 'Asignatura Sintética I', duration: 'Cuatrimestral', commission: 'Comisión A', teacher: 'Docente Sintético A', room: 'Aula sintética 1' },
  { level: 'Nivel 2', subject: 'Asignatura Sintética II', duration: 'Anual', commission: 'Comisión B', teacher: 'Docente Sintético B', room: 'Aula sintética 2' },
  { level: 'Nivel 2', subject: 'Asignatura Sintética III', duration: 'Cuatrimestral', commission: 'Comisión C', teacher: 'Docente Sintético C', room: 'Aula sintética 3' },
];

export const completedCommissions = [
  { level: 'Nivel 1', subject: 'Asignatura Sintética I', status: 'Regular', date: '15/07/2026' },
  { level: 'Nivel 1', subject: 'Taller Sintético', status: 'Promocionado', date: '20/11/2026' },
];

export const missingCommissions = [
  { level: 'Nivel 2', subject: 'Asignatura Sintética IV', condition: 'Cuatrimestral · Obligatoria' },
  { level: 'Nivel 3', subject: 'Asignatura Sintética V', condition: 'Anual · Optativa' },
];

export const currentExams = [
  { subject: 'Asignatura Sintética II', table: 'Mesa sintética 1', date: '10/12/2026', time: '18:00' },
];

export const takenExams = [
  { level: 'Nivel 1', table: 'Mesa sintética 1', subject: 'Asignatura Sintética I', date: '12/07/2026', grade: '8', condition: 'Regular' },
  { level: 'Nivel 1', table: 'Mesa sintética 2', subject: 'Taller Sintético', date: '22/11/2026', grade: '9', condition: 'Promocionado' },
];

export const missingExams = [
  { level: 'Nivel 2', subject: 'Asignatura Sintética IV', plan: 'Plan sintético 2026', tables: ['Mesa sintética 1 · 10/12/2026 · 18:00', 'Mesa sintética 2 · 17/02/2027 · 18:00'] },
];

export const fees = [
  { month: 'Marzo 2026', status: 'Pagada', date: '05/03/2026', method: 'Medio sintético' },
  { month: 'Abril 2026', status: 'Pagada', date: '05/04/2026', method: 'Medio sintético' },
  { month: 'Mayo 2026', status: 'Pendiente', date: '—', method: '—' },
];

export const notifications = [
  { title: 'Inscripción sintética actualizada', date: '02/10/2026', read: false },
  { title: 'Mensaje sintético', date: '01/10/2026', read: true },
];
