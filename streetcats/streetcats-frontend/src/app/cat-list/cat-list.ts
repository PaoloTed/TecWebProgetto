import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../_services/api/api.service';
import { AuthService } from '../_services/auth/auth.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-cat-list',
  imports: [RouterLink, MapComponent],
  templateUrl: './cat-list.html',
  styleUrl: './cat-list.scss'
})
export class CatList implements OnInit {
  private apiService = inject(ApiService);
  private router     = inject(Router);
  public authService = inject(AuthService);

  @ViewChild(MapComponent) mapComp?: MapComponent;

  cats: any[] = [];
  catsWithCoords: any[] = [];
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
        this.catsWithCoords = this.cats.filter(c => c.latitude != null && c.longitude != null);
        
        this.isLoading = false;
        // Dopo che @if(catsWithCoords) renderizza la mappa, chiama refresh()
        setTimeout(() => this.mapComp?.refresh(), 0);
        setTimeout(() => this.mapComp?.refresh(), 400);
      },
      error: () => {
        this.error = 'Errore nel caricamento dei gatti.';
        this.isLoading = false;
      }
    });
  }

  /** Naviga alla pagina del gatto quando viene cliccato il marker sulla mappa */
  onCatClicked(id: number) {
    this.router.navigate(['/cats', id]);
  }
}
