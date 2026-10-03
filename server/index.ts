import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import bcrypt from 'bcryptjs';
import type { Role, SessionUser } from '../contracts/academic.js';
import { findSyntheticUser, publicUser, syntheticProfiles, syntheticUsers } from './seed.js';
import { createSession, destroySession, readSession, SESSION_COOKIE } from './session.js';
import { createNotice, findNotice, findStudentNotice, listNotices, listStudentNotices, manageExpiredNotice, markReviewed, publishNotice, restoreNoticeVersion, summary, updateNotice, type NoticeInput } from './notices.js';
import { listStudentNotifications, markStudentNotificationRead, recordNoticeEvent, syncNoticeEvents, unreadStudentNotificationCount } from './notifications.js';
import { listStudentSchedule } from './schedule.js';
import { documentForNotice } from './documents.js';
import { addNoticeToAgenda, addScheduleToAgenda, listAgenda, removeAgendaItem } from './agenda.js';
import { buildExport, type ExportFormat, type ExportType } from './exports.js';
import { audit, auditSystem, correlationId, csrfMatches, csrfToken, setCsrfCookie, CSRF_COOKIE } from './security.js';

// implementa: {etapa_1}, {funcion_1}, {funcion_13}, {funcion_30}, {seguridad_1}, {seguridad_4}, {entrada_1}, {entrada_2}
const app = Fastify({ logger: false });
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isLocalHttp = process.env.LOCAL_HTTP === 'true';
const port = Number(process.env.PORT ?? 3000);
const failedLogins = new Map<string, { attempts: number; blockedUntil: number }>();

// implementa: {seguridad_3}, {error_3}, {prueba_50}
function loginKey(matricula: string, email: string): string {
  return `${matricula.toLowerCase()}|${email.toLowerCase()}`;
}

function isLoginBlocked(key: string): boolean {
  const state = failedLogins.get(key);
  if (!state) return false;
  if (state.blockedUntil > Date.now()) return true;
  if (state.blockedUntil > 0) failedLogins.delete(key);
  return false;
}

function recordLoginFailure(key: string): void {
  const state = failedLogins.get(key) ?? { attempts: 0, blockedUntil: 0 };
  state.attempts += 1;
  if (state.attempts >= 5) state.blockedUntil = Date.now() + 60 * 1000;
  failedLogins.set(key, state);
}

await app.register(cookie);
await app.register(fastifyStatic, {
  root: path.join(root, 'dist'),
  prefix: '/',
});

app.addHook('onRequest', async (_request, reply) => {
  reply.header('Content-Security-Policy', "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors *; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; form-action 'self';");
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  reply.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  if (!isLocalHttp) reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
});

app.addHook('preHandler', async (request, reply) => {
  if (!request.url.startsWith('/api/') || request.method === 'GET' || request.url.startsWith('/api/auth/login')) return;
  if (!csrfMatches(request)) {
    audit('csrf_rechazado', request, 'denied');
    return reply.code(403).send({ error: 'No se pudo validar la seguridad de la solicitud. Actualizá la pantalla e intentá nuevamente.' });
  }
});

function sessionUser(request: FastifyRequest): SessionUser | null {
  const session = readSession(request.cookies[SESSION_COOKIE]);
  if (!session) return null;
  const user = syntheticUsers.get(session.userId);
  return user ? publicUser(user) : null;
}

// implementa: {proceso_1}, {funcion_30}, {error_5}
async function requireRole(request: FastifyRequest, reply: FastifyReply, role: Role): Promise<SessionUser | null> {
  const user = sessionUser(request);
  if (!user) {
    audit('permiso_denegado', request, 'denied');
    await reply.code(401).send({ error: 'Tu sesión expiró. Ingresá nuevamente para continuar.' });
    return null;
  }
  if (user.role !== role) {
    audit('permiso_denegado', request, 'denied', user.role, user.id);
    await reply.code(403).send({ error: 'No tenés permisos para acceder a esta sección.' });
    return null;
  }
  return user;
}

app.get('/api/health', async () => ({ ok: true, stage: 10, synthetic: true }));

app.get('/api/session', async (request) => {
  const user = sessionUser(request);
  return { authenticated: Boolean(user), user };
});

