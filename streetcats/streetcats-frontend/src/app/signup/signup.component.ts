import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';
import { ApiService } from '../_services/api/api.service';

/** Validatore custom: verifica che password e conferma corrispondano */
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmPassword');
  if (passwordControl === null || confirmPasswordControl === null) {
    return null;
  }
  const pw = passwordControl.value;
  const cpw = confirmPasswordControl.value;
  if (pw && cpw && pw !== cpw) {
    return { passwordMismatch: true };
  } else {
    return null;
  }
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class Signup {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private apiService  = inject(ApiService);
  private router      = inject(Router);

  form: FormGroup;
  isLoading   = false;
  errorMessage = '';

  constructor() {
    this.form = this.fb.group({
      userName:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get pwMismatch() {
    const confirmPasswordControl = this.form.get('confirmPassword');
    if (confirmPasswordControl === null) {
      return false;
    }
    if (this.form.hasError('passwordMismatch') && confirmPasswordControl.touched) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading   = true;
    this.errorMessage = '';

    const { userName, email, password } = this.form.value;
    this.apiService.signup({ userName, email, password }).subscribe({
      next: (res) => {
        this.authService.setSession(res.token, res.user);
        this.router.navigate(['/cats']);
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Errore durante la registrazione.';
        }
        this.isLoading = false;
      }
    });
  }
}
