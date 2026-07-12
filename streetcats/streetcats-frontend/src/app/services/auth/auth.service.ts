import { Injectable, signal, computed, WritableSignal, effect } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { User } from '../../type/user.type';
import { AuthState } from './auth-state.type';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.loadUserFromStorage(),
    token: this.loadTokenFromStorage(),
    isAuthenticated: this.verifyToken(this.loadTokenFromStorage())
  });

  isAuthenticated = computed(() => this.authState().isAuthenticated);
  currentUser = computed(() => this.authState().user);
  getToken = computed(() => this.authState().token);

  constructor() {
    effect(() => {
      const token = this.authState().token;
      const user = this.authState().user;

      if (token !== null) {
        localStorage.setItem('streetcats_token', token);
      } else {
        localStorage.removeItem('streetcats_token');
      }

      if (user !== null) {
        localStorage.setItem('streetcats_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('streetcats_user');
      }
    });
  }

  setSession(token: string, user: User) {
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    });
  }

  logout() {
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }

  private loadTokenFromStorage(): string | null {
    return localStorage.getItem('streetcats_token');
  }

  private loadUserFromStorage(): User | null {
    const userStr = localStorage.getItem('streetcats_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  verifyToken(token: string | null): boolean {
    if (token !== null) {
      try {
        const decodedToken = jwtDecode(token);
        const expiration = decodedToken.exp;
        if (expiration === undefined || Date.now() >= expiration * 1000) {
          return false; // scaduto
        } else {
          return true; // non scaduto
        }
      } catch (error) {
        return false; // token invalido o malformato
      }
    }
    return false;
  }
}
