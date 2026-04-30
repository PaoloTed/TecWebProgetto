import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  user: any = null;
  isLoading = true;
  error = '';

  ngOnInit() {
    this.user = this.authService.currentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchProfile();
  }

  fetchProfile() {
    this.http.get<any>('http://localhost:3000/profile').subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Impossibile caricare il profilo.';
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
