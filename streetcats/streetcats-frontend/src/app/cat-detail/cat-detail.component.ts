import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../_services/api/api.service';
import { AuthService } from '../_services/auth/auth.service';
import { Router } from '@angular/router';
import { MarkdownPipe } from '../_pipes/markdown/markdown.pipe';
import { MapComponent } from '../map/map.component';
import { Cat } from '../_services/api/cat.type';
import { Comment } from '../_services/api/comment.type';

@Component({
  selector: 'app-cat-detail',
  imports: [RouterLink, DatePipe, DecimalPipe, FormsModule, MarkdownPipe, MapComponent],
  templateUrl: './cat-detail.component.html',
  styleUrl: './cat-detail.component.scss'
})
export class CatDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cat: Cat | null = null;
  comments: Comment[] = [];
  error = '';

  newCommentText = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCatInfo(id);
    } else {
      this.error = 'ID Gatto non valido.';
    }
  }

  loadCatInfo(id: number) {
    this.apiService.getCatById(id).subscribe({
      next: (cat) => {
        this.cat = cat;
        this.loadComments(id);
      },
      error: () => {
        this.error = 'Impossibile caricare i dettagli del gatto.';
      }
    });
  }

  loadComments(catId: number) {
    this.apiService.getCatComments(catId).subscribe({
      next: (c) => (this.comments = c),
      error: () => { }
    });
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get isOwnerOrAdmin() {
    if (!this.cat) return false;
    const u = this.authService.currentUser();
    return u !== null && (u.email === this.cat.UserEmail || u.role === 'admin');
  }

  // Invio commento 
  submitComment() {
    const text = this.newCommentText.trim();
    if (!this.cat || !text) return;

    this.apiService.addComment(this.cat.id, text).subscribe({
      next: () => {
        this.loadComments(this.cat!.id);
        this.newCommentText = '';
      },
      error: (err) => {
        alert(err.error?.error || "Errore durante l'invio del commento.");
      }
    });
  }

  // Eliminazione gatto 
  deleteCat() {
    if (!this.cat) return;
    this.apiService.deleteCat(this.cat.id).subscribe({
      next: () => this.router.navigate(['/cats']),
      error: () => { }
    });
  }

}

