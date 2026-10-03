import type { AcademicProfile, Role, SessionUser } from '../contracts/academic';

// implementa: {funcion_1}, {funcion_13}, {funcion_30}, {pantalla_1}, {pantalla_10}
export type { AcademicProfile, Role, SessionUser };

export interface SessionState {
  authenticated: boolean;
  user: SessionUser | null;
}

export interface NavigationItem {
  label: string;
  path: string;
  roles: Role[];
}
