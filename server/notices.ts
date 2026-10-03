// implementa: {funcion_3}, {funcion_4}, {funcion_5}, {funcion_6}, {funcion_7}, {funcion_8}, {funcion_13}, {funcion_15}, {funcion_16}, {funcion_17}, {funcion_18}, {funcion_19}, {funcion_20}, {funcion_21}, {funcion_22}, {funcion_23}, {funcion_24}, {funcion_28}, {concepto_3}, {concepto_4}, {concepto_5}, {concepto_13}, {concepto_14}, {error_4}

import type { AcademicProfile } from '../contracts/academic.js';

export const NOTICE_CATEGORIES = ['Académica', 'Administrativa', 'Horarios', 'Aulas', 'Cambios de cursado', 'Fechas importantes', 'Documentación'] as const;
export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];
export type AudienceType = '' | 'ESTUDIANTE' | 'CARRERA' | 'NIVEL' | 'ASIGNATURA' | 'TODOS';
export type NoticeState = 'BORRADOR' | 'PUBLICADO' | 'ACTUALIZADO';
export type NoticeStatus = 'BORRADOR' | 'VIGENTE' | 'PROXIMO' | 'VENCIDO' | 'ACTUALIZADO';

export interface NoticeInput {
  title?: string;
  content?: string;
  category?: string;
  publicationDate?: string;
  expirationDate?: string;
  audienceType?: AudienceType;
  audienceValue?: string;
  career?: string;
  level?: string;
  subject?: string;
  source?: string;
  attachmentName?: string;
}

export interface NoticeHistoryEntry {
  version: number;
  changedAt: string;
  changedBy: string;
  reason: string;
  snapshot: NoticeInput;
}

export interface Notice extends Required<Pick<NoticeInput, 'title' | 'content' | 'category' | 'publicationDate' | 'audienceType' | 'source'>> {
  id: string;
  expirationDate: string;
  audienceValue: string;
  career: string;
  level: string;
  subject: string;
  attachmentName: string;
  state: NoticeState;
  version: number;
  createdBy: string;
  updatedAt: string;
  reviewedBy: string;
  reviewedAt: string;
  expiredManagedBy: string;
  expiredManagedAt: string;
  history: NoticeHistoryEntry[];
}

export interface NoticeView extends Notice {
  status: NoticeStatus;
  statusLabel: string;
  audiencePreview: string;
}

