// implementa: {funcion_27}, {salida_10}, {salida_11}, {salida_12}, {salida_13}, {salida_14}, {seguridad_4}, {privacidad_9}

import { listDocuments } from './documents.js';
import { listNotices } from './notices.js';
import { listStudentSchedule } from './schedule.js';

export type ExportType = 'avisos' | 'historial' | 'horarios' | 'fuentes' | 'documentacion';
export type ExportFormat = 'json' | 'csv';

function rowsFor(type: ExportType): Array<Record<string, unknown>> {
  const notices = listNotices();
  if (type === 'avisos') return notices.map(({ id, title, category, publicationDate, expirationDate, status, statusLabel, audiencePreview, source, version, updatedAt, expiredManagedBy, expiredManagedAt }) => ({ id, title, category, publicationDate, expirationDate, status, statusLabel, audiencePreview, source, version, updatedAt, expiredManagedBy, expiredManagedAt }));
  if (type === 'historial') return notices.flatMap((notice) => notice.history.map((entry) => ({ noticeId: notice.id, noticeTitle: notice.title, version: entry.version, changedAt: entry.changedAt, changedBy: entry.changedBy, reason: entry.reason, snapshot: entry.snapshot })));
  if (type === 'horarios') return listStudentSchedule().map(({ id, subject, day, time, commission, room, roomStatus, originalRoom, modificationNote, source }) => ({ id, subject, day, time, commission, room, roomStatus, originalRoom, modificationNote, source }));
  if (type === 'fuentes') return notices.map(({ id, source, title, updatedAt }) => ({ noticeId: id, source, title, updatedAt }));
  return listDocuments().map(({ id, noticeId, filename, format, mimeType, sizeBytes, synthetic }) => ({ id, noticeId, filename, format, mimeType, sizeBytes, synthetic }));
}

function csvValue(value: unknown): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

export function buildExport(type: ExportType, format: ExportFormat): { body: string; contentType: string; filename: string } {
  const rows = rowsFor(type);
  const filename = `my-iov-study-${type}.${format}`;
  if (format === 'json') return { body: JSON.stringify({ type, synthetic: true, exportedAt: new Date().toISOString(), rows }, null, 2), contentType: 'application/json; charset=utf-8', filename };
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const csv = [headers.map(csvValue).join(','), ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(','))].join('\r\n');
  return { body: `\uFEFF${csv}\r\n`, contentType: 'text/csv; charset=utf-8', filename };
}
