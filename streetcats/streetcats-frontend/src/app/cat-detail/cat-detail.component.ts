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
  private route       = inject(ActivatedRoute);
  private apiService  = inject(ApiService);
  private authService = inject(AuthService);
  private router      = inject(Router);

  cat: Cat | null = null;
  comments: Comment[] = [];
  isLoading    = true;
  error        = '';

  // Comment form state
  newCommentText   = '';
  isPostingComment = false;
  commentError     = '';

  // Delete state
  isDeleting    = false;
  confirmDelete = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadAll(id);
    } else {
      this.error    = 'ID Gatto non valido.';
      this.isLoading = false;
    }
  }

  loadAll(id: number) {
    this.apiService.getCatById(id).subscribe({
      next: (cat) => {
        this.cat       = cat;
        this.isLoading = false;
        this.loadComments(id);
      },
      error: () => {
        this.error    = 'Impossibile caricare i dettagli del gatto.';
        this.isLoading = false;
      }
    });
  }

  loadComments(catId: number) {
    this.apiService.getCatComments(catId).subscribe({
      next: (c) => (this.comments = c),
      error: () => {}
    });
  }

  get isAuthenticated() {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      return false;
    }
  }

  get currentUserEmail() {
    const u = this.authService.currentUser();
    if (u !== null) {
      return u.email;
    } else {
      return '';
    }
  }

  get isOwnerOrAdmin() {
    if (this.cat === null) {
      return false;
    }
    const u = this.authService.currentUser();
    if (u === null) {
      return false;
    }
    if (u.email === this.cat.UserEmail) {
      return true;
    }
    if (u.role === 'admin') {
      return true;
    }
    return false;
  }

  // Invio commento 
  submitComment() {
    if (this.cat === null) {
      return;
    }
    const text = this.newCommentText.trim();
    if (text === '' || this.isPostingComment) {
      return;
    }

    this.isPostingComment = true;
    this.commentError     = '';

    this.apiService.addComment(this.cat.id, text).subscribe({
      next: (comment) => {
        this.comments.unshift({
          ...comment,
          UserEmail: this.currentUserEmail,
          createdAt: new Date().toISOString()
        });
        this.newCommentText   = '';
        this.isPostingComment = false;
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.commentError = err.error.error;
        } else {
          this.commentError = 'Errore durante l\'invio del commento.';
        }
        this.isPostingComment = false;
      }
    });
  }

  // Eliminazione gatto 
  deleteCat() {
    if (this.cat === null) {
      return;
    }
    this.isDeleting = true;
    this.apiService.deleteCat(this.cat.id).subscribe({
      next: () => {
        this.router.navigate(['/cats']);
      },
      error: () => {
        this.isDeleting = false;
      }
    });
  }

  //  Eliminazione commento 
  canDeleteComment(comment: Comment): boolean {
    if (this.isAuthenticated === false) {
      return false;
    }
    const u = this.authService.currentUser();
    if (u === null) {
      return false;
    }
    if (u.email === comment.UserEmail) {
      return true;
    }
    if (u.role === 'admin') {
      return true;
    }
    return false;
  }

  deleteComment(comment: Comment) {
    if (this.cat === null) {
      return;
    }
    this.apiService.deleteComment(this.cat.id, comment.id).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== comment.id);
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.commentError = err.error.error;
        } else {
          this.commentError = 'Impossibile eliminare il commento.';
        }
      }
    });
  }
}

