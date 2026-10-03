import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ApiError, getSession, login, logout } from './api';
import { BedeliaPanel, NoticeExportsPage, NoticeFormPage, NoticeHistoryPage, NoticeManagementPage } from './bedelia';
import { StudentNoticesCard, StudentNoticesPage } from './studentNotices';
import { StudentAgendaCard, StudentAgendaPage } from './studentAgenda';
import { StudentNotificationsPage, StudentUnreadNotificationsCard } from './studentNotifications';
import { StudentScheduleTodayCard, scheduleForCommission } from './studentSchedule';
import type { SessionState, SessionUser } from './types';
import { completedCommissions, currentCommissions, currentExams, fees, homeData, missingCommissions, missingExams, notifications, syntheticStudent, takenExams } from './legacyData';

// implementa: {etapa_2}, {funcion_existente_1}, {funcion_existente_2}, {funcion_existente_3}, {funcion_existente_4}, {funcion_existente_5}, {funcion_existente_6}, {funcion_existente_7}, {funcion_existente_8}, {funcion_existente_9}, {funcion_existente_10}, {funcion_existente_11}, {funcion_existente_12}, {funcion_existente_13}, {funcion_existente_14}, {funcion_existente_15}, {funcion_existente_16}, {funcion_existente_17}, {funcion_existente_18}, {funcion_existente_19}, {funcion_existente_20}, {funcion_existente_21}, {funcion_existente_22}, {funcion_existente_23}, {funcion_existente_24}
  type RouteKey = 'inicio' | 'datospersonales' | 'cambioclave' | 'formapago' | 'fichasalud' | 'planestudio' | 'inscripcionescomisiones' | 'comisionesactuales' | 'comisionescursadas' | 'comisionesfaltantes' | 'inscripcionesexamenes' | 'examenesactuales' | 'examenesrendidos' | 'examenesfaltantes' | 'cuotas' | 'comprobantes' | 'certificados' | 'tav' | 'titulo' | 'encuestas' | 'notificaciones' | 'avisos' | 'novedadesavisos' | 'agenda' | 'contacto' | 'ayuda' | 'panelbedelia' | 'crearaviso' | 'gestionavisos' | 'historialavisos' | 'exportaciones';
type Commission = (typeof currentCommissions)[number];
type Exam = (typeof missingExams)[number];

type Route = { key: RouteKey; label: string; group?: string };
const routes: Route[] = [
  { key: 'inicio', label: 'Inicio' },
  { key: 'datospersonales', label: 'Datos Personales', group: 'Perfil' },
  { key: 'cambioclave', label: 'Cambio de Contraseña', group: 'Perfil' },
  { key: 'formapago', label: 'Forma de Pago', group: 'Perfil' },
  { key: 'fichasalud', label: 'Ficha de Salud', group: 'Perfil' },
  { key: 'planestudio', label: 'Plan de estudio', group: 'Perfil' },
  { key: 'inscripcionescomisiones', label: 'Inscripciones', group: 'Comisiones' },
  { key: 'comisionesactuales', label: 'Actuales', group: 'Comisiones' },
  { key: 'comisionescursadas', label: 'Cursadas', group: 'Comisiones' },
  { key: 'comisionesfaltantes', label: 'Faltantes', group: 'Comisiones' },
  { key: 'inscripcionesexamenes', label: 'Inscripciones', group: 'Exámenes' },
  { key: 'examenesactuales', label: 'Actuales', group: 'Exámenes' },
  { key: 'examenesrendidos', label: 'Rendidos', group: 'Exámenes' },
  { key: 'examenesfaltantes', label: 'Faltantes', group: 'Exámenes' },
  { key: 'cuotas', label: 'Cuotas', group: 'Aranceles' },
  { key: 'comprobantes', label: 'Comprobantes', group: 'Aranceles' },
  { key: 'certificados', label: 'Certificados', group: 'Trámites' },
  { key: 'tav', label: 'Académicos', group: 'Trámites' },
  { key: 'titulo', label: 'Título', group: 'Trámites' },
  { key: 'encuestas', label: 'Encuestas' },
  { key: 'notificaciones', label: 'Notificaciones' },
  { key: 'avisos', label: 'Avisos y novedades', group: 'Avisos y agenda' },
  { key: 'novedadesavisos', label: 'Novedades', group: 'Avisos y agenda' },
  { key: 'agenda', label: 'Mi agenda', group: 'Avisos y agenda' },
  { key: 'contacto', label: 'Contacto' },
  { key: 'ayuda', label: 'Ayuda' },
  { key: 'panelbedelia', label: 'Panel de Bedelía', group: 'Avisos y agenda' },
  { key: 'crearaviso', label: 'Crear aviso', group: 'Avisos y agenda' },
  { key: 'gestionavisos', label: 'Gestionar avisos', group: 'Avisos y agenda' },
  { key: 'historialavisos', label: 'Historial', group: 'Avisos y agenda' },
  { key: 'exportaciones', label: 'Exportaciones', group: 'Avisos y agenda' },
];
const routeMap = new Map(routes.map((route) => [route.key, route]));

