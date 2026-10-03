import { useEffect, useMemo, useState } from 'react';
import { ApiError, getStudentNotice, getStudentNoticeDocument, getStudentNotices, type NoticeDocument, type NoticeStatus, type NoticeView } from './api';
import { AgendaToggle } from './studentAgenda';

const STATUS_OPTIONS: Array<{ value: NoticeStatus; label: string }> = [
  { value: 'VIGENTE', label: 'Vigente' },
  { value: 'PROXIMO', label: 'Próximo a vencer' },
  { value: 'VENCIDO', label: 'Vencido' },
  { value: 'ACTUALIZADO', label: 'Actualizado' },
];

type NoticeFilters = { career: string; level: string; subject: string; category: string; status: string; from: string; to: string };
const emptyFilters: NoticeFilters = { career: '', level: '', subject: '', category: '', status: '', from: '', to: '' };

function formatDate(value: string): string {
  if (!value) return 'Sin fecha de vencimiento';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function isNew(notice: NoticeView): boolean {
  if (notice.version !== 1 || notice.status === 'VENCIDO') return false;
  const published = new Date(`${notice.publicationDate}T12:00:00Z`).getTime();
  return Number.isFinite(published) && Date.now() - published <= 7 * 24 * 60 * 60 * 1000;
}

function statusIcon(status: NoticeStatus): string {
  return { VIGENTE: '✓', PROXIMO: '◷', VENCIDO: '⌛', ACTUALIZADO: '↻', BORRADOR: '·' }[status];
}

function NoticeStatusBadge({ notice }: { notice: NoticeView }) {
  return <span className={`notice-badge student-status ${notice.status.toLowerCase()}`}><span aria-hidden="true">{statusIcon(notice.status)}</span>{notice.statusLabel}</span>;
}

function NoticeMarks({ notice }: { notice: NoticeView }) {
  return <span className="notice-marks">{isNew(notice) && <span className="notice-mark new">Nuevo</span>}{notice.status === 'ACTUALIZADO' && <span className="notice-mark updated">Actualizado</span>}</span>;
}

export function StudentNoticesPage({ onlyNew = false }: { onlyNew?: boolean }) {
  const [notices, setNotices] = useState<NoticeView[]>([]);
  const [profileLabel, setProfileLabel] = useState('Perfil académico sintético');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<NoticeFilters>(emptyFilters);
  const [selected, setSelected] = useState<NoticeView | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentNotices().then(({ notices: items, profile }) => {
      setNotices(items);
      setProfileLabel(`${profile.carrera} · ${profile.nivel}`);
      const targetId = window.sessionStorage.getItem('student-notice-to-open');
      if (targetId) {
        const target = items.find((item) => item.id === targetId);
        if (target) setSelected(target);
        window.sessionStorage.removeItem('student-notice-to-open');
      }
    }).catch((cause: unknown) => setError(cause instanceof ApiError ? cause.message : 'No se pudieron cargar los avisos.')).finally(() => setLoading(false));
  }, []);

  const options = useMemo(() => ({
    careers: [...new Set(notices.map((notice) => notice.career).filter(Boolean))],
    levels: [...new Set(notices.map((notice) => notice.level).filter(Boolean))],
    subjects: [...new Set(notices.map((notice) => notice.subject).filter(Boolean))],
    categories: [...new Set(notices.map((notice) => notice.category).filter(Boolean))],
  }), [notices]);

  const filtered = useMemo(() => notices.filter((notice) => {
    const text = query.trim().toLowerCase();
    const matchesText = !text || `${notice.title} ${notice.content}`.toLowerCase().includes(text);
    const matchesNew = !onlyNew || isNew(notice) || notice.status === 'ACTUALIZADO';
    const matchesDate = (!filters.from || notice.publicationDate >= filters.from) && (!filters.to || notice.publicationDate <= filters.to);
    return matchesText && matchesNew && matchesDate
      && (!filters.career || notice.career === filters.career)
      && (!filters.level || notice.level === filters.level)
      && (!filters.subject || notice.subject === filters.subject)
      && (!filters.category || notice.category === filters.category)
      && (!filters.status || notice.status === filters.status);
  }), [filters, notices, onlyNew, query]);

  function setFilter(key: keyof NoticeFilters, value: string) { setFilters((current) => ({ ...current, [key]: value })); }
  function clearFilters() { setFilters(emptyFilters); setQuery(''); }
  async function openNotice(id: string) {
    try { const result = await getStudentNotice(id); setSelected(result.notice); } catch (cause) { setError(cause instanceof ApiError ? cause.message : 'No se pudo abrir el aviso.'); }
  }

  if (selected) return <StudentNoticeDetail notice={selected} onBack={() => setSelected(null)} />;
  return <div className={`student-notices-stack ${onlyNew ? 'student-novelties-view' : 'student-all-notices-view'}`}>{onlyNew && <section className="novelties-banner"><span className="novelties-banner-icon" aria-hidden="true">✦</span><div><strong>Novedades</strong><p>Solo avisos nuevos o actualizados para tu perfil.</p></div><span className="notice-count">{filtered.length} novedad{filtered.length === 1 ? '' : 'es'}</span></section>}<div className="student-notices-intro"><div><span className="admin-kicker">{onlyNew ? 'ÚLTIMAS ACTUALIZACIONES' : 'INFORMACIÓN PARA TU PERFIL'}</span><p>{profileLabel}</p></div>{!onlyNew && <span className="notice-count">{filtered.length} aviso{filtered.length === 1 ? '' : 's'}</span>}</div><div className="student-filter-card"><label className="student-search">Buscar en título o contenido<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={onlyNew ? 'Buscar entre las novedades' : 'Ej.: inscripción, aula, documentación'} /></label><div className="student-filter-grid"><Filter label="Carrera" value={filters.career} options={options.careers} onChange={(value) => setFilter('career', value)} /><Filter label="Año / nivel" value={filters.level} options={options.levels} onChange={(value) => setFilter('level', value)} /><Filter label="Asignatura" value={filters.subject} options={options.subjects} onChange={(value) => setFilter('subject', value)} /><Filter label="Categoría" value={filters.category} options={options.categories} onChange={(value) => setFilter('category', value)} /><Filter label="Estado" value={filters.status} options={STATUS_OPTIONS.map((option) => option.value)} labels={STATUS_OPTIONS.map((option) => option.label)} onChange={(value) => setFilter('status', value)} /><label>Desde<input type="date" value={filters.from} onChange={(event) => setFilter('from', event.target.value)} /></label><label>Hasta<input type="date" value={filters.to} onChange={(event) => setFilter('to', event.target.value)} /></label></div><div className="student-filter-actions"><span>{onlyNew ? 'La vista excluye avisos antiguos sin cambios.' : 'Los filtros no modifican el contenido original.'}</span><button className="outline-button" onClick={clearFilters}>QUITAR FILTROS</button></div></div>{error && <div className="legacy-error" role="alert" aria-live="assertive">{error}</div>}{loading ? <LegacyStudentCard title={onlyNew ? 'Novedades' : 'Avisos'} icon="ⓘ"><p className="empty-text">Cargando avisos sintéticos…</p></LegacyStudentCard> : filtered.length === 0 ? <LegacyStudentCard title={onlyNew ? 'Sin novedades' : 'Avisos'} icon="ⓘ"><p className="empty-text">{onlyNew ? 'No hay avisos nuevos o actualizados para mostrar.' : 'No hay avisos que coincidan con los filtros seleccionados.'}</p><button className="outline-button" onClick={clearFilters}>QUITAR FILTROS</button></LegacyStudentCard> : <div className="student-notice-list">{filtered.map((notice) => <StudentNoticeCard key={notice.id} notice={notice} onOpen={() => openNotice(notice.id)} />)}</div>}</div>;
}

