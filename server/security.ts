// implementa: {seguridad_4}, {seguridad_5}, {seguridad_6}, {seguridad_9}, {observabilidad_1}, {observabilidad_3}, {observabilidad_4}, {observabilidad_5}, {observabilidad_6}

import { randomBytes } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Role } from '../contracts/academic.js';

export const CSRF_COOKIE = 'my_iov_study_csrf';

export function csrfToken(): string { return randomBytes(24).toString('hex'); }

export function setCsrfCookie(reply: FastifyReply, token: string, secure: boolean): void {
  reply.setCookie(CSRF_COOKIE, token, { httpOnly: false, secure, sameSite: secure ? 'none' : 'lax', path: '/', maxAge: 8 * 60 * 60 });
}

export function csrfMatches(request: FastifyRequest): boolean {
  const cookie = request.cookies[CSRF_COOKIE];
  const header = request.headers['x-csrf-token'];
  return Boolean(cookie && typeof header === 'string' && header.length > 20 && cookie === header);
}

export function correlationId(request: FastifyRequest): string {
  const candidate = request.headers['x-request-id'];
  return typeof candidate === 'string' && /^[a-zA-Z0-9_-]{8,80}$/.test(candidate) ? candidate : request.id;
}

export function audit(event: string, request: FastifyRequest, result: 'ok' | 'denied' | 'error', role?: Role, actor?: string, extra: Record<string, unknown> = {}): void {
  const entry = { timestamp: new Date().toISOString(), level: result === 'ok' ? 'INFO' : 'WARN', event, actor: actor ? `synthetic:${actor}` : 'anonymous', role: role ?? 'UNKNOWN', resource: request.url.split('?')[0], result, correlationId: correlationId(request), ...extra };
  process.stdout.write(`${JSON.stringify(entry)}\n`);
}

export function auditSystem(event: string, result: 'ok' | 'error', extra: Record<string, unknown> = {}): void {
  process.stdout.write(`${JSON.stringify({ timestamp: new Date().toISOString(), level: result === 'ok' ? 'INFO' : 'ERROR', event, actor: 'system', role: 'SYSTEM', resource: 'server', result, correlationId: randomBytes(12).toString('hex'), ...extra })}\n`);
}
