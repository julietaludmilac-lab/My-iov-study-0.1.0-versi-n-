import type { AcademicProfile, SessionState, SessionUser } from './types';

// implementa: {funcion_1}, {funcion_13}, {funcion_30}, {error_1}, {error_2}, {error_5}, {entrada_3}, {entrada_4}, {entrada_5}, {entrada_6}, {entrada_11}
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  let response: Response;
  const csrf = typeof document === 'undefined' ? '' : document.cookie.split('; ').find((item) => item.startsWith('my_iov_study_csrf='))?.split('=').slice(1).join('=') ?? '';
  try {
    response = await fetch(input, { ...init, cache: 'no-store', credentials: 'include', headers: { 'Content-Type': 'application/json', ...(csrf ? { 'x-csrf-token': decodeURIComponent(csrf) } : {}), ...init?.headers } });
  } catch {
    throw new ApiError('No pudimos cargar la información. Revisá tu conexión e intentá nuevamente.', 0);
  }

  const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    throw new ApiError(payload.error ?? 'Ocurrió un problema inesperado. Ya fue registrado. Intentá nuevamente.', response.status);
  }
  return payload;
}

export function getSession(): Promise<SessionState> { return request<SessionState>('/api/session'); }
export function login(credentials: { matricula: string; email: string; password: string }): Promise<{ authenticated: true; user: SessionUser; synthetic: true }> { return request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); }
export function logout(): Promise<{ ok: true }> { return request('/api/auth/logout', { method: 'POST' }); }
export function getStudentProfile(): Promise<{ profile: AcademicProfile | null; synthetic: true }> { return request('/api/student/profile'); }
export interface ScheduleEntry { id: string; subject: string; day: string; time: string; commission: string; room: string; roomStatus: 'OFICIAL' | 'MODIFICADA' | 'SIN_AULA'; originalRoom: string; modificationNote: string; source: string; synthetic: true; }
export function getStudentSchedule(): Promise<{ schedule: ScheduleEntry[]; synthetic: true }> { return request('/api/student/schedule'); }
export type AgendaKind = 'AVISO' | 'HORARIO';
export interface AgendaItem { id: string; studentId: string; kind: AgendaKind; sourceId: string; title: string; detail: string; dateLabel: string; fixedAt: string; synthetic: true; }
export function getStudentAgenda(): Promise<{ agenda: AgendaItem[]; synthetic: true }> { return request('/api/student/agenda'); }
export function addStudentAgenda(kind: AgendaKind, sourceId: string): Promise<{ item: AgendaItem; synthetic: true }> { return request('/api/student/agenda', { method: 'POST', body: JSON.stringify({ kind, sourceId }) }); }
export function removeStudentAgenda(id: string): Promise<{ item: AgendaItem; synthetic: true }> { return request(`/api/student/agenda/${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export function getStudentNotices(): Promise<{ notices: NoticeView[]; profile: AcademicProfile; synthetic: true }> { return request('/api/student/notices'); }
export function getStudentNotice(id: string): Promise<{ notice: NoticeView; profile: AcademicProfile; synthetic: true }> { return request(`/api/student/notices/${encodeURIComponent(id)}`); }
export interface NoticeDocument { id: string; noticeId: string; filename: string; format: 'PDF'; mimeType: 'application/pdf'; sizeBytes: number; content: string; synthetic: true; }
export function getStudentNoticeDocument(id: string): Promise<{ document: NoticeDocument; noticeId: string; synthetic: true }> { return request(`/api/student/notices/${encodeURIComponent(id)}/document`); }
export interface StudentNotification { id: string; studentId: string; noticeId: string; kind: 'PUBLICACION' | 'ACTUALIZACION'; title: string; message: string; createdAt: string; readAt: string; }
export function getStudentNotifications(): Promise<{ notifications: StudentNotification[]; unreadCount: number; synthetic: true }> { return request('/api/student/notifications'); }
export function markStudentNotificationRead(id: string): Promise<{ notification: StudentNotification; unreadCount: number; synthetic: true }> { return request(`/api/student/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' }); }
export function getBedeliaSummary(): Promise<{ role: 'BEDELIA'; counts: NoticeCounts; synthetic: true }> { return request('/api/bedelia/summary'); }

export type NoticeStatus = 'BORRADOR' | 'VIGENTE' | 'PROXIMO' | 'VENCIDO' | 'ACTUALIZADO';
export type NoticeAudience = '' | 'ESTUDIANTE' | 'CARRERA' | 'NIVEL' | 'ASIGNATURA' | 'TODOS';
export interface NoticeInput {
  title: string;
  content: string;
  category: string;
  publicationDate: string;
  expirationDate: string;
  audienceType: NoticeAudience;
  audienceValue: string;
  career: string;
  level: string;
  subject: string;
  source: string;
  attachmentName: string;
  reason?: string;
}
export interface NoticeHistoryEntry { version: number; changedAt: string; changedBy: string; reason: string; snapshot: Partial<NoticeInput>; }
export interface NoticeView extends NoticeInput { id: string; state: 'BORRADOR' | 'PUBLICADO' | 'ACTUALIZADO'; status: NoticeStatus; statusLabel: string; audiencePreview: string; version: number; createdBy: string; updatedAt: string; expiredManagedBy: string; expiredManagedAt: string; history: NoticeHistoryEntry[]; }
export interface NoticeCounts { drafts: number; published: number; expiring: number; expired: number; updated: number; }
export interface NoticesResponse { notices: NoticeView[]; counts: NoticeCounts; synthetic: true; }

export function getBedeliaNotices(): Promise<NoticesResponse> { return request('/api/bedelia/notices'); }
export function getBedeliaNotice(id: string): Promise<{ notice: NoticeView; synthetic: true }> { return request(`/api/bedelia/notices/${encodeURIComponent(id)}`); }
export function createBedeliaNotice(input: NoticeInput): Promise<{ notice: NoticeView; synthetic: true }> { return request('/api/bedelia/notices', { method: 'POST', body: JSON.stringify(input) }); }
export function updateBedeliaNotice(id: string, input: NoticeInput): Promise<{ notice: NoticeView; synthetic: true }> { return request(`/api/bedelia/notices/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) }); }
export function reviewBedeliaNotice(id: string): Promise<{ notice: NoticeView; synthetic: true }> { return request(`/api/bedelia/notices/${encodeURIComponent(id)}/review`, { method: 'POST' }); }
export function publishBedeliaNotice(id: string): Promise<{ notice: NoticeView; synthetic: true }> { return request(`/api/bedelia/notices/${encodeURIComponent(id)}/publish`, { method: 'POST' }); }
export function manageExpiredBedeliaNotice(id: string): Promise<{ notice: NoticeView; synthetic: true }> { return request(`/api/bedelia/notices/${encodeURIComponent(id)}/manage-expired`, { method: 'POST' }); }
export function restoreBedeliaNoticeVersion(id: string, version: number, reason: string): Promise<{ notice: NoticeView; synthetic: true }> { return request(`/api/bedelia/notices/${encodeURIComponent(id)}/restore/${version}`, { method: 'POST', body: JSON.stringify({ reason }) }); }
export type BedeliaExportType = 'avisos' | 'historial' | 'horarios' | 'fuentes' | 'documentacion';
export function bedeliaExportUrl(type: BedeliaExportType, format: 'json' | 'csv'): string { return `/api/bedelia/exports?type=${encodeURIComponent(type)}&format=${format}`; }
