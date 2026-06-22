import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../_services/auth/auth.service';
import { ApiService } from '../_services/api/api.service';
import { Router } from '@angular/router';
import { User } from '../_services/api/user.type';

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

  user: User | null = null;
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
        this.isLoading = false;
        this.error = err.error?.error || 'Impossibile caricare il profilo';
      }
    });
  }
}
