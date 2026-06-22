import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../_services/api/api.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-cat-form',
  imports: [ReactiveFormsModule, RouterLink, MapComponent, DecimalPipe],
  templateUrl: './cat-form.component.html',
  styleUrl: './cat-form.component.scss'
})
export class CatForm implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  catForm: FormGroup;
  errorMessage = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  isEditMode = false;
  catId: number | null = null;

  // Coordinate selezionate
  pickedLat: number | null = 45;
  pickedLng: number | null = 9;

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
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento dei dati del gatto.';
      }
    });
  }

  // Posizione dalla mappa
  onPositionPicked(coords: [number, number]) {
    this.pickedLat = coords[0];
    this.pickedLng = coords[1];
  }

  // Selezione Immagine
  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  onSubmit() {
    if (this.catForm.invalid) {
      return;
    }

    this.errorMessage = '';

    const formData = new FormData();

    // Campi della segnalazione del gatto
    formData.append('name', this.catForm.value.name || '');
    formData.append('description', this.catForm.value.description || '');
    formData.append('color', this.catForm.value.color || '');
    formData.append('size', this.catForm.value.size || '');
    formData.append('latitude', String(this.pickedLat ?? 45));
    formData.append('longitude', String(this.pickedLng ?? 9));

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
        }
      });
    } else {
      this.apiService.createCat(formData).subscribe({
        next: (res) => {
          this.router.navigate(['/cats', res.id]);
        },
        error: () => {
          this.errorMessage = 'Errore durante la creazione della segnalazione.';
        }
      });
    }
  }
}