function Filter({ label, value, options, labels = options, onChange }: { label: string; value: string; options: string[]; labels?: string[]; onChange: (value: string) => void }) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Todos</option>{options.map((option, index) => <option key={option} value={option}>{labels[index] ?? option}</option>)}</select></label>;
}

function StudentNoticeCard({ notice, onOpen }: { notice: NoticeView; onOpen: () => void }) {
  return <article className="student-notice-card"><div className="student-notice-card-head"><div><NoticeStatusBadge notice={notice} /><NoticeMarks notice={notice} /></div><span className="notice-category">{notice.category}</span></div><button className="student-notice-title" onClick={onOpen}>{notice.title}</button><p>{notice.content}</p><div className="notice-meta"><span>Publicación: {formatDate(notice.publicationDate)}</span><span>Vencimiento: {formatDate(notice.expirationDate)}</span></div><div className="student-notice-audience">{notice.career && <span>Carrera: {notice.career}</span>}{notice.level && <span>Nivel: {notice.level}</span>}{notice.subject && <span>Asignatura: {notice.subject}</span>}</div><button className="outline-button" onClick={onOpen}>VER DETALLE</button></article>;
}

export function StudentNoticeDetail({ notice, onBack }: { notice: NoticeView; onBack: () => void }) {
  const [document, setDocument] = useState<NoticeDocument | null>(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState('');
  async function openDocument() {
    setDocumentLoading(true); setDocumentError('');
    try { const result = await getStudentNoticeDocument(notice.id); setDocument(result.document); }
    catch (cause) { setDocumentError(cause instanceof ApiError ? cause.message : 'No se pudo abrir el documento.'); }
    finally { setDocumentLoading(false); }
  }
  return <div className="student-detail-wrap"><button className="text-link student-back" onClick={onBack}>← Volver a avisos</button><LegacyStudentCard title="Detalle del aviso" icon="ⓘ"><div className="student-detail-head"><div><NoticeStatusBadge notice={notice} /><NoticeMarks notice={notice} /></div><span className="notice-category">{notice.category}</span></div><h2 className="student-detail-title">{notice.title}</h2><div className="student-detail-content">{notice.content}</div><div className="student-detail-grid"><Detail label="Publicación" value={formatDate(notice.publicationDate)} /><Detail label="Vencimiento" value={formatDate(notice.expirationDate)} /><Detail label="Destinatarios" value={notice.audiencePreview} /><Detail label="Carrera" value={notice.career || 'No especificada'} /><Detail label="Año / nivel" value={notice.level || 'No especificado'} /><Detail label="Asignatura" value={notice.subject || 'No especificada'} /><Detail label="Fuente" value={notice.source || 'No informada'} /></div><AgendaToggle kind="AVISO" sourceId={notice.id} />{notice.attachmentName ? <div className="student-attachment"><strong>Documento asociado</strong><span>{notice.attachmentName} · PDF · Disponible para tu perfil</span><button className="outline-button" onClick={openDocument} disabled={documentLoading}>{documentLoading ? 'ABRIENDO…' : 'ABRIR DOCUMENTO'}</button>{documentError && <span className="legacy-error" role="alert" aria-live="assertive">{documentError}</span>}{document && <div className="student-document-viewer" role="document"><div><strong>{document.filename}</strong><span>{Math.round(document.sizeBytes / 1024)} KB · contenido sintético</span></div><pre>{document.content}</pre></div>}</div> : <div className="student-attachment student-attachment-empty"><strong>Sin documento asociado</strong><span>Este aviso no tiene archivos adjuntos disponibles.</span></div>}</LegacyStudentCard></div>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><strong>{label}</strong><span>{value}</span></div>; }
function LegacyStudentCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) { return <section className="legacy-card student-card"><h2><span>{icon}</span>{title}</h2><div className="card-divider" />{children}</section>; }

export function StudentNoticesCard() {
  const [notices, setNotices] = useState<NoticeView[]>([]);
  useEffect(() => { getStudentNotices().then(({ notices: items }) => setNotices(items.slice(0, 2))).catch(() => undefined); }, []);
  return <LegacyStudentCard title="Avisos y novedades" icon="▣"><p className="student-card-note">Información institucional dirigida a tu perfil.</p>{notices.length ? notices.map((notice) => <button className="student-home-notice" key={notice.id} onClick={() => { window.location.hash = '#avisos'; }}>{notice.title}<span><NoticeStatusBadge notice={notice} /></span></button>) : <p className="empty-text">No hay avisos para mostrar.</p>}<button className="legacy-button small" onClick={() => { window.location.hash = '#avisos'; }}>VER AVISOS</button></LegacyStudentCard>;
}
