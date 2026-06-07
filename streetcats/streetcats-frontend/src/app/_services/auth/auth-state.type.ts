import { User } from '../api/user.type';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
