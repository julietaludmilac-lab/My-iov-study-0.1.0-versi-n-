import { useEffect, useState } from 'react';
import { ApiError, getStudentNotifications, markStudentNotificationRead, type StudentNotification } from './api';
import { homeData } from './legacyData';

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-AR');
}

export function StudentNotificationsPage() {
  const [items, setItems] = useState<StudentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentNotifications().then(({ notifications, unreadCount: count }) => { setItems(notifications); setUnreadCount(count); }).catch((cause: unknown) => setError(cause instanceof ApiError ? cause.message : 'No se pudieron cargar las notificaciones.')).finally(() => setLoading(false));
  }, []);

  function openNotification(item: StudentNotification) {
    try { window.sessionStorage.setItem('student-notice-to-open', item.noticeId); } catch { /* El detalle sigue siendo accesible por el listado. */ }
    window.location.hash = '#avisos';
    if (!item.readAt) {
      void markStudentNotificationRead(item.id).then((result) => {
        setUnreadCount(result.unreadCount);
        setItems((current) => current.map((entry) => entry.id === item.id ? result.notification : entry));
      }).catch(() => undefined);
    }
  }

  return <div className="notification-page-stack"><div className="notification-summary"><span className="admin-kicker">CENTRO DE AVISOS</span><strong>{unreadCount} sin leer</strong></div>{error && <div className="legacy-error" role="alert" aria-live="assertive">{error}</div>}<section className="legacy-card student-card"><h2><span>♧</span>Notificaciones existentes</h2><div className="card-divider" />{homeData.notifications.map((message) => <div className="legacy-notification-row" key={message}><span className="notification-dot" aria-hidden="true" /><span>{message}</span></div>)}</section>{loading ? <section className="legacy-card student-card"><p className="empty-text">Cargando novedades de avisos…</p></section> : items.length === 0 ? <section className="legacy-card student-card"><p className="empty-text">No hay notificaciones de avisos para mostrar.</p></section> : <section className="legacy-card student-card"><h2><span>▣</span>Novedades de avisos</h2><div className="card-divider" />{items.map((item) => <button className={`notice-notification-row ${item.readAt ? 'read' : 'unread'}`} key={item.id} onClick={() => openNotification(item)}><span className="notification-dot" aria-hidden="true" /><span className="notice-notification-copy"><strong>{item.title}</strong><span>{item.message}</span><small>{formatDate(item.createdAt)} · {item.readAt ? 'Leída' : 'Sin leer'}</small></span><span className="notification-open">ABRIR</span></button>)}</section>}</div>;
}

export function StudentUnreadNotificationsCard() {
  const [items, setItems] = useState<StudentNotification[]>([]);
  useEffect(() => { getStudentNotifications().then(({ notifications }) => setItems(notifications.filter((item) => !item.readAt).slice(0, 3))).catch(() => undefined); }, []);
  return <section className="legacy-card student-card"><h2><span>♧</span>Notificaciones sin leer</h2><div className="card-divider" />{items.length ? items.map((item) => <button className="student-home-notice" key={item.id} onClick={() => { window.sessionStorage.setItem('student-notice-to-open', item.noticeId); window.location.hash = '#avisos'; }}>{item.title}<span className="notice-mark new">Nuevo</span></button>) : <p className="empty-text">No hay novedades de avisos sin leer.</p>}<button className="outline-button" onClick={() => { window.location.hash = '#notificaciones'; }}>VER TODAS</button></section>;
}
