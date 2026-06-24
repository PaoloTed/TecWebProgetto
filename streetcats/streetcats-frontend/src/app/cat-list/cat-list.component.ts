import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../_services/api/api.service';
import { AuthService } from '../_services/auth/auth.service';
import { MapComponent, MapCat } from '../map/map.component';
import { Cat } from '../_services/api/cat.type';

@Component({
  selector: 'app-cat-list',
  imports: [MapComponent],
  templateUrl: './cat-list.component.html',
  styleUrl: './cat-list.component.scss'
})
export class CatList implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  public authService = inject(AuthService);


  cats: Cat[] = [];
  catsWithCoords: MapCat[] = [];
  error = '';

  ngOnInit() {
    this.loadCats();
  }

  loadCats() {
    this.apiService.getCats().subscribe({
      next: (data) => {
        this.cats = data;

        this.catsWithCoords = this.cats
          .filter(c => c.latitude != null && c.longitude != null)
          .map(c => ({
            id: c.id,
            name: c.name,
            latitude: c.latitude!,
            longitude: c.longitude!,
            color: c.color ?? undefined,
            photoUrl: c.photoUrl ?? undefined
          }));
      },
      error: () => {
        this.error = 'Errore nel caricamento dei gatti.';
      }
    });
  }

  // Naviga alla pagina del gatto quando viene cliccato il marker sulla mappa 
  onCatClicked(id: number) {
    this.router.navigate(['/cats', id]);
  }
}
