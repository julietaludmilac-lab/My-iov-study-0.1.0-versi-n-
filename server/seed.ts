import bcrypt from 'bcryptjs';
import type { AcademicProfile, Role, SessionUser } from '../contracts/academic.js';

// implementa: {entrada_14}, {fuente_9}, {concepto_1}, {concepto_2}, {funcion_1}, {funcion_13}
export interface SyntheticUserRecord extends SessionUser {
  passwordHash: string;
}

interface SeedDefinition {
  id: string;
  matricula: string;
  email: string;
  role: Role;
  displayName: string;
  seedPassword: string;
}

const definitions: SeedDefinition[] = [
  {
    id: 'synthetic-student-001',
    matricula: 'A-2026-001',
    email: 'estudiante.demo@ucsf.test',
    role: 'ESTUDIANTE',
    displayName: 'Estudiante de demostración',
    seedPassword: 'Estudiante2026A',
  },
  {
    id: 'synthetic-bedelia-001',
    matricula: 'B-ADMIN-001',
    email: 'bedelia.demo@ucsf.test',
    role: 'BEDELIA',
    displayName: 'Personal de Bedelía de demostración',
    seedPassword: 'Bedelia2026A',
  },
];

export const syntheticUsers = new Map<string, SyntheticUserRecord>(
  definitions.map((definition) => {
    const { seedPassword, ...safeUser } = definition;
    return [
      definition.id,
      {
        ...safeUser,
        synthetic: true,
        passwordHash: bcrypt.hashSync(seedPassword, 10),
      },
    ];
  }),
);

export function findSyntheticUser(matricula: string, email: string): SyntheticUserRecord | null {
  for (const user of syntheticUsers.values()) {
    if (user.matricula === matricula && user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
  }
  return null;
}

export function publicUser(user: SyntheticUserRecord): SessionUser {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

// implementa: {entrada_13}, {proceso_2}, {concepto_16}
export const syntheticProfiles = new Map<string, AcademicProfile>([
  [
    'synthetic-student-001',
    {
      userId: 'synthetic-student-001',
      matricula: 'A-2026-001',
      carrera: 'Licenciatura sintética en Gestión Institucional',
      nivel: '2.º año',
      asignaturas: ['Organización Universitaria', 'Metodologías de Estudio'],
      synthetic: true,
    },
  ],
]);