export default function App() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState<SessionState | null>(null);
  const [sessionError, setSessionError] = useState('');
  const [route, setRoute] = useState<RouteKey>('inicio');

  useEffect(() => {
    const syncRoute = () => {
      const key = window.location.hash.replace(/^#/, '') as RouteKey;
      setRoute(routeMap.has(key) ? key : 'inicio');
    };
    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    const timer = window.setTimeout(() => {
      getSession().then(setSession).catch((error: unknown) => {
        setSession({ authenticated: false, user: null });
        setSessionError(error instanceof Error ? error.message : 'No pudimos cargar la información. Revisá tu conexión e intentá nuevamente.');
      }).finally(() => setBooting(false));
    }, 700);
    return () => { window.removeEventListener('hashchange', syncRoute); window.clearTimeout(timer); };
  }, []);

  if (booting) return <SplashScreen />;
  if (!session?.authenticated || !session.user) return <LoginPage onAuthenticated={(user) => setSession({ authenticated: true, user })} initialError={sessionError} />;
  if (route === 'inicio' && !window.location.hash) window.location.hash = '#inicio';
  return <LegacyShell user={session.user} route={route} onLogout={() => setSession({ authenticated: false, user: null })} />;
}

function SplashScreen() {
  return <main className="legacy-splash" aria-label="Cargando My IOV Study"><div className="synthetic-emblem" aria-hidden="true"><span>✦</span><small>VERITATEM</small></div></main>;
}

type LoginUserType = 'ESTUDIANTE' | 'BEDELIA';
const demoLoginValues: Record<LoginUserType, { matricula: string; email: string; password: string }> = {
  ESTUDIANTE: { matricula: 'A-2026-001', email: 'estudiante.demo@ucsf.test', password: 'Estudiante2026A' },
  BEDELIA: { matricula: 'B-ADMIN-001', email: 'bedelia.demo@ucsf.test', password: 'Bedelia2026A' },
};

