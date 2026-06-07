import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../_services/auth/auth.service';
import { ApiService } from '../_services/api/api.service';
import { Router } from '@angular/router';
import { Cat } from '../_services/api/cat.type';
import { Comment } from '../_services/api/comment.type';
import { UserProfile } from '../_services/api/user.type';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  user: UserProfile | null = null;
  isLoading = true;
  error = '';

  ngOnInit() {
    if (this.authService.isAuthenticated() === false) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchProfile();
  }

  fetchProfile() {
    this.apiService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.error = err.error.error;
        } else {
          this.error = 'Impossibile caricare il profilo.';
        }
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/cats']);
  }

  /** Restituisce la data di iscrizione formattata in testo leggibile */
  getMemberSince(): string {
    if (this.user === null || this.user.createdAt === undefined) {
      return '—';
    }
    const d = new Date(this.user.createdAt);
    return d.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
