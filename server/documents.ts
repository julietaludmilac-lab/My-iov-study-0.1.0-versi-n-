// implementa: {funcion_11}, {proceso_11}, {criterio_aceptacion_8}, {error_6}

import type { NoticeView } from './notices.js';

export interface NoticeDocument {
  id: string;
  noticeId: string;
  filename: string;
  format: 'PDF';
  mimeType: 'application/pdf';
  sizeBytes: number;
  content: string;
  synthetic: true;
}

const documents = new Map<string, NoticeDocument>([
  ['notice-1', {
    id: 'document-notice-1', noticeId: 'notice-1', filename: 'guia-inscripcion-sintetica.pdf', format: 'PDF', mimeType: 'application/pdf', sizeBytes: 18432,
    content: 'DOCUMENTO SINTÉTICO ABIERTO\n\nGuía de inscripción — información ficticia\n\nEste documento pertenece exclusivamente al Aviso sintético de demostración.\nFuente: Comunicación institucional sintética.', synthetic: true,
  }],
]);

export function documentForNotice(notice: NoticeView): NoticeDocument | null {
  if (!notice.attachmentName) return null;
  const document = documents.get(notice.id);
  if (!document || document.filename !== notice.attachmentName) return null;
  return { ...document };
}

export function listDocuments(): Array<Omit<NoticeDocument, 'content'>> {
  return [...documents.values()].map(({ content: _content, ...metadata }) => ({ ...metadata }));
}