function LoginPage({ onAuthenticated, initialError }: { onAuthenticated: (user: SessionUser) => void; initialError: string }) {
  const [userType, setUserType] = useState<LoginUserType>('ESTUDIANTE');
  const [values, setValues] = useState(demoLoginValues.ESTUDIANTE);
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    if (!values.matricula || !values.email || !values.password) { setError('Completá todos los campos obligatorios para ingresar.'); return; }
    setBusy(true);
    try { const result = await login(values); if (result.user.role !== userType) { await logout(); setError(`La cuenta ingresada no corresponde al tipo de usuario seleccionado: ${userType === 'BEDELIA' ? 'Administración / Bedelía' : 'Estudiante'}.`); return; } onAuthenticated(result.user); window.location.hash = result.user.role === 'BEDELIA' ? '#panelbedelia' : '#inicio'; }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : 'Ocurrió un problema inesperado. Ya fue registrado. Intentá nuevamente.'); }
    finally { setBusy(false); }
  }
  return <main className="legacy-login"><div className="login-overlay"><section className="legacy-login-card" aria-labelledby="legacy-login-title"><h1 id="legacy-login-title">My IOV Study</h1><h2>SISTEMA DE AUTOGESTIÓN REMOTA</h2><div className="login-form-panel"><p>Elegí el tipo de usuario y completá los datos para ingresar</p><form id="login-form" onSubmit={handleSubmit}><div className="login-fields"><label className="login-role-field">Tipo de usuario *<select value={userType} onChange={(event) => { const nextType = event.target.value as LoginUserType; setUserType(nextType); setValues(demoLoginValues[nextType]); setError(''); }}><option value="ESTUDIANTE">Estudiante</option><option value="BEDELIA">Administración / Bedelía</option></select></label><label>Matrícula *<input value={values.matricula} onChange={(event) => setValues({ ...values, matricula: event.target.value })} autoComplete="username" required /></label><label>Correo institucional *<input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} autoComplete="email" required /></label><label>Clave personal *<input type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} autoComplete="current-password" required /></label></div>{error && <div className="legacy-error" role="alert" aria-live="assertive">{error}</div>}<button className="legacy-button" type="submit" disabled={busy}>{busy ? 'INGRESANDO…' : 'INGRESAR'}</button></form></div><button className="recovery-link" type="button">Olvidé mi matrícula y/o clave personal</button><footer className="legacy-footer"><span>AYUDA</span><span>© 2026 <b>Universidad Católica de Santa Fe</b></span></footer></section></div></main>;
}

function LegacyShell({ user, route, onLogout }: { user: SessionUser; route: RouteKey; onLogout: () => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Comisiones: true, 'Exámenes': true, Aranceles: true, Trámites: true, 'Avisos y agenda': true });
  const current = routeMap.get(route) ?? routes[0];
  const go = (key: RouteKey) => { window.location.hash = `#${key}`; setDrawerOpen(false); };
  async function handleLogout() { await logout().catch(() => undefined); onLogout(); window.location.hash = ''; }
  return <div className="legacy-app"><header className="legacy-topbar"><button className="icon-button" aria-label="Abrir menú" onClick={() => setDrawerOpen(true)}>☰</button><div className="legacy-top-title"><strong>My IOV Study</strong><small>servicios.ucsf.edu.ar</small></div><button className="icon-button" aria-label="Más opciones">⋮</button></header><Drawer open={drawerOpen} user={user} route={route} openGroups={openGroups} setOpenGroups={setOpenGroups} go={go} onClose={() => setDrawerOpen(false)} onLogout={handleLogout} /><main className="legacy-content"><PageHeading title={current.label} onMenu={() => setDrawerOpen(true)} /><PageContent route={route} user={user} /></main><footer className="legacy-footer page-footer"><span>AYUDA</span><span>© 2026 <b>Universidad Católica de Santa Fe</b></span></footer></div>;
}

