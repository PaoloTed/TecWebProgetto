import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'streetcats_token';
  private currentUserKey = 'streetcats_user';

  // Signals for reactive state
  public readonly isAuthenticated = signal<boolean>(false);
  public readonly currentUser = signal<any>(null);

  constructor() {
    this.checkInitialState();
  }

  private checkInitialState() {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.currentUserKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.isAuthenticated.set(true);
        this.currentUser.set(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  setSession(token: string, user: any) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    this.isAuthenticated.set(true);
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUserKey);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
