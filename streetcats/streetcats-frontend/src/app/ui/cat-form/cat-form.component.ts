import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api/api.service';
import { MapComponent } from '../map/map.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cat-form',
  imports: [ReactiveFormsModule, RouterLink, MapComponent, DecimalPipe],
  templateUrl: './cat-form.component.html',
  styleUrl: './cat-form.component.scss'
})
export class CatForm implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  catForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  isEditMode = false;
  catId: number | null = null;

  // Coordinate selezionate
  pickedLat: number | null = null;
  pickedLng: number | null = null;

  constructor() {
    this.catForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      color: new FormControl(''),
      size: new FormControl('')
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
      next: (catRecived) => {
        this.catForm.patchValue({
          name: catRecived.name,
          description: catRecived.description,
          color: catRecived.color,
          size: catRecived.size
        });
        this.pickedLat = catRecived.latitude;
        this.pickedLng = catRecived.longitude;
        if (catRecived.photoUrl !== null) {
          this.previewUrl = catRecived.photoUrl;
        }
      },
      error: () => {
        this.toastr.error('Errore nel caricamento dei dati del gatto.', 'Errore');
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
    if (this.catForm.invalid || this.pickedLat === null || this.pickedLng === null) {
      this.toastr.warning('Per favore compila tutti i campi obbligatori', 'Campi mancanti');
      return;
    }

    const formData = new FormData();

    // Campi della segnalazione del gatto
    formData.append('name', this.catForm.value.name || '');
    formData.append('description', this.catForm.value.description || '');
    formData.append('color', this.catForm.value.color || '');
    formData.append('size', this.catForm.value.size || '');
    formData.append('latitude', String(this.pickedLat));
    formData.append('longitude', String(this.pickedLng));

    if (this.selectedFile !== null) {
      formData.append('photo', this.selectedFile);
    }

    if (this.isEditMode && this.catId !== null) {
      this.apiService.updateCat(this.catId, formData).subscribe({
        next: (res) => {
          this.toastr.success('Segnalazione modificata con successo!', 'Salvato');
          this.router.navigate(['/cats', this.catId]);
        },
        error: () => {
          this.toastr.error('Errore durante la modifica della segnalazione.', 'Errore');
        }
      });
    } else {
      this.apiService.createCat(formData).subscribe({
        next: (res) => {
          this.toastr.success('Segnalazione creata con successo!', 'Creato');
          this.router.navigate(['/cats', res.id]);
        },
        error: () => {
          this.toastr.error('Errore durante la creazione della segnalazione.', 'Errore');
        }
      });
    }
  }
}
