// implementa: {entrada_13}, {concepto_16}, {concepto_17}, {funcion_1}, {funcion_13}

export type Role = 'ESTUDIANTE' | 'BEDELIA';

export interface AcademicProfile {
  userId: string;
  matricula: string;
  carrera: string;
  nivel: string;
  asignaturas: string[];
  synthetic: true;
}

export interface AcademicAdapter {
  getProfile(userId: string): Promise<AcademicProfile | null>;
}

export interface SessionUser {
  id: string;
  matricula: string;
  email: string;
  role: Role;
  displayName: string;
  synthetic: true;
}
