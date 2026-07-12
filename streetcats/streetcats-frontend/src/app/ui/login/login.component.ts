import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class Login {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.warning('Per favore compila tutti i campi obbligatori', 'Campi mancanti');
      return;
    }

    this.apiService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
      next: (res) => {
        this.authService.setSession(res.token, res.user);
        this.toastr.success('Benvenuto su StreetCats!', 'Accesso effettuato');
        this.router.navigate(['/']);
      },
      error: (response) => {
        if (response.error.errorBackEnd) {
          this.toastr.error(response.error.errorBackEnd, 'Errore di accesso');
        } else {
          this.toastr.error('Errore durante il login', 'Errore');
        }
      }
    });
  }
}
