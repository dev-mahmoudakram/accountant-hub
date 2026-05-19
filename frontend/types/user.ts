export type UserRole = 'accountant' | 'client';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
