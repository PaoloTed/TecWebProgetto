import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

  form = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (this.form.invalid) {
      this.toastr.warning('Per favore compila tutti i campi obbligatori', 'Campi mancanti');
      return;
    }

    this.apiService.signup(this.form.value.userName!, this.form.value.email!, this.form.value.password!).subscribe({
      next: (res) => {
        this.authService.setSession(res.token, res.user);
        this.toastr.success('Account creato con successo!', 'Benvenuto');
        this.router.navigate(['/cats']);
      },
      error: (response) => {
        if (response.error.errorBackEnd) {
          this.toastr.error(response.error.errorBackEnd, 'Errore di registrazione');
        } else {
          this.toastr.error('Errore durante la registrazione.', 'Errore');
        }
      }
    });
  }
}