const notices = new Map<string, Notice>();
let nextId = 5;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(value: string, amount: number): string {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function now(): string {
  return new Date().toISOString();
}

function snapshot(notice: Notice): NoticeInput {
  return {
    title: notice.title,
    content: notice.content,
    category: notice.category,
    publicationDate: notice.publicationDate,
    expirationDate: notice.expirationDate,
    audienceType: notice.audienceType,
    audienceValue: notice.audienceValue,
    career: notice.career,
    level: notice.level,
    subject: notice.subject,
    source: notice.source,
    attachmentName: notice.attachmentName,
  };
}

function statusOf(notice: Notice): NoticeStatus {
  if (notice.state === 'BORRADOR') return 'BORRADOR';
  if (notice.expirationDate && notice.expirationDate < today()) return 'VENCIDO';
  if (notice.state === 'ACTUALIZADO') return 'ACTUALIZADO';
  if (notice.expirationDate && notice.expirationDate <= addDays(today(), 7)) return 'PROXIMO';
  return 'VIGENTE';
}

function statusLabel(status: NoticeStatus): string {
  return { BORRADOR: 'Borrador', VIGENTE: 'Vigente', PROXIMO: 'Próximo a vencer', VENCIDO: 'Vencido', ACTUALIZADO: 'Actualizado' }[status];
}

function audiencePreview(notice: Notice): string {
  if (notice.audienceType === 'TODOS') return 'Todos los estudiantes · 25 destinatarios sintéticos';
  const counts: Record<Exclude<AudienceType, '' | 'TODOS'>, number> = { ESTUDIANTE: 1, CARRERA: 12, NIVEL: 7, ASIGNATURA: 3 };
  const count = notice.audienceType ? counts[notice.audienceType] : 0;
  return count ? `${notice.audienceValue} · ${count} destinatario${count === 1 ? '' : 's'} sintético${count === 1 ? '' : 's'}` : 'Sin audiencia seleccionada';
}

function view(notice: Notice): NoticeView {
  const status = statusOf(notice);
  return { ...notice, status, statusLabel: statusLabel(status), audiencePreview: audiencePreview(notice) };
}

function seedNotice(input: NoticeInput & { id: string; state: NoticeState; createdBy?: string; version?: number }): void {
  const timestamp = now();
  const notice: Notice = {
    id: input.id,
    title: input.title ?? '',
    content: input.content ?? '',
    category: input.category ?? '',
    publicationDate: input.publicationDate ?? '',
    expirationDate: input.expirationDate ?? '',
    audienceType: input.audienceType ?? '',
    audienceValue: input.audienceValue ?? '',
    career: input.career ?? '',
    level: input.level ?? '',
    subject: input.subject ?? '',
    source: input.source ?? '',
    attachmentName: input.attachmentName ?? '',
    state: input.state,
    version: input.version ?? 1,
    createdBy: input.createdBy ?? 'bedelia.demo',
    updatedAt: timestamp,
    reviewedBy: '',
    reviewedAt: '',
    expiredManagedBy: '',
    expiredManagedAt: '',
    history: [],
  };
  notices.set(notice.id, notice);
}

seedNotice({ id: 'notice-1', title: 'Aviso sintético de demostración', content: 'Contenido institucional ficticio para validar el flujo de publicación.', category: 'Académica', publicationDate: '2026-10-01', expirationDate: '2026-10-20', audienceType: 'CARRERA', audienceValue: 'Licenciatura sintética en Gestión Institucional', career: 'Licenciatura sintética en Gestión Institucional', source: 'Comunicación institucional sintética', attachmentName: 'guia-inscripcion-sintetica.pdf', state: 'PUBLICADO' });
seedNotice({ id: 'notice-2', title: 'Aviso próximo a vencer', content: 'Este aviso sintético permite verificar el estado próximo a vencer.', category: 'Fechas importantes', publicationDate: '2026-09-25', expirationDate: '2026-10-05', audienceType: 'NIVEL', audienceValue: '2.º año', level: '2.º año', source: 'Aviso de Bedelía sintético', state: 'PUBLICADO' });
seedNotice({ id: 'notice-3', title: 'Borrador sintético', content: 'Completar antes de publicar.', category: 'Administrativa', publicationDate: '', expirationDate: '', audienceType: '', audienceValue: '', source: '', state: 'BORRADOR' });
seedNotice({ id: 'notice-4', title: 'Aviso vencido de demostración', content: 'Aviso sintético conservado para comprobar el estado vencido.', category: 'Documentación', publicationDate: '2026-08-01', expirationDate: '2026-09-15', audienceType: 'TODOS', audienceValue: '', source: 'Documento institucional sintético', state: 'PUBLICADO' });

export function listNotices(): NoticeView[] {
  return [...notices.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(view);
}

export function matchesStudentAudience(notice: Notice | NoticeView, profile: AcademicProfile): boolean {
  if (notice.audienceType === 'TODOS') return true;
  if (notice.audienceType === 'ESTUDIANTE') return notice.audienceValue === profile.matricula || notice.audienceValue === profile.userId;
  if (notice.audienceType === 'CARRERA') return notice.audienceValue === profile.carrera;
  if (notice.audienceType === 'NIVEL') return notice.audienceValue === profile.nivel;
  if (notice.audienceType === 'ASIGNATURA') return profile.asignaturas.includes(notice.audienceValue);
  return false;
}

export function listStudentNotices(profile: AcademicProfile): NoticeView[] {
  return listNotices().filter((notice) => notice.state !== 'BORRADOR' && matchesStudentAudience(notice, profile));
}

export function findStudentNotice(id: string, profile: AcademicProfile): NoticeView | null {
  const notice = notices.get(id);
  if (!notice || notice.state === 'BORRADOR' || !matchesStudentAudience(notice, profile)) return null;
  return view(notice);
}

export function findNotice(id: string): NoticeView | null {
  const notice = notices.get(id);
  return notice ? view(notice) : null;
}

export function summary() {
  const items = listNotices();
  return {
    drafts: items.filter((notice) => notice.status === 'BORRADOR').length,
    published: items.filter((notice) => notice.status === 'VIGENTE').length,
    expiring: items.filter((notice) => notice.status === 'PROXIMO').length,
    expired: items.filter((notice) => notice.status === 'VENCIDO').length,
    updated: items.filter((notice) => notice.status === 'ACTUALIZADO').length,
  };
}

export function createNotice(input: NoticeInput, userId: string): NoticeView {
  const id = `notice-${nextId++}`;
  seedNotice({ ...input, id, state: 'BORRADOR', createdBy: userId });
  return findNotice(id)!;
}

export function updateNotice(id: string, input: NoticeInput, userId: string, reason = 'Actualización sintética'): NoticeView | null {
  const notice = notices.get(id);
  if (!notice) return null;
  const before = snapshot(notice);
  Object.assign(notice, {
    title: input.title ?? notice.title,
    content: input.content ?? notice.content,
    category: input.category ?? notice.category,
    publicationDate: input.publicationDate ?? notice.publicationDate,
    expirationDate: input.expirationDate ?? notice.expirationDate,
    audienceType: input.audienceType ?? notice.audienceType,
    audienceValue: input.audienceValue ?? notice.audienceValue,
    career: input.career ?? notice.career,
    level: input.level ?? notice.level,
    subject: input.subject ?? notice.subject,
    source: input.source ?? notice.source,
    attachmentName: input.attachmentName ?? notice.attachmentName,
    state: notice.state === 'BORRADOR' ? 'BORRADOR' : 'ACTUALIZADO',
    version: notice.version + 1,
    updatedAt: now(),
    reviewedBy: '',
    reviewedAt: '',
  });
  notice.history.push({ version: notice.version - 1, changedAt: notice.updatedAt, changedBy: userId, reason, snapshot: before });
  return findNotice(id);
}

export function validateForPublish(input: NoticeInput): string[] {
  const errors: string[] = [];
  if (!input.title?.trim()) errors.push('Título');
  if (!input.content?.trim()) errors.push('Contenido');
  if (!input.category || !NOTICE_CATEGORIES.includes(input.category as NoticeCategory)) errors.push('Categoría');
  if (!input.publicationDate) errors.push('Fecha de publicación');
  if (!input.audienceType) errors.push('Destinatarios');
  if (input.audienceType && input.audienceType !== 'TODOS' && !input.audienceValue?.trim()) errors.push('Referencia de destinatarios');
  if (!input.source?.trim()) errors.push('Fuente');
  if (input.publicationDate && input.publicationDate > today()) errors.push('La fecha de publicación no puede ser futura.');
  if (input.expirationDate && input.publicationDate && input.expirationDate < input.publicationDate) errors.push('La fecha de vencimiento no puede ser anterior a la publicación.');
  return errors;
}

export function publishNotice(id: string, userId: string): { notice?: NoticeView; errors?: string[] } {
  const notice = notices.get(id);
  if (!notice) return { errors: ['Aviso no encontrado.'] };
  if (!notice.reviewedBy) return { errors: ['Revisión previa y confirmación explícita'] };
  const errors = validateForPublish(snapshot(notice));
  if (errors.length) return { errors };
  notice.state = notice.version > 1 ? 'ACTUALIZADO' : 'PUBLICADO';
  notice.updatedAt = now();
  notice.history.push({ version: notice.version, changedAt: notice.updatedAt, changedBy: userId, reason: 'Publicación confirmada desde revisión previa', snapshot: snapshot(notice) });
  return { notice: view(notice) };
}

export function markReviewed(id: string, userId: string): NoticeView | null {
  const notice = notices.get(id);
  if (!notice) return null;
  notice.reviewedBy = userId;
  notice.reviewedAt = now();
  return view(notice);
}

export function manageExpiredNotice(id: string, userId: string): { notice?: NoticeView; error?: string } {
  const notice = notices.get(id);
  if (!notice) return { error: 'Aviso no encontrado.' };
  if (statusOf(notice) !== 'VENCIDO') return { error: 'Solo se pueden gestionar avisos vencidos.' };
  if (notice.expiredManagedAt) return { notice: view(notice) };
  const before = snapshot(notice);
  const changedAt = now();
  notice.expiredManagedBy = userId;
  notice.expiredManagedAt = changedAt;
  notice.version += 1;
  notice.updatedAt = changedAt;
  notice.history.push({ version: notice.version - 1, changedAt, changedBy: userId, reason: 'Gestión explícita de aviso vencido', snapshot: before });
  return { notice: view(notice) };
}

export function restoreNoticeVersion(id: string, version: number, userId: string, reason: string): { notice?: NoticeView; error?: string } {
  const notice = notices.get(id);
  if (!notice) return { error: 'Aviso no encontrado.' };
  const historical = notice.history.find((entry) => entry.version === version);
  if (!historical) return { error: 'La versión solicitada no está disponible.' };
  if (!reason.trim()) return { error: 'Indicá un motivo para restaurar la versión.' };
  const before = snapshot(notice);
  const changedAt = now();
  Object.assign(notice, historical.snapshot, { state: 'ACTUALIZADO' as NoticeState, version: notice.version + 1, updatedAt: changedAt, reviewedBy: '', reviewedAt: '' });
  notice.history.push({ version: notice.version - 1, changedAt, changedBy: userId, reason: `Restauración de v${version}: ${reason.trim()}`, snapshot: before });
  return { notice: view(notice) };
}
