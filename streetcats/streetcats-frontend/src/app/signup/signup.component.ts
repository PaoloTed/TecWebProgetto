import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';
import { ApiService } from '../_services/api/api.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class Signup {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  form = inject(FormBuilder).group({
    userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';

    const { userName, email, password } = this.form.value;
    this.apiService.signup({ userName, email, password }).subscribe({
      next: (res) => {
        this.authService.setSession(res.token, res.user);
        this.router.navigate(['/cats']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Errore durante la registrazione.';
        this.isLoading = false;
      }
    });
  }
}
