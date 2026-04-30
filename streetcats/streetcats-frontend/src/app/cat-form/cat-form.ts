import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../_services/api/api.service';

@Component({
  selector: 'app-cat-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cat-form.html',
  styleUrl: './cat-form.scss'
})
export class CatForm {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);

  catForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.catForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      color: [''],
      size: [''],
      address: ['', Validators.required],
      neutered: [false]
    });
  }

  onSubmit() {
    if (this.catForm.invalid) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    // Mocking lat e long for now
    const catData = {
      ...this.catForm.value,
      latitude: 45.0,
      longitude: 9.0
    };

    this.apiService.createCat(catData).subscribe({
      next: (res) => {
        this.router.navigate(['/cats', res.id || res.cat?.id || '']);
      },
      error: (err) => {
        this.errorMessage = 'Errore durante la creazione della segnalazione.';
        this.isLoading = false;
      }
    });
  }
}
