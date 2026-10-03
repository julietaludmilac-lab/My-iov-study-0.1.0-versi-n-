// implementa: {funcion_9}, {proceso_6}, {criterio_aceptacion_5}, {entrada_10}, {error_5}

import type { AcademicProfile } from '../contracts/academic.js';
import type { NoticeView } from './notices.js';
import { matchesStudentAudience } from './notices.js';

export type NotificationKind = 'PUBLICACION' | 'ACTUALIZACION';

export interface StudentNotification {
  id: string;
  studentId: string;
  noticeId: string;
  kind: NotificationKind;
  title: string;
  message: string;
  createdAt: string;
  readAt: string;
}

const notifications = new Map<string, StudentNotification>();

function eventKey(studentId: string, noticeId: string, kind: NotificationKind): string {
  return `${studentId}:${noticeId}:${kind}`;
}

function eventDate(notice: NoticeView): string {
  return notice.updatedAt || `${notice.publicationDate}T12:00:00.000Z`;
}

export function recordNoticeEvent(notice: NoticeView, profiles: AcademicProfile[], kind: NotificationKind): void {
  for (const profile of profiles) {
    if (!matchesStudentAudience(notice, profile)) continue;
    const id = eventKey(profile.userId, notice.id, kind);
    if (notifications.has(id)) continue;
    notifications.set(id, {
      id,
      studentId: profile.userId,
      noticeId: notice.id,
      kind,
      title: kind === 'ACTUALIZACION' ? `Aviso actualizado: ${notice.title}` : `Nuevo aviso: ${notice.title}`,
      message: kind === 'ACTUALIZACION' ? 'La versión vigente del aviso fue modificada.' : 'Tenés un nuevo aviso dirigido a tu perfil.',
      createdAt: eventDate(notice),
      readAt: '',
    });
  }
}

export function syncNoticeEvents(notices: NoticeView[], profiles: AcademicProfile[]): void {
  for (const notice of notices) {
    if (notice.state === 'BORRADOR') continue;
    recordNoticeEvent(notice, profiles, notice.state === 'ACTUALIZADO' ? 'ACTUALIZACION' : 'PUBLICACION');
  }
}

export function listStudentNotifications(studentId: string): StudentNotification[] {
  return [...notifications.values()]
    .filter((item) => item.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function unreadStudentNotificationCount(studentId: string): number {
  return listStudentNotifications(studentId).filter((item) => !item.readAt).length;
}

export function markStudentNotificationRead(id: string, studentId: string): StudentNotification | null {
  const item = notifications.get(id);
  if (!item || item.studentId !== studentId) return null;
  if (!item.readAt) item.readAt = new Date().toISOString();
  return item;
}
