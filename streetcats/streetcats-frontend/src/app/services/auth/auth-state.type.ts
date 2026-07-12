import { User } from '../../type/user.type';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
