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
  isLoading = false;
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
    if (idParam !== null) {
      this.isEditMode = true;
      this.catId = Number(idParam);
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
        if (cat.photoUrl !== null) {
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
    if (this.descArea === undefined || this.descArea.nativeElement === undefined) {
      return;
    }
    const ta = this.descArea.nativeElement;
    this.catForm.patchValue({
      description: applyMarkdown(ta, before, after, placeholder)
    });
  }
  bold() { this.applyFmt('**', '**', 'testo in grassetto'); }
  italic() { this.applyFmt('_', '_', 'testo in corsivo'); }
  link() { this.applyFmt('[', '](https://)', 'testo del link'); }

  // -- Posizione dalla mappa -------------------------------------
  onPositionPicked(coords: [number, number]) {
    this.pickedLat = coords[0];
    this.pickedLng = coords[1];
  }

  // -- Selezione Immagine --------------------------------------
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.catForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    
    // Aggiungi tutti i campi testo
    const formVals = this.catForm.value;
    const keys = Object.keys(formVals);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = formVals[key];
      if (val !== null && val !== undefined) {
        formData.append(key, val);
      }
    }

    let lat = 45.0;
    if (this.pickedLat !== null) {
      lat = this.pickedLat;
    }
    let lng = 9.0;
    if (this.pickedLng !== null) {
      lng = this.pickedLng;
    }

    formData.append('latitude', String(lat));
    formData.append('longitude', String(lng));

    if (this.selectedFile !== null) {
      formData.append('photo', this.selectedFile);
    }

    if (this.isEditMode && this.catId !== null) {
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
