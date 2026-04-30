import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  // Auth endpoints
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth`, credentials);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profile`);
  }

  // Cats endpoints
  getCats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cats`);
  }

  getCatById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cats/${id}`);
  }

  createCat(catData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cats`, catData);
  }

  // Comments endpoints
  getCatComments(catId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cats/${catId}/comments`);
  }

  addComment(catId: number, text: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cats/${catId}/comments`, { text });
  }

  deleteComment(catId: number, commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cats/${catId}/comments/${commentId}`);
  }

  deleteCat(catId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cats/${catId}`);
  }
}
