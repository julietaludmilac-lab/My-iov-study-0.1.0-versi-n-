import { useEffect, useState } from 'react';
import { addStudentAgenda, ApiError, getStudentAgenda, removeStudentAgenda, type AgendaItem, type AgendaKind } from './api';

function kindLabel(kind: AgendaKind): string { return kind === 'AVISO' ? 'Aviso' : 'Horario'; }

export function AgendaToggle({ kind, sourceId, onFixed }: { kind: AgendaKind; sourceId: string; onFixed?: () => void }) {
  const [busy, setBusy] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { getStudentAgenda().then(({ agenda }) => setFixed(agenda.some((item) => item.kind === kind && item.sourceId === sourceId))).catch(() => undefined); }, [kind, sourceId]);
  async function fix() {
    setBusy(true); setError('');
    try { await addStudentAgenda(kind, sourceId); setFixed(true); onFixed?.(); }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : 'No se pudo fijar el elemento en tu agenda.'); }
    finally { setBusy(false); }
  }
  return <div className="agenda-toggle"><button className="outline-button" onClick={fix} disabled={busy || fixed}>{fixed ? 'FIJADO' : busy ? 'FIJANDO…' : 'FIJAR EN MI AGENDA'}</button>{error && <span className="legacy-error" role="alert" aria-live="assertive">{error}</span>}</div>;
}

function AgendaItemRow({ item, onRemoved }: { item: AgendaItem; onRemoved: (id: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function remove() {
    setBusy(true); setError('');
    try { await removeStudentAgenda(item.id); onRemoved(item.id); }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : 'No se pudo quitar el elemento de tu agenda.'); }
    finally { setBusy(false); }
  }
  return <article className="agenda-item"><div><span className="agenda-kind">{kindLabel(item.kind)}</span><strong>{item.title}</strong><span>{item.dateLabel}</span><small>{item.detail}</small></div><button className="outline-button" onClick={remove} disabled={busy}>{busy ? 'QUITANDO…' : 'QUITAR'}</button>{error && <div className="legacy-error" role="alert" aria-live="assertive">{error}</div>}</article>;
}

export function StudentAgendaPage() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { getStudentAgenda().then(({ agenda }) => setItems(agenda)).catch((cause: unknown) => setError(cause instanceof ApiError ? cause.message : 'No se pudo cargar tu agenda.')).finally(() => setLoading(false)); }, []);
  return <div className="student-agenda-page"><div className="student-notices-intro"><div><span className="admin-kicker">ORGANIZACIÓN PERSONAL</span><p>Avisos y horarios que elegiste guardar.</p></div><span className="notice-count">{items.length} elemento{items.length === 1 ? '' : 's'}</span></div>{error && <div className="legacy-error" role="alert" aria-live="assertive">{error}</div>}<section className="legacy-card student-card"><h2><span>◷</span>Mi agenda</h2><div className="card-divider" />{loading ? <p className="empty-text">Cargando agenda…</p> : items.length ? <div className="agenda-list">{items.map((item) => <AgendaItemRow key={item.id} item={item} onRemoved={(id) => setItems((current) => current.filter((entry) => entry.id !== id))} />)}</div> : <div className="agenda-empty"><strong>Tu agenda está vacía</strong><p>Fijá avisos y horarios relevantes para tenerlos a mano desde Inicio.</p><button className="outline-button" onClick={() => { window.location.hash = '#avisos'; }}>EXPLORAR AVISOS</button></div>}</section></div>;
}

export function StudentAgendaCard() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  useEffect(() => { getStudentAgenda().then(({ agenda }) => setItems(agenda.slice(0, 3))).catch(() => undefined); }, []);
  return <LegacyStudentCard title="Mi agenda de hoy" icon="◷">{items.length ? <div className="agenda-list agenda-list-home">{items.map((item) => <div className="agenda-home-item" key={item.id}><strong>{item.title}</strong><span>{item.dateLabel}</span></div>)}</div> : <><p className="student-card-note">Tu espacio personal para fijar avisos y horarios relevantes.</p><p className="empty-text">No hay elementos fijados para hoy.</p></>}<button className="outline-button" onClick={() => { window.location.hash = '#agenda'; }}>{items.length ? 'VER MI AGENDA' : 'EXPLORAR AVISOS'}</button></LegacyStudentCard>;
}

function LegacyStudentCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) { return <section className="legacy-card student-card"><h2><span>{icon}</span>{title}</h2><div className="card-divider" />{children}</section>; }
