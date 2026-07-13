import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { MapComponent } from '../map/map.component';
import { Cat } from '../../type/cat.type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cat-homepage',
  imports: [MapComponent],
  templateUrl: './cat-homepage.component.html',
  styleUrl: './cat-homepage.component.scss'
})
export class CatHomepage implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  cats: Cat[] = [];
  private map: any = null;
  private leaflet: any = null;

  ngOnInit() {
    this.loadCats();
  }

  loadCats() {
    this.apiService.getCats().subscribe({
      next: (catsRecived) => {
        this.cats = catsRecived;
        this.renderMarkers();
      },
      error: () => {
        this.toastr.error('Errore nel caricamento dei gatti.', 'Errore');
      }
    });
  }

  onMapEmit(event: { map: any, leaflet: any }) {
    this.map = event.map;
    this.leaflet = event.leaflet;
  }

  private renderMarkers() {
    this.cats.forEach(cat => {
      let marker = this.leaflet.marker([cat.latitude, cat.longitude]).addTo(this.map);
      let popUp = document.createElement('div');
      popUp.innerHTML = `
        <b>${cat.name}</b><br>
        <a >Vai alla pagina del gatto</a>
      `;
      popUp.querySelector('a')!.onclick = () => this.router.navigate(['/cats', cat.id]);
      marker.bindPopup(popUp);
    });
  }


}