interface LoginBody {
  matricula?: string;
  email?: string;
  password?: string;
}

app.post<{ Body: LoginBody }>('/api/auth/login', async (request, reply) => {
  const matricula = request.body?.matricula?.trim() ?? '';
  const email = request.body?.email?.trim() ?? '';
  const password = request.body?.password ?? '';
  if (!matricula || !email || !password) {
    return reply.code(400).send({ error: 'Completá todos los campos obligatorios para ingresar.' });
  }

  const key = loginKey(matricula, email);
  if (isLoginBlocked(key)) {
    audit('login_fail', request, 'denied', undefined, undefined, { reason: 'rate_limited' });
    return reply.code(429).send({ error: 'Realizaste demasiados intentos. Esperá unos minutos o recuperá tu acceso.' });
  }

  const user = findSyntheticUser(matricula, email);
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !valid) {
    recordLoginFailure(key);
    audit('login_fail', request, 'denied', undefined, undefined, { reason: 'invalid_credentials' });
    return reply.code(401).send({ error: 'Los datos ingresados no permiten el acceso. Verificá tu matrícula, tu correo institucional y tu clave.' });
  }

  failedLogins.delete(key);
  const token = createSession(user.id, user.role);
  setCsrfCookie(reply, csrfToken(), !isLocalHttp);
  audit('login_ok', request, 'ok', user.role, user.id);
  reply.setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: !isLocalHttp,
    sameSite: isLocalHttp ? 'lax' : 'none',
    path: '/',
    maxAge: 8 * 60 * 60,
  });
  return { authenticated: true, user: publicUser(user), synthetic: true };
});

app.post('/api/auth/logout', async (request, reply) => {
  destroySession(request.cookies[SESSION_COOKIE]);
  reply.clearCookie(SESSION_COOKIE, { path: '/' });
  reply.clearCookie(CSRF_COOKIE, { path: '/' });
  audit('logout', request, 'ok');
  return { ok: true };
});

app.get('/api/student/profile', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  return { profile: syntheticProfiles.get(user.id) ?? null, synthetic: true };
});

app.get('/api/student/schedule', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  return { schedule: listStudentSchedule(), synthetic: true };
});

app.get('/api/student/agenda', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  return { agenda: listAgenda(user.id), synthetic: true };
});

interface AgendaBody { kind?: 'AVISO' | 'HORARIO'; sourceId?: string; }
app.post<{ Body: AgendaBody }>('/api/student/agenda', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  const kind = request.body?.kind;
  const sourceId = typeof request.body?.sourceId === 'string' ? request.body.sourceId.trim() : '';
  if (!sourceId || (kind !== 'AVISO' && kind !== 'HORARIO')) return reply.code(400).send({ error: 'Indicá un elemento válido para fijar en tu agenda.' });
  if (kind === 'AVISO') {
    const profile = syntheticProfiles.get(user.id);
    if (!profile) return reply.code(404).send({ error: 'No encontramos un perfil académico sintético para esta cuenta.' });
    const notice = findStudentNotice(sourceId, profile);
    if (!notice) return reply.code(404).send({ error: 'El aviso no está disponible para tu perfil.' });
    return reply.code(201).send({ item: addNoticeToAgenda(user.id, notice), synthetic: true });
  }
  const scheduleEntry = listStudentSchedule().find((entry) => entry.id === sourceId);
  if (!scheduleEntry) return reply.code(404).send({ error: 'El horario no está disponible para tu perfil.' });
  return reply.code(201).send({ item: addScheduleToAgenda(user.id, scheduleEntry), synthetic: true });
});

app.delete<{ Params: { id: string } }>('/api/student/agenda/:id', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  const item = removeAgendaItem(user.id, request.params.id);
  if (!item) return reply.code(404).send({ error: 'El elemento no está fijado en tu agenda.' });
  return { item, synthetic: true };
});

app.get('/api/student/notices', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  const profile = syntheticProfiles.get(user.id);
  if (!profile) return reply.code(404).send({ error: 'No encontramos un perfil académico sintético para esta cuenta.' });
  return { notices: listStudentNotices(profile), profile, synthetic: true };
});

