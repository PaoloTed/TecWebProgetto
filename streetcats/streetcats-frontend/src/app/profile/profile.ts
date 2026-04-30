import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../_services/auth/auth.service';
import { ApiService } from '../_services/api/api.service';
import { Router } from '@angular/router';
import { MarkdownPipe } from '../_pipes/markdown/markdown.pipe';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, DatePipe, MarkdownPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  user: any = null;
  isLoading = true;
  error = '';

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
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
        this.error = err.error?.error || 'Impossibile caricare il profilo.';
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
    if (!this.user?.createdAt) return '—';
    const d = new Date(this.user.createdAt);
    return d.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
