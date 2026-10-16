export type Role = 'student' | 'manager';

export interface Compte {
  id: number;
  nom: string;
  role: Role;
}
