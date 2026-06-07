import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthState } from './auth-state.type';
import { User } from '../api/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'streetcats_token';
  private currentUserKey = 'streetcats_user';

  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUserFromStorage(),
    token: this.getTokenFromStorage(),
    isAuthenticated: this.verifyToken(this.getTokenFromStorage())
  });

  currentUser = computed(() => this.authState().user);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

  constructor() {
    effect(() => {
      const token = this.authState().token;
      const user = this.authState().user;
      if (token !== null) {
        localStorage.setItem(this.tokenKey, token);
      } else {
        localStorage.removeItem(this.tokenKey);
      }
      if (user !== null) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.currentUserKey);
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

  getToken(): string | null {
    return this.authState().token;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.currentUserKey);
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
          return false;
        } else {
          return true;
        }
      } catch (error) {
        return false;
      }
    }
    return false;
  }
}