app.get<{ Params: { id: string } }>('/api/student/notices/:id', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  const profile = syntheticProfiles.get(user.id);
  if (!profile) return reply.code(404).send({ error: 'No encontramos un perfil académico sintético para esta cuenta.' });
  const notice = findStudentNotice(request.params.id, profile);
  if (!notice) return reply.code(404).send({ error: 'Aviso no encontrado para tu perfil.' });
  return { notice, profile, synthetic: true };
});

app.get<{ Params: { id: string } }>('/api/student/notices/:id/document', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  const profile = syntheticProfiles.get(user.id);
  if (!profile) return reply.code(404).send({ error: 'No encontramos un perfil académico sintético para esta cuenta.' });
  const notice = findStudentNotice(request.params.id, profile);
  if (!notice) return reply.code(404).send({ error: 'Documento no encontrado para tu perfil.' });
  const document = documentForNotice(notice);
  if (!document) return reply.code(404).send({ error: 'Este aviso no tiene un documento disponible.' });
  return { document, noticeId: notice.id, synthetic: true };
});

app.get('/api/student/notifications', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  const profile = syntheticProfiles.get(user.id);
  if (!profile) return reply.code(404).send({ error: 'No encontramos un perfil académico sintético para esta cuenta.' });
  syncNoticeEvents(listNotices(), [profile]);
  return { notifications: listStudentNotifications(user.id), unreadCount: unreadStudentNotificationCount(user.id), synthetic: true };
});

app.post<{ Params: { id: string } }>('/api/student/notifications/:id/read', async (request, reply) => {
  const user = await requireRole(request, reply, 'ESTUDIANTE');
  if (!user) return;
  const notification = markStudentNotificationRead(request.params.id, user.id);
  if (!notification) return reply.code(404).send({ error: 'Notificación no encontrada para tu cuenta.' });
  return { notification, unreadCount: unreadStudentNotificationCount(user.id), synthetic: true };
});

app.get('/api/bedelia/summary', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  return { role: user.role, counts: summary(), synthetic: true };
});

interface NoticeBody extends NoticeInput { reason?: string; }

function validateNoticeBody(body: NoticeBody | undefined): string | null {
  if (!body || typeof body !== 'object') return 'El contenido del aviso no es válido.';
  const fields: Array<keyof NoticeBody> = ['title', 'content', 'category', 'publicationDate', 'expirationDate', 'audienceType', 'audienceValue', 'career', 'level', 'subject', 'source', 'attachmentName', 'reason'];
  for (const field of fields) {
    const value = body[field];
    if (value !== undefined && typeof value !== 'string') return `El campo ${String(field)} no es válido.`;
    if (typeof value === 'string' && value.length > 20000) return `El campo ${String(field)} supera el máximo permitido.`;
  }
  return null;
}

// implementa: {funcion_13}, {funcion_14}, {funcion_15}, {funcion_16}, {funcion_17}, {funcion_18}, {funcion_19}, {funcion_20}, {funcion_21}, {funcion_22}, {funcion_23}, {funcion_24}, {funcion_28}, {funcion_30}, {criterio_aceptacion_11}, {criterio_aceptacion_12}, {criterio_aceptacion_13}, {criterio_aceptacion_14}, {criterio_aceptacion_15}, {criterio_aceptacion_16}, {criterio_aceptacion_17}, {criterio_aceptacion_18}, {criterio_aceptacion_20}, {prueba_21}, {prueba_23}, {prueba_24}, {prueba_25}
app.get('/api/bedelia/notices', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  return { notices: listNotices(), counts: summary(), synthetic: true };
});

app.get<{ Params: { id: string } }>('/api/bedelia/notices/:id', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  const notice = findNotice(request.params.id);
  if (!notice) return reply.code(404).send({ error: 'Aviso no encontrado.' });
  return { notice, synthetic: true };
});

app.post<{ Body: NoticeBody }>('/api/bedelia/notices', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  const invalid = validateNoticeBody(request.body);
  if (invalid) return reply.code(400).send({ error: invalid });
  audit('aviso_creado', request, 'ok', user.role, user.id);
  return reply.code(201).send({ notice: createNotice(request.body ?? {}, user.id), synthetic: true });
});

