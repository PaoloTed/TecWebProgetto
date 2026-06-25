import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cat } from './cat.type';
import { Comment } from './comment.type';
import { User } from './user.type';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  // Auth endpoints
  login(credentials: any): Observable<{ message: string; token: string; user: User }> {
    return this.http.post<{ message: string; token: string; user: User }>('http://localhost:3000/auth', credentials);
  }

  signup(userData: any): Observable<{ message: string; token: string; user: User }> {
    return this.http.post<{ message: string; token: string; user: User }>('http://localhost:3000/signup', userData);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/profile');
  }

  // Cats endpoints
  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>('http://localhost:3000/cats');
  }

  getCatById(id: number): Observable<Cat> {
    return this.http.get<Cat>('http://localhost:3000/cats/' + id);
  }

  createCat(catData: any): Observable<Cat> {
    return this.http.post<Cat>('http://localhost:3000/cats', catData);
  }

  updateCat(id: number, catData: any): Observable<Cat> {
    return this.http.put<Cat>('http://localhost:3000/cats/' + id, catData);
  }

  // Comments endpoints
  getCatComments(catId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>('http://localhost:3000/cats/' + catId + '/comments');
  }

  addComment(catId: number, text: string): Observable<Comment> {
    return this.http.post<Comment>('http://localhost:3000/cats/' + catId + '/comments', { text });
  }

  deleteComment(catId: number, commentId: number): Observable<any> {
    return this.http.delete<any>('http://localhost:3000/cats/' + catId + '/comments/' + commentId);
  }

  deleteCat(catId: number): Observable<any> {
    return this.http.delete<any>('http://localhost:3000/cats/' + catId);
  }
}
