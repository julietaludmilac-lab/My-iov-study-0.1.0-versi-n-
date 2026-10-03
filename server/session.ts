import { randomBytes } from 'node:crypto';
import type { Role } from '../contracts/academic.js';

// implementa: {proceso_1}, {seguridad_1}, {seguridad_4}, {funcion_1}, {funcion_13}
export const SESSION_COOKIE = 'my_iov_study_session';
const sessions = new Map<string, { userId: string; role: Role; createdAt: number }>();

export function createSession(userId: string, role: Role): string {
  const token = randomBytes(32).toString('hex');
  sessions.set(token, { userId, role, createdAt: Date.now() });
  return token;
}

export function readSession(token: string | undefined): { userId: string; role: Role } | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  const maxAgeMs = 8 * 60 * 60 * 1000;
  if (Date.now() - session.createdAt > maxAgeMs) {
    sessions.delete(token);
    return null;
  }
  return { userId: session.userId, role: session.role };
}

export function destroySession(token: string | undefined): void {
  if (token) sessions.delete(token);
}
