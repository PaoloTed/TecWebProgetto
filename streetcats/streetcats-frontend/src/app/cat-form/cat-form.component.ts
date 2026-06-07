import { Component, inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../_services/api/api.service';
import { MarkdownPipe } from '../_pipes/markdown/markdown.pipe';
import { applyMarkdown } from '../_utils/markdown-toolbar';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-cat-form',
  imports: [ReactiveFormsModule, RouterLink, MarkdownPipe, MapComponent, DecimalPipe],
  templateUrl: './cat-form.component.html',
  styleUrl: './cat-form.component.scss'
})
export class CatForm implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('descArea') descArea!: ElementRef<HTMLTextAreaElement>;

  catForm: FormGroup;
  isLoading    = false;
  errorMessage = '';
  showPreview  = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  isEditMode = false;
  catId: number | null = null;

  /** Coordinate selezionate dall'utente sulla mappa */
  pickedLat: number | null = null;
  pickedLng: number | null = null;

  constructor() {
    this.catForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      color: [''],
      size: ['']
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.catId = +idParam;
      this.loadCatData(this.catId);
    }
  }

  loadCatData(id: number) {
    this.isLoading = true;
    this.apiService.getCatById(id).subscribe({
      next: (cat) => {
        this.catForm.patchValue({
          name: cat.name,
          description: cat.description,
          color: cat.color,
          size: cat.size
        });
        this.pickedLat = cat.latitude;
        this.pickedLng = cat.longitude;
        if (cat.photoUrl) {
          this.previewUrl = cat.photoUrl;
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento dei dati del gatto.';
        this.isLoading = false;
      }
    });
  }

  // -- Toolbar Markdown -----------------------------------------
  applyFmt(before: string, after: string, placeholder: string) {
    const ta = this.descArea?.nativeElement;
    if (!ta) return;
    this.catForm.patchValue({
      description: applyMarkdown(ta, before, after, placeholder)
    });
  }
  bold()   { this.applyFmt('**', '**', 'testo in grassetto'); }
  italic() { this.applyFmt('_', '_', 'testo in corsivo'); }
  link()   { this.applyFmt('[', '](https://)', 'testo del link'); }

  // -- Posizione dalla mappa -------------------------------------
  onPositionPicked(coords: [number, number]) {
    this.pickedLat = coords[0];
    this.pickedLng = coords[1];
  }

  // -- Selezione Immagine --------------------------------------
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.catForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    
    // Aggiungi tutti i campi testo
    const formVals = this.catForm.value;
    Object.keys(formVals).forEach(key => {
      if (formVals[key] !== null && formVals[key] !== undefined) {
        formData.append(key, formVals[key]);
      }
    });

    formData.append('latitude', String(this.pickedLat ?? 45.0));
    formData.append('longitude', String(this.pickedLng ?? 9.0));

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    if (this.isEditMode && this.catId) {
      this.apiService.updateCat(this.catId, formData).subscribe({
        next: (res) => {
          this.router.navigate(['/cats', this.catId]);
        },
        error: () => {
          this.errorMessage = 'Errore durante la modifica della segnalazione.';
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.createCat(formData).subscribe({
        next: (res) => {
          this.router.navigate(['/cats', res.id]);
        },
        error: () => {
          this.errorMessage = 'Errore durante la creazione della segnalazione.';
          this.isLoading = false;
        }
      });
    }
  }
}
