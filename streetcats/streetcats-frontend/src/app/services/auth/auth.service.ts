import { Injectable } from '@angular/core';
import { User } from '../api/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'streetcats_token';
  private currentUserKey = 'streetcats_user';

  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.currentUserKey);
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        this.user = null;
      }
    }
  }

  setSession(token: string, user: User) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    this.token = token;
    this.user = user;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUserKey);
    this.token = null;
    this.user = null;
  }

  getToken(): string | null {
    return this.token;
  }

  currentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
