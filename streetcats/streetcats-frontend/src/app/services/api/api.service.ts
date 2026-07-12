import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cat } from '../../type/cat.type';
import { Comment } from '../../type/comment.type';
import { User } from '../../type/user.type';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  // Usa l'ip da cui è stato caricato il sito per il backend
  // Usando localhost funziona solo sul pc su cui è in esecuzione il frontend e backend
  private ip = `http://${window.location.hostname}:3000`;

  // Auth endpoints
  login(email: string, password: string): Observable<{ message: string; token: string; user: User }> {
    return this.http.post<{ message: string; token: string; user: User }>(this.ip + '/auth', { email: email, password: password });
  }

  signup(userName: string, email: string, password: string): Observable<{ message: string; token: string; user: User }> {
    return this.http.post<{ message: string; token: string; user: User }>(this.ip + '/signup', { userName: userName, email: email, password: password });
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(this.ip + '/profile');
  }

  // Cats endpoints
  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(this.ip + '/cats');
  }

  getCatById(id: number): Observable<Cat> {
    return this.http.get<Cat>(this.ip + '/cats/' + id);
  }

  createCat(catData: any): Observable<Cat> {
    return this.http.post<Cat>(this.ip + '/cats', catData);
  }

  updateCat(id: number, catData: any): Observable<Cat> {
    return this.http.put<Cat>(this.ip + '/cats/' + id, catData);
  }

  deleteCat(catId: number): Observable<any> {
    return this.http.delete<any>(this.ip + '/cats/' + catId);
  }

  // Comments endpoints
  getCatComments(catId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.ip + '/cats/' + catId + '/comments');
  }

  addComment(catId: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(this.ip + '/cats/' + catId + '/comments', { text: text });
  }

  deleteComment(catId: number, commentId: number): Observable<any> {
    return this.http.delete<any>(this.ip + '/cats/' + catId + '/comments/' + commentId);
  }

}
