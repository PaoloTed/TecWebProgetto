import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';
import { Router } from '@angular/router';
import { User } from '../../type/user.type';
import { Cat } from '../../type/cat.type';
import { Comment } from '../../type/comment.type';
import { ToastrService } from 'ngx-toastr';



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
  private toastr = inject(ToastrService);

  user: User | null = null;
  recentCats: Cat[] = [];
  recentComments: Comment[] = [];

  ngOnInit() {
    this.getUserProfileInfo();
  }

  getUserProfileInfo() {
    this.apiService.getProfile().subscribe({
      next: (profileDataRecived: any) => {
        this.user = {
          userName: profileDataRecived.userName,
          email: profileDataRecived.email,
          role: profileDataRecived.role,
          createdAt: profileDataRecived.createdAt
        };
        this.recentCats = profileDataRecived.recentCats || [];
        this.recentComments = profileDataRecived.recentComments || [];
      },
      error: (response) => {
        if (response.error.errorBackEnd) {
          this.toastr.error(response.error.errorBackEnd, 'Errore profilo');
        } else {
          this.toastr.error('Impossibile caricare il profilo', 'Errore');
        }
        this.router.navigate(['/cats']);
      }
    });
  }
}
