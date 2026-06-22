import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../_services/api/api.service';
import { AuthService } from '../_services/auth/auth.service';
import { MapComponent, MapCat } from '../map/map.component';
import { Cat } from '../_services/api/cat.type';

@Component({
  selector: 'app-cat-list',
  imports: [RouterLink, MapComponent],
  templateUrl: './cat-list.component.html',
  styleUrl: './cat-list.component.scss'
})
export class CatList implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  public authService = inject(AuthService);

  @ViewChild(MapComponent) mapComp?: MapComponent;

  cats: Cat[] = [];
  catsWithCoords: MapCat[] = [];
  isLoading = true;
  error = '';

  ngOnInit() {
    this.loadCats();
  }

  loadCats() {
    this.apiService.getCats().subscribe({
      next: (data) => {
        this.cats = data;
        
        // Calcola e salva l'array una sola volta, per evitare che la mappa 
        // si resetti ad ogni ciclo di change detection di Angular
        const validCats: MapCat[] = [];
        for (let i = 0; i < this.cats.length; i++) {
          const c = this.cats[i];
          if (c.latitude !== null && c.longitude !== null) {
            let catColor: string | undefined = undefined;
            if (c.color !== null) {
              catColor = c.color;
            }
            let catPhotoUrl: string | undefined = undefined;
            if (c.photoUrl !== null) {
              catPhotoUrl = c.photoUrl;
            }
            validCats.push({
              id: c.id,
              name: c.name,
              latitude: c.latitude,
              longitude: c.longitude,
              color: catColor,
              photoUrl: catPhotoUrl
            });
          }
        }
        this.catsWithCoords = validCats;
        
        this.isLoading = false;
        // Dopo che @if(catsWithCoords) renderizza la mappa, chiama refresh()
        setTimeout(() => {
          if (this.mapComp !== undefined) {
            this.mapComp.refresh();
          }
        }, 0);
        setTimeout(() => {
          if (this.mapComp !== undefined) {
            this.mapComp.refresh();
          }
        }, 400);
      },
      error: () => {
        this.error = 'Errore nel caricamento dei gatti.';
        this.isLoading = false;
      }
    });
  }

  // Naviga alla pagina del gatto quando viene cliccato il marker sulla mappa 
  onCatClicked(id: number) {
    this.router.navigate(['/cats', id]);
  }
}
