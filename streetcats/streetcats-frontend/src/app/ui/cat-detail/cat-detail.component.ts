import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api/api.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MarkdownPipe } from '../../pipes/markdown/markdown.pipe';
import { MapComponent } from '../map/map.component';
import { Cat } from '../../type/cat.type';
import { Comment } from '../../type/comment.type';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

  cat: Cat | null = null;
  comments: Comment[] = [];

  newCommentText = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCatInfo(id);
    } else {
      this.toastr.error('ID Gatto non valido.', 'Errore');
      this.router.navigate(['/cats']);
    }
  }

  loadCatInfo(id: number) {
    this.apiService.getCatById(id).subscribe({
      next: (catRecived) => {
        this.cat = catRecived;
        this.loadComments(id);
      },
      error: () => {
        this.toastr.error('Impossibile caricare i dettagli del gatto.', 'Errore');
        this.router.navigate(['/cats']);
      }
    });
  }

  loadComments(catId: number) {
    this.apiService.getCatComments(catId).subscribe({
      next: (commentsRecived) => {
        this.comments = commentsRecived;
      },
      error: () => {
        this.toastr.error('Impossibile caricare i commenti del gatto.', 'Errore');
        this.router.navigate(['/cats']);
      }
    });
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get isOwnerOrAdmin() {
    if (!this.cat) return false;
    const currentUser = this.authService.currentUser();
    return currentUser !== null && (currentUser.email === this.cat.UserEmail || currentUser.role === 'admin');
  }

  // Invio commento
  submitComment() {
    const text = this.newCommentText.trim();
    if (!this.cat || !text) return;

    this.apiService.addComment(this.cat.id, text).subscribe({
      next: () => {
        this.loadComments(this.cat!.id);
        this.newCommentText = '';
        this.toastr.success('Commento pubblicato!', 'Successo');
      },
      error: (response) => {
        if (response.error.errorBackEnd) {
          this.toastr.error(response.error.errorBackEnd, 'Errore');
        } else {
          this.toastr.error("Errore durante l'invio del commento.", 'Errore');
        }
      }
    });
  }

  // Eliminazione gatto
  deleteCat() {
    if (!this.cat) return;
    this.apiService.deleteCat(this.cat.id).subscribe({
      next: () => {
        this.toastr.success('Segnalazione eliminata.', 'Eliminato');
        this.router.navigate(['/cats']);
      },
      error: () => {
        this.toastr.error('Errore durante eliminazione.', 'Errore');
      }
    });
  }
}
