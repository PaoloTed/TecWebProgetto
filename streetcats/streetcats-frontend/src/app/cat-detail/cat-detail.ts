import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../_services/api/api.service';
import { AuthService } from '../_services/auth/auth.service';
import { Router } from '@angular/router';
import { MarkdownPipe } from '../_pipes/markdown/markdown.pipe';
import { applyMarkdown } from '../_utils/markdown-toolbar';

@Component({
  selector: 'app-cat-detail',
  imports: [RouterLink, DatePipe, FormsModule, MarkdownPipe],
  templateUrl: './cat-detail.html',
  styleUrl: './cat-detail.scss'
})
export class CatDetail implements OnInit {
  private route       = inject(ActivatedRoute);
  private apiService  = inject(ApiService);
  private authService = inject(AuthService);
  private router      = inject(Router);

  @ViewChild('commentArea') commentArea!: ElementRef<HTMLTextAreaElement>;

  cat: any     = null;
  comments: any[] = [];
  isLoading    = true;
  error        = '';

  // Comment form state
  newCommentText   = '';
  isPostingComment = false;
  commentError     = '';
  showPreview      = false;

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

  get isAuthenticated()  { return this.authService.isAuthenticated(); }
  get currentUserEmail() { return this.authService.currentUser()?.email; }

  get isOwnerOrAdmin() {
    if (!this.cat) return false;
    const u = this.authService.currentUser();
    return u && (u.email === this.cat.UserEmail || u.role === 'admin');
  }

  // ── Toolbar Markdown ─────────────────────────────────────────
  applyFmt(before: string, after: string, placeholder: string) {
    const ta = this.commentArea?.nativeElement;
    if (!ta) return;
    this.newCommentText = applyMarkdown(ta, before, after, placeholder);
  }

  bold()   { this.applyFmt('**', '**', 'testo in grassetto'); }
  italic() { this.applyFmt('_', '_', 'testo in corsivo'); }
  link()   { this.applyFmt('[', '](https://)', 'testo del link'); }

  // ── Invio commento ────────────────────────────────────────────
  submitComment() {
    const text = this.newCommentText.trim();
    if (!text || this.isPostingComment) return;

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
        this.showPreview      = false;
        this.isPostingComment = false;
      },
      error: (err) => {
        this.commentError     = err.error?.error || 'Errore durante l\'invio del commento.';
        this.isPostingComment = false;
      }
    });
  }

  // ── Eliminazione gatto ────────────────────────────────────────
  deleteCat() {
    if (!this.confirmDelete) { this.confirmDelete = true; return; }
    this.isDeleting = true;
    this.apiService.deleteCat(this.cat.id).subscribe({
      next: () => this.router.navigate(['/cats']),
      error: () => { this.isDeleting = false; this.confirmDelete = false; }
    });
  }
  cancelDelete() { this.confirmDelete = false; }

  // ── Eliminazione commento ─────────────────────────────────────
  canDeleteComment(comment: any): boolean {
    if (!this.isAuthenticated) return false;
    const u = this.authService.currentUser();
    return u && (u.email === comment.UserEmail || u.role === 'admin');
  }

  deleteComment(comment: any) {
    this.apiService.deleteComment(this.cat.id, comment.id).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== comment.id);
      },
      error: (err) => {
        this.commentError = err.error?.error || 'Impossibile eliminare il commento.';
      }
    });
  }
}