app.put<{ Params: { id: string }; Body: NoticeBody }>('/api/bedelia/notices/:id', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  const invalid = validateNoticeBody(request.body);
  if (invalid) return reply.code(400).send({ error: invalid });
  const notice = updateNotice(request.params.id, request.body ?? {}, user.id, request.body?.reason ?? 'Actualización sintética');
  if (!notice) return reply.code(404).send({ error: 'Aviso no encontrado.' });
  audit('aviso_actualizado', request, 'ok', user.role, user.id, { noticeId: notice.id, version: notice.version });
  return { notice, synthetic: true };
});

app.post<{ Params: { id: string } }>('/api/bedelia/notices/:id/review', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  const notice = markReviewed(request.params.id, user.id);
  if (!notice) return reply.code(404).send({ error: 'Aviso no encontrado.' });
  return { notice, synthetic: true };
});

app.post<{ Params: { id: string } }>('/api/bedelia/notices/:id/publish', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  const result = publishNotice(request.params.id, user.id);
  if (result.errors) return reply.code(400).send({ error: `No se puede publicar el aviso. Revisá: ${result.errors.join(', ')}.` });
  if (result.notice) recordNoticeEvent(result.notice, [...syntheticProfiles.values()], result.notice.state === 'ACTUALIZADO' ? 'ACTUALIZACION' : 'PUBLICACION');
  if (result.notice) audit(result.notice.state === 'ACTUALIZADO' ? 'aviso_actualizado' : 'aviso_publicado', request, 'ok', user.role, user.id, { noticeId: result.notice.id, version: result.notice.version });
  return { notice: result.notice, synthetic: true };
});

app.post<{ Params: { id: string } }>('/api/bedelia/notices/:id/manage-expired', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  const result = manageExpiredNotice(request.params.id, user.id);
  if (result.error) return reply.code(result.error === 'Aviso no encontrado.' ? 404 : 400).send({ error: result.error });
  audit('aviso_vencido', request, 'ok', user.role, user.id, { noticeId: request.params.id });
  return { notice: result.notice, synthetic: true };
});

app.post<{ Params: { id: string; version: string }; Body: { reason?: string } }>('/api/bedelia/notices/:id/restore/:version', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  const version = Number(request.params.version);
  const reason = typeof request.body?.reason === 'string' ? request.body.reason : '';
  if (!Number.isInteger(version) || version < 1) return reply.code(400).send({ error: 'Indicá una versión válida para restaurar.' });
  const result = restoreNoticeVersion(request.params.id, version, user.id, reason);
  if (result.error) return reply.code(result.error === 'Aviso no encontrado.' ? 404 : 400).send({ error: result.error });
  audit('version_restaurada', request, 'ok', user.role, user.id, { noticeId: request.params.id, version });
  return { notice: result.notice, synthetic: true };
});

app.get<{ Querystring: { type?: string; format?: string } }>('/api/bedelia/exports', async (request, reply) => {
  const user = await requireRole(request, reply, 'BEDELIA');
  if (!user) return;
  const allowedTypes: ExportType[] = ['avisos', 'historial', 'horarios', 'fuentes', 'documentacion'];
  const allowedFormats: ExportFormat[] = ['json', 'csv'];
  const type = request.query.type as ExportType;
  const format = request.query.format as ExportFormat;
  if (!allowedTypes.includes(type) || !allowedFormats.includes(format)) return reply.code(400).send({ error: 'Elegí un tipo y formato de exportación válidos.' });
  const file = buildExport(type, format);
  audit('exportacion_generada', request, 'ok', user.role, user.id, { type, format });
  return reply.header('Content-Type', file.contentType).header('Content-Disposition', `attachment; filename="${file.filename}"`).send(file.body);
});

app.setNotFoundHandler(async (request, reply) => {
  if (request.url.startsWith('/api/')) {
    return reply.code(404).send({ error: 'Ruta no encontrada.' });
  }
  return reply.sendFile('index.html');
});

app.setErrorHandler(async (_error, request, reply) => {
  const id = correlationId(request);
  audit('error_inesperado', request, 'error', undefined, undefined, { errorId: id });
  return reply.code(500).send({ error: `Ocurrió un problema inesperado. Ya fue registrado. Identificador: ${id}. Intentá nuevamente.` });
});

await app.listen({ port, host: '0.0.0.0' });
auditSystem('inicio_aplicacion', 'ok', { stage: 10, port });
