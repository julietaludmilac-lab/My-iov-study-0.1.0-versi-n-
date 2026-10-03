import { useEffect, useState } from 'react';
import { ApiError, getStudentSchedule, type ScheduleEntry } from './api';
import { AgendaToggle } from './studentAgenda';

function RoomLabel({ entry }: { entry: ScheduleEntry }) {
  if (entry.roomStatus === 'SIN_AULA') return <span className="schedule-room missing">Aula no informada</span>;
  if (entry.roomStatus === 'MODIFICADA') return <span className="schedule-room modified"><strong>{entry.room}</strong><small>Antes: {entry.originalRoom}</small></span>;
  return <span className="schedule-room">{entry.room}</span>;
}

export function StudentScheduleTodayCard() {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { getStudentSchedule().then(({ schedule }) => setEntries(schedule.filter((entry) => entry.day === 'Lunes' || entry.day === 'Martes'))).catch((cause: unknown) => setError(cause instanceof ApiError ? cause.message : 'No se pudieron cargar los horarios.')); }, []);
  return <section className="legacy-card student-card schedule-card"><h2><span>▣</span>Dónde curso hoy</h2><div className="card-divider" />{error ? <p className="legacy-error" role="alert" aria-live="assertive">{error}</p> : entries.length ? <div className="schedule-today-list">{entries.map((entry) => <div className="schedule-today-row" key={entry.id}><div><strong>{entry.time} · {entry.subject}</strong><p>{entry.commission} · {entry.day}</p></div><RoomLabel entry={entry} /></div>)}</div> : <p className="empty-text">No hay horarios cargados para mostrar.</p>}</section>;
}

export function StudentSchedulePage() {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { getStudentSchedule().then(({ schedule }) => setEntries(schedule)).catch((cause: unknown) => setError(cause instanceof ApiError ? cause.message : 'No se pudieron cargar los horarios.')); }, []);
  return <div className="student-schedule-page"><div className="student-notices-intro"><div><span className="admin-kicker">INFORMACIÓN OFICIAL VIGENTE</span><p>Horarios, comisiones y aulas consolidados.</p></div><span className="notice-count">{entries.length} actividades</span></div>{error && <div className="legacy-error" role="alert" aria-live="assertive">{error}</div>}{!error && !entries.length ? <section className="legacy-card student-card"><p className="empty-text">No hay horarios cargados para mostrar.</p></section> : <section className="legacy-card student-card"><h2><span>▣</span>Horarios y aulas</h2><div className="card-divider" /><div className="schedule-table">{entries.map((entry) => <article className="schedule-entry" key={entry.id}><div className="schedule-entry-main"><strong>{entry.subject}</strong><span>{entry.day} · {entry.time}</span><span>{entry.commission}</span></div><RoomLabel entry={entry} />{entry.modificationNote && <p className="schedule-change">↻ {entry.modificationNote}</p>}<small className="schedule-source">Fuente: {entry.source}</small><AgendaToggle kind="HORARIO" sourceId={entry.id} /></article>)}</div></section>}</div>;
}

export function scheduleForCommission(commission: string): ScheduleEntry | undefined {
  const fallback: Record<string, ScheduleEntry> = {
    'Comisión A': { id: 'schedule-1', subject: 'Asignatura Sintética I', day: 'Lunes', time: '08:00 a 10:00', commission, room: 'Aula sintética 1', roomStatus: 'OFICIAL', originalRoom: 'Aula sintética 1', modificationNote: '', source: 'Horario académico sintético', synthetic: true },
    'Comisión B': { id: 'schedule-2', subject: 'Asignatura Sintética II', day: 'Martes', time: '14:00 a 16:00', commission, room: 'Aula sintética 4', roomStatus: 'MODIFICADA', originalRoom: 'Aula sintética 2', modificationNote: 'Aula actualizada oficialmente por Bedelía.', source: 'Modificación oficial sintética', synthetic: true },
    'Comisión C': { id: 'schedule-3', subject: 'Asignatura Sintética III', day: 'Miércoles', time: '18:00 a 20:00', commission, room: '', roomStatus: 'SIN_AULA', originalRoom: '', modificationNote: '', source: 'Horario académico sintético', synthetic: true },
  };
  return fallback[commission];
}
