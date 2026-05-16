export type UserRole = 'admin' | 'salesUser';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface CurrentUserResponse {
  user: User;
}
