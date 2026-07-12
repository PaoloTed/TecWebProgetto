import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface MapCat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-map',
  template: '<div id="map" [style.height]="height" style="width:100%;"></div>',
  styles: [':host { display: block; width: 100%; }']
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  private toastr = inject(ToastrService);

  // Dati verso la mappa
  @Input() mode: 'view-all' | 'view-one' | 'pick' = 'view-all';
  @Input() cats: MapCat[] = [];
  @Input() lat: number | null = null;
  @Input() lng: number | null = null;
  @Input() height = '400px';

  // Dati verso il contenitore della mappa
  @Output() catClicked = new EventEmitter<number>();
  @Output() positionPicked = new EventEmitter<[number, number]>();

  private leaflet: any = (window as any)['L'];
  private map: any = null;
  private catMarkers: any[] = [];
  private pickMarker: any = null;

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.map) return;
    if (changes['cats']) this.renderCatMarkers();
    if (changes['lat'] || changes['lng']) this.renderPickMarker();
  }

  ngOnDestroy() {
    this.map?.remove();
    this.map = null;
  }

  // Forza il ridisegno della mappa
  public refresh(): void {
    this.map?.invalidateSize();
  }

  private initMap() {
    if (!this.leaflet) {
      this.toastr.error('Mappa non trovata', 'Errore');
      return;
    }

    // Coordinate iniziali
    let center: [number, number] = [45, 10];
    let zoom = 5;

    if (this.mode === 'view-one' && this.lat != null && this.lng != null) {
      center = [this.lat, this.lng];
      zoom = 15;
    }

    // Inizializzazione mappa
    this.map = this.leaflet.map('map').setView(center, zoom);

    // Tile layer OpenStreetMap
    this.leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Contenuto in base alla modalità
    switch (this.mode) {
      case 'view-all':
        this.renderCatMarkers();
        break;
      case 'view-one':
        this.renderSingleMarker();
        break;
      case 'pick':
        this.setupPickMode();
        break;
    }
  }

  // Marker gatti
  private renderCatMarkers() {
    if (!this.map) {
      this.toastr.error('Mappa non trovata', 'Errore');
      return;
    }

    // Rimuove i vecchi marker dalla mappa
    this.catMarkers.forEach(marker => marker.remove());
    this.catMarkers = [];

    this.cats.forEach(cat => {
      let marker = this.leaflet.marker([cat.latitude, cat.longitude]).addTo(this.map);
      let popUp = document.createElement('div');
      popUp.innerHTML = `
        <b>${cat.name}</b><br>
        <a href="javascript:void(0)">Vai alla pagina del gatto</a>
      `;
      popUp.querySelector('a')!.onclick = () => this.catClicked.emit(cat.id);
      marker.bindPopup(popUp);
      this.catMarkers.push(marker);
    });
  }

  private renderSingleMarker() {
    if (!this.map || this.lat == null || this.lng == null) {
      this.toastr.error('Coordinate non valide', 'Errore');
      return;
    }

    this.leaflet.marker([this.lat, this.lng]).addTo(this.map);
  }

  // Crea un marker draggable e gli attacca il listener dragend
  private createPickMarker(lat: number, lng: number): any {
    let marker = this.leaflet.marker([lat, lng], { draggable: true }).addTo(this.map);
    marker.on('dragend', () => {
      let pos = marker.getLatLng();
      this.positionPicked.emit([pos.lat, pos.lng]);
    });
    return marker;
  }

  // Modalita pick
  private setupPickMode() {
    if (!this.map) {
      this.toastr.error('Mappa non trovata', 'Errore');
      return;
    }

    // Al click sulla mappa: sposta il marker o creane uno nuovo
    this.map.on('click', (eventClick: any) => {
      const lat = eventClick.latlng.lat;
      const lng = eventClick.latlng.lng;

      if (this.pickMarker) {
        this.pickMarker.setLatLng([lat, lng]);
      } else {
        this.pickMarker = this.createPickMarker(lat, lng);
      }
      this.positionPicked.emit([lat, lng]);
    });
  }

  private renderPickMarker() {
    if (!this.map || this.lat == null || this.lng == null || !this.pickMarker) {
      this.toastr.error('Coordinate non valide', 'Errore');
      return;
    }
    this.pickMarker.setLatLng([this.lat, this.lng]);
  }
}
