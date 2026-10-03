// implementa: {funcion_26}, {funcion_27}, {proceso_11}, {criterio_aceptacion_9}, {error_7}

import type { NoticeView } from './notices.js';
import type { ScheduleEntry } from './schedule.js';

export type AgendaKind = 'AVISO' | 'HORARIO';
export interface AgendaItem {
  id: string;
  studentId: string;
  kind: AgendaKind;
  sourceId: string;
  title: string;
  detail: string;
  dateLabel: string;
  fixedAt: string;
  synthetic: true;
}

const agendaByStudent = new Map<string, AgendaItem[]>();
let nextId = 1;

function now(): string { return new Date().toISOString(); }

export function listAgenda(studentId: string): AgendaItem[] {
  return (agendaByStudent.get(studentId) ?? []).map((item) => ({ ...item })).sort((a, b) => b.fixedAt.localeCompare(a.fixedAt));
}

export function addNoticeToAgenda(studentId: string, notice: NoticeView): AgendaItem {
  const current = agendaByStudent.get(studentId) ?? [];
  const existing = current.find((item) => item.kind === 'AVISO' && item.sourceId === notice.id);
  if (existing) return { ...existing };
  const item: AgendaItem = { id: `agenda-${nextId++}`, studentId, kind: 'AVISO', sourceId: notice.id, title: notice.title, detail: notice.category, dateLabel: notice.expirationDate ? `Vence ${notice.expirationDate}` : 'Sin vencimiento', fixedAt: now(), synthetic: true };
  agendaByStudent.set(studentId, [...current, item]);
  return { ...item };
}

export function addScheduleToAgenda(studentId: string, entry: ScheduleEntry): AgendaItem {
  const current = agendaByStudent.get(studentId) ?? [];
  const existing = current.find((item) => item.kind === 'HORARIO' && item.sourceId === entry.id);
  if (existing) return { ...existing };
  const item: AgendaItem = { id: `agenda-${nextId++}`, studentId, kind: 'HORARIO', sourceId: entry.id, title: entry.subject, detail: `${entry.commission} · ${entry.room || 'Aula no informada'}`, dateLabel: `${entry.day} · ${entry.time}`, fixedAt: now(), synthetic: true };
  agendaByStudent.set(studentId, [...current, item]);
  return { ...item };
}

export function removeAgendaItem(studentId: string, id: string): AgendaItem | null {
  const current = agendaByStudent.get(studentId) ?? [];
  const item = current.find((candidate) => candidate.id === id);
  if (!item) return null;
  agendaByStudent.set(studentId, current.filter((candidate) => candidate.id !== id));
  return { ...item };
}
