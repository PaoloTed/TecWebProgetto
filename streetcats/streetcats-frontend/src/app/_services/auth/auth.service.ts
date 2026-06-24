import { Injectable } from '@angular/core';
import { User } from '../api/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'streetcats_token';
  private currentUserKey = 'streetcats_user';

  private _token: string | null = null;
  private _user: User | null = null;

  constructor() {
    this._token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.currentUserKey);
    if (userStr) {
      try {
        this._user = JSON.parse(userStr);
      } catch (e) {
        this._user = null;
      }
    }
  }

  setSession(token: string, user: User) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    this._token = token;
    this._user = user;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUserKey);
    this._token = null;
    this._user = null;
  }

  getToken(): string | null {
    return this._token;
  }

  currentUser(): User | null {
    return this._user;
  }

  isAuthenticated(): boolean {
    return this._token !== null && this._token !== '';
  }
}
