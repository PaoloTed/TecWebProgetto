import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../_services/api/api.service';
import { MarkdownPipe } from '../_pipes/markdown/markdown.pipe';
import { applyMarkdown } from '../_utils/markdown-toolbar';

@Component({
  selector: 'app-cat-form',
  imports: [ReactiveFormsModule, RouterLink, MarkdownPipe],
  templateUrl: './cat-form.html',
  styleUrl: './cat-form.scss'
})
export class CatForm {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);

  @ViewChild('descArea') descArea!: ElementRef<HTMLTextAreaElement>;

  catForm: FormGroup;
  isLoading    = false;
  errorMessage = '';
  showPreview  = false;

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

  // ── Toolbar Markdown ─────────────────────────────────────────
  applyFmt(before: string, after: string, placeholder: string) {
    const ta = this.descArea?.nativeElement;
    if (!ta) return;
    const current = this.catForm.get('description')?.value || '';
    this.catForm.patchValue({
      description: applyMarkdown(ta, before, after, placeholder)
    });
  }
  bold()   { this.applyFmt('**', '**', 'testo in grassetto'); }
  italic() { this.applyFmt('_', '_', 'testo in corsivo'); }
  link()   { this.applyFmt('[', '](https://)', 'testo del link'); }

  onSubmit() {
    if (this.catForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const catData = {
      ...this.catForm.value,
      latitude: 45.0,
      longitude: 9.0
    };

    this.apiService.createCat(catData).subscribe({
      next: (res) => {
        this.router.navigate(['/cats', res.id || res.cat?.id || '']);
      },
      error: () => {
        this.errorMessage = 'Errore durante la creazione della segnalazione.';
        this.isLoading = false;
      }
    });
  }
}
