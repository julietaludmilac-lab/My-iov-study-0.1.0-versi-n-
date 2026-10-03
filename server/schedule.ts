// implementa: {funcion_10}, {funcion_25}, {proceso_10}, {criterio_aceptacion_6}, {criterio_aceptacion_7}

export interface ScheduleEntry {
  id: string;
  subject: string;
  day: string;
  time: string;
  commission: string;
  room: string;
  roomStatus: 'OFICIAL' | 'MODIFICADA' | 'SIN_AULA';
  originalRoom: string;
  modificationNote: string;
  source: string;
  synthetic: true;
}

const schedule: ScheduleEntry[] = [
  {
    id: 'schedule-1', subject: 'Asignatura Sintética I', day: 'Lunes', time: '08:00 a 10:00', commission: 'Comisión A', room: 'Aula sintética 1', roomStatus: 'OFICIAL', originalRoom: 'Aula sintética 1', modificationNote: '', source: 'Horario académico sintético', synthetic: true,
  },
  {
    id: 'schedule-2', subject: 'Asignatura Sintética II', day: 'Martes', time: '14:00 a 16:00', commission: 'Comisión B', room: 'Aula sintética 4', roomStatus: 'MODIFICADA', originalRoom: 'Aula sintética 2', modificationNote: 'Aula actualizada oficialmente por Bedelía.', source: 'Modificación oficial sintética', synthetic: true,
  },
  {
    id: 'schedule-3', subject: 'Asignatura Sintética III', day: 'Miércoles', time: '18:00 a 20:00', commission: 'Comisión C', room: '', roomStatus: 'SIN_AULA', originalRoom: '', modificationNote: '', source: 'Horario académico sintético', synthetic: true,
  },
];

export function listStudentSchedule(): ScheduleEntry[] { return schedule.map((entry) => ({ ...entry })); }
export function findScheduleByCommission(commission: string): ScheduleEntry | undefined { return schedule.find((entry) => entry.commission === commission); }