function Drawer({ open, user, route, openGroups, setOpenGroups, go, onClose, onLogout }: { open: boolean; user: SessionUser; route: RouteKey; openGroups: Record<string, boolean>; setOpenGroups: (value: Record<string, boolean>) => void; go: (key: RouteKey) => void; onClose: () => void; onLogout: () => void }) {
  const groups = user.role === 'BEDELIA' ? [] : ['Perfil', 'Comisiones', 'Exámenes', 'Aranceles', 'Trámites'];
  return <>{open && <button className="drawer-backdrop" aria-label="Cerrar menú" onClick={onClose} />}{<aside className={`legacy-drawer ${open ? 'open' : ''}`} aria-label="Menú lateral"><div className="drawer-brand"><span className="mini-emblem">✦</span><strong>My IOV Study</strong></div><div className="drawer-user"><span className="avatar-person" aria-hidden="true">●</span><span>{user.role === 'BEDELIA' ? 'bedelia.demo' : syntheticStudent.alias}</span><span>⌃</span></div><nav className="drawer-nav">{user.role === 'BEDELIA' ? <DrawerItem label="Panel de Bedelía" active={route === 'panelbedelia'} icon="▦" onClick={() => go('panelbedelia')} /> : <DrawerItem label="Inicio" active={route === 'inicio'} icon="⌂" onClick={() => go('inicio')} />}{groups.map((group) => <div className="drawer-group" key={group}><button className="drawer-group-title" onClick={() => setOpenGroups({ ...openGroups, [group]: !openGroups[group] })}><span>{group === 'Perfil' ? '♙' : group === 'Comisiones' ? '◫' : group === 'Exámenes' ? '▣' : group === 'Aranceles' ? '▤' : group === 'Trámites' ? '➤' : '▤'}</span>{group}<span className="group-chevron">{openGroups[group] ? '⌃' : '⌄'}</span></button>{openGroups[group] && routes.filter((item) => item.group === group).map((item) => <DrawerSubItem key={item.key} label={item.label} active={route === item.key} onClick={() => go(item.key)} />)}</div>)}{user.role === 'ESTUDIANTE' && <><DrawerItem label="Encuestas" active={route === 'encuestas'} icon="◌" onClick={() => go('encuestas')} /><DrawerItem label="Notificaciones" active={route === 'notificaciones'} icon="♧" onClick={() => go('notificaciones')} /><div className="drawer-group"><button className="drawer-group-title" onClick={() => setOpenGroups({ ...openGroups, 'Avisos y agenda': !openGroups['Avisos y agenda'] })}><span>▤</span>Avisos y agenda<span className="group-chevron">{openGroups['Avisos y agenda'] ? '⌃' : '⌄'}</span></button>{openGroups['Avisos y agenda'] && routes.filter((item) => item.group === 'Avisos y agenda' && ['avisos', 'novedadesavisos', 'agenda'].includes(item.key)).map((item) => <DrawerSubItem key={item.key} label={item.label} active={route === item.key} onClick={() => go(item.key)} />)}</div></>}{user.role === 'BEDELIA' && <div className="drawer-group"><button className="drawer-group-title" onClick={() => setOpenGroups({ ...openGroups, 'Avisos y agenda': !openGroups['Avisos y agenda'] })}><span>▤</span>Avisos y agenda<span className="group-chevron">{openGroups['Avisos y agenda'] ? '⌃' : '⌄'}</span></button>{openGroups['Avisos y agenda'] && routes.filter((item) => item.group === 'Avisos y agenda' && ['panelbedelia', 'crearaviso', 'gestionavisos', 'historialavisos', 'exportaciones'].includes(item.key)).map((item) => <DrawerSubItem key={item.key} label={item.label} active={route === item.key} onClick={() => go(item.key)} />)}</div>}<DrawerItem label="Contacto" active={route === 'contacto'} icon="◯" onClick={() => go('contacto')} /><DrawerItem label="Ayuda" active={route === 'ayuda'} icon="?" onClick={() => go('ayuda')} /></nav><button className="drawer-exit" onClick={onLogout}>Salir</button></aside>}</>;
}
function DrawerItem({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) { return <button className={`drawer-item ${active ? 'active' : ''}`} onClick={onClick}><span>{icon}</span>{label}</button>; }
function DrawerSubItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { return <button className={`drawer-subitem ${active ? 'active' : ''}`} onClick={onClick}>{label}</button>; }
function PageHeading({ title, onMenu }: { title: string; onMenu: () => void }) { return <div className="page-heading"><button className="heading-menu" aria-label="Abrir menú" onClick={onMenu}>☰</button><h1>{title}</h1><button className="heading-more" aria-label="Más opciones">⋮</button></div>; }

function PageContent({ route, user }: { route: RouteKey; user: SessionUser }) {
  if (user.role === 'BEDELIA') {
    switch (route) {
      case 'crearaviso': return <NoticeFormPage />;
      case 'gestionavisos': return <NoticeManagementPage />;
      case 'historialavisos': return <NoticeHistoryPage />;
      case 'exportaciones': return <NoticeExportsPage />;
      case 'panelbedelia':
      case 'inicio':
      default: return <BedeliaPanel />;
    }
  }
  switch (route) {
    case 'inicio': return <HomePage />;
    case 'datospersonales': return <PersonalDataPage />;
    case 'cambioclave': return <PasswordPage />;
    case 'formapago': return <PaymentPage />;
    case 'fichasalud': return <HealthPage />;
    case 'planestudio': return <EmptyPanel title="Plan de estudio" />;
    case 'inscripcionescomisiones': return <EmptyPanel title="Inscripciones a comisiones" />;
    case 'comisionesactuales': return <CommissionsCurrentPage />;
    case 'comisionescursadas': return <CompletedCommissionsPage />;
    case 'comisionesfaltantes': return <MissingCommissionsPage />;
    case 'inscripcionesexamenes': return <EnrollmentExamPage />;
    case 'examenesactuales': return <CurrentExamPage />;
    case 'examenesrendidos': return <TakenExamPage />;
    case 'examenesfaltantes': return <MissingExamPage />;
    case 'cuotas': return <FeesPage />;
    case 'comprobantes': return <ReceiptsPage />;
    case 'certificados': return <EmptyPanel title="Certificados" />;
    case 'tav': return <EmptyPanel title="Académicos" />;
    case 'titulo': return <EmptyPanel title="Título" />;
    case 'encuestas': return <EmptyPanel title="Encuestas" />;
    case 'notificaciones': return <StudentNotificationsPage />;
    case 'avisos': return <StudentNoticesPage />;
    case 'novedadesavisos': return <StudentNoticesPage onlyNew />;
    case 'agenda': return <StudentAgendaPage />;
    case 'contacto': return <ContactPage />;
    case 'ayuda': return <HelpPage />;
    case 'panelbedelia':
    case 'crearaviso':
    case 'gestionavisos':
    case 'historialavisos': return <EmptyPanel title="Sección no disponible" />;
  }
}

function HomePage() { return <div className="legacy-stack"><StudentUnreadNotificationsCard /><StudentScheduleTodayCard /><LegacyCard title="Dónde rindo hoy" icon="◷"><EmptyText /></LegacyCard><StudentNoticesCard /><StudentAgendaCard /></div>; }
function PersonalDataPage() { return <LegacyCard title="Datos personales" icon="♙"><div className="profile-hero"><span className="avatar-person large" aria-hidden="true">●</span><strong>{syntheticStudent.name}</strong><span>{syntheticStudent.matricula}</span><span>{syntheticStudent.facultad}</span><span>{syntheticStudent.carrera}</span><button className="text-link">Ver plan de estudio</button></div><ReadOnlyFields fields={['Domicilio sintético', 'Localidad sintética', 'Provincia sintética', 'Nacionalidad sintética', 'Teléfono sintético', 'Celular sintético']} /></LegacyCard>; }
function PasswordPage() { return <LegacyCard title="Cambio de contraseña" icon="⚿"><div className="yellow-notice">La nueva contraseña debe ser distinta de la actual, tener entre 8 y 20 caracteres alfanuméricos, un número, una mayúscula y una minúscula.</div><ReadOnlyFields fields={['Contraseña actual', 'Nueva contraseña', 'Repetir nueva contraseña']} password /><button className="legacy-button small">CAMBIAR</button></LegacyCard>; }
function PaymentPage() { return <LegacyCard title="Forma de pago" icon="▤"><div className="yellow-notice">La adhesión se encuentra habilitada hasta el día 25 de cada mes o el día hábil posterior.</div><p className="field-label">Modalidad</p><div className="fake-select">Con CBU <span>⌄</span></div><ReadOnlyFields fields={['Banco sintético', 'Sucursal sintética']} /><button className="legacy-button small">GUARDAR</button></LegacyCard>; }
function HealthPage() { return <LegacyCard title="Ficha de salud" icon="▣"><div className="yellow-notice">Declaración jurada. La información se trata conforme a la finalidad declarada por la institución.</div><ReadOnlyFields fields={['Cobertura de salud sintética', 'Grupo sanguíneo sintético', 'Factor Rh sintético']} /><button className="legacy-button small">GUARDAR</button></LegacyCard>; }
function CommissionsCurrentPage() { const [selected, setSelected] = useState<Commission | null>(null); return <><GroupedTables items={currentCommissions} columns={['Asignatura', 'Duración']} onSelect={setSelected} /><DetailModal commission={selected} onClose={() => setSelected(null)} /></>; }
function CompletedCommissionsPage() { return <GroupedTables items={completedCommissions} columns={['Asignatura', 'Estado']} />; }
function MissingCommissionsPage() { return <GroupedTables items={missingCommissions} columns={['Asignatura', 'Condición']} />; }
function EnrollmentExamPage() { return <><div className="green-banner">Habilitado hasta el 15/12/2026</div><EmptyText /></>; }
function CurrentExamPage() { return <GroupedTables items={currentExams} columns={['Asignatura', 'Mesa']} />; }
function TakenExamPage() { return <GroupedTables items={takenExams} columns={['Mesa', 'Fecha', 'Nota', 'Condición']} />; }
function MissingExamPage() { const [selected, setSelected] = useState<Exam | null>(null); return <><GroupedTables items={missingExams} columns={['Asignatura', 'Plan']} onSelect={setSelected} /><ExamModal exam={selected} onClose={() => setSelected(null)} /></>; }
function FeesPage() { return <LegacyCard title="Cuotas" icon="▤"><div className="year-select">2026 <span>⌄</span></div><table className="legacy-table"><thead><tr><th>Cuota</th><th>Estado</th><th>Fecha</th><th>Medio</th></tr></thead><tbody>{fees.map((fee) => <tr key={fee.month} className={fee.status === 'Pendiente' ? 'pending-row' : ''}><td>{fee.month}</td><td>{fee.status}</td><td>{fee.date}</td><td>{fee.method}</td></tr>)}</tbody></table><button className="legacy-button small">PAGAR</button></LegacyCard>; }
function ReceiptsPage() { return <LegacyCard title="Comprobantes" icon="▥"><div className="receipt"><div className="barcode">||| || ||| | |||| || | |||</div><p>Comprobante sintético de demostración</p><button className="legacy-button small">VOLVER</button></div></LegacyCard>; }
function NotificationsPage() { return <LegacyCard title="Notificaciones" icon="♧">{notifications.map((item) => <div className="notification-row" key={item.title}><span className={item.read ? 'dot read' : 'dot'} /><div><strong>{item.title}</strong><small>{item.date}</small></div></div>)}</LegacyCard>; }
function ContactPage() { return <LegacyCard title="Contacto" icon="◯"><p>Contacto institucional:</p><a className="text-link" href="https://www.ucsf.edu.ar/contacto/" target="_blank" rel="noreferrer">Abrir contacto</a></LegacyCard>; }
function HelpPage() { return <LegacyCard title="Ayuda" icon="?"><EmptyText /></LegacyCard>; }
function EmptyPanel({ title }: { title: string }) { return <LegacyCard title={title} icon="ⓘ"><EmptyText /></LegacyCard>; }
function EmptyText() { return <p className="empty-text">No hay elementos para mostrar.</p>; }
function LegacyCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) { return <section className="legacy-card"><h2><span>{icon}</span>{title}</h2><div className="card-divider" />{children}</section>; }
function ReadOnlyFields({ fields, password = false }: { fields: string[]; password?: boolean }) { return <div className="field-stack">{fields.map((field) => <label className="legacy-field" key={field}>{field}<input type={password ? 'password' : 'text'} value={password ? '' : 'Dato sintético'} readOnly={!password} placeholder={password ? 'Ingresá el dato' : undefined} /></label>)}</div>; }
type TableItem = { subject: string; level?: string; duration?: string; status?: string; table?: string; plan?: string; condition?: string; date?: string; commission?: string; time?: string; grade?: string; room?: string };
function GroupedTables<T extends TableItem>({ items, columns, onSelect }: { items: T[]; columns: string[]; onSelect?: (item: T) => void }) { const groups = useMemo(() => [...new Set(items.map((item) => item.level ?? ''))], [items]); return <div className="legacy-table-card">{groups.map((group) => <div key={group}><div className="level-chip">{group || 'Listado'}</div><table className="legacy-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{items.filter((item) => (item.level ?? '') === group).map((item) => <tr key={item.subject} onClick={() => onSelect?.(item)} className={onSelect ? 'clickable-row' : ''}><td>{item.subject}</td><td>{item.duration ?? item.status ?? item.table ?? item.plan ?? item.condition}</td>{columns.length > 2 && <><td>{item.date ?? item.commission ?? item.time}</td><td>{item.grade ?? item.condition ?? item.room}</td></>}</tr>)}</tbody></table></div>)}</div>; }
function DetailModal({ commission, onClose }: { commission: Commission | null; onClose: () => void }) { const [tab, setTab] = useState<'regularidad' | 'horarios'>('regularidad'); useEffect(() => { if (!commission) return; const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape); }, [commission, onClose]); if (!commission) return null; const schedule = scheduleForCommission(commission.commission); return <div className="modal-backdrop"><section className="legacy-modal" role="dialog" aria-modal="true" aria-labelledby="commission-modal-title"><button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button><h2 id="commission-modal-title">Comisión: {commission.commission}</h2><h3>{commission.subject}</h3><div className="modal-meta"><span>Clave sintética</span><span>{schedule?.roomStatus === 'MODIFICADA' ? 'Aula modificada' : 'Aula oficial'}</span></div><div className="tabs"><button className={tab === 'regularidad' ? 'selected' : ''} onClick={() => setTab('regularidad')}>Regularidad</button><button className={tab === 'horarios' ? 'selected' : ''} onClick={() => setTab('horarios')}>Horarios</button></div>{tab === 'regularidad' ? <div className="modal-list"><p>Condiciones <span>Cumplido por el alumno</span></p><p>No hay definida asistencia mínima</p><p>No hay definidos trabajos prácticos</p><p>No hay definidos exámenes parciales</p></div> : <div className="modal-list"><p>Día <span>{schedule?.day ?? 'No informado'}</span></p><p>Horario <span>{schedule?.time ?? 'No informado'}</span></p><p>Aula <span>{schedule?.room || 'No informada'}</span></p>{schedule?.roomStatus === 'MODIFICADA' && <p className="schedule-change-line">↻ {schedule.modificationNote} Antes: {schedule.originalRoom}</p>}<p>Docente <span>{commission.teacher}</span></p></div>}<button className="legacy-button small" onClick={onClose}>CERRAR</button></section></div>; }
function ExamModal({ exam, onClose }: { exam: Exam | null; onClose: () => void }) { useEffect(() => { if (!exam) return; const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape); }, [exam, onClose]); if (!exam) return null; return <div className="modal-backdrop"><section className="legacy-modal small-modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button><h2>{exam.subject}</h2><p>Mesas disponibles</p>{exam.tables.map((table) => <p className="modal-line" key={table}>{table}</p>)}<button className="legacy-button small" onClick={onClose}>CERRAR</button></section></div>; }
