import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';

export interface MapCat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  color?: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-map',
  template: `
    <div [id]="mapId" [style.height]="height" style="width:100%;"></div>
  `,
  styles: [`:host { display: block; width: 100%; }`]
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {

  // Dati verso la mappa 
  @Input() mode: 'view-all' | 'view-one' | 'pick' = 'view-all';
  @Input() cats: MapCat[] = [];
  @Input() lat: number | null = null;
  @Input() lng: number | null = null;
  @Input() height = '400px';

  // Dati verso il contenitore della mappa
  // Emette l'id del gatto quando l'utente clicca su un marker
  @Output() catClicked = new EventEmitter<number>();
  // Emette [lat, lng] quando l'utente clicca sulla mappa in modalità pick
  @Output() positionPicked = new EventEmitter<[number, number]>();

  readonly mapId = 'map-' + Math.floor(Math.random() * 1000000).toString(36);

  private map: any = null;
  private catMarkers: any[] = [];
  private pickMarker: any = null;

  private readonly ITALY: [number, number] = [40, 10];
  private readonly ITALY_ZOOM = 5;

  constructor(private router: Router) { }

  ngAfterViewInit() {
    this._initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.map) return;
    if (changes['cats']) this._renderCatMarkers();
    if (changes['lat'] || changes['lng']) this._renderPickMarker();
  }

  ngOnDestroy() {
    this.map?.remove();
    this.map = null;
  }

  // Forza il ridisegno della mappa
  public refresh(): void {
    this.map?.invalidateSize();
  }

  private _initMap() {
    const L = (window as any)['L'];
    if (!L) {
      console.error('[MapComponent] Leaflet non trovato. Controlla index.html.');
      return;
    }

    // Coordinate iniziali
    let center: [number, number] = this.ITALY;
    let zoom = this.ITALY_ZOOM;

    if (this.mode === 'view-one' && this.lat != null && this.lng != null) {
      center = [this.lat, this.lng];
      zoom = 15;
    }

    // Inizializzazione mappa
    this.map = L.map(this.mapId).setView(center, zoom);

    // Tile layer OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Contenuto in base alla modalità 
    if (this.mode === 'view-all') this._renderCatMarkers();
    if (this.mode === 'view-one') this._renderSingleMarker();
    if (this.mode === 'pick') this._setupPickMode();
  }

  // Marker gatti
  private _renderCatMarkers() {
    if (!this.map) return;
    const L = (window as any)['L'];

    // Rimuovi marker esistenti
    this.catMarkers.forEach(m => m.remove());
    this.catMarkers = [];

    const valid = this.cats.filter(c =>
      c.latitude != null && c.longitude != null);
    if (valid.length === 0) {
      this.map.setView(this.ITALY, this.ITALY_ZOOM);
      return;
    }

    valid.forEach(cat => {
      // Marker standard
      const marker = L.marker([cat.latitude, cat.longitude]).addTo(this.map);

      // Popup semplice con reindirizzamento
      marker.bindPopup(`
        <div style="text-align: center; font-family: sans-serif;">
          <b>${cat.name}</b><br>
          <a href="/cats/${cat.id}" style="color: var(--color-primary); font-weight: bold; text-decoration: none; display: inline-block; margin-top: 5px;">
            Vai alla pagina del gatto
          </a>
        </div>
      `);
      this.catMarkers.push(marker);
    });
  }

  private _renderSingleMarker() {
    if (!this.map || this.lat == null || this.lng == null) return;
    const L = (window as any)['L'];

    // Marker standard
    L.marker([this.lat, this.lng]).addTo(this.map);
  }

  // Modalità pick 
  private _setupPickMode() {
    if (!this.map) return;
    const L = (window as any)['L'];

    if (this.lat != null && this.lng != null) {
      this.pickMarker = L.marker([this.lat, this.lng], { draggable: true }).addTo(this.map);
      this.pickMarker.on('dragend', () => {
        const pos = this.pickMarker.getLatLng();
        this.positionPicked.emit([pos.lat, pos.lng]);
      });
    }

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      if (this.pickMarker) {
        this.pickMarker.setLatLng([lat, lng]);
      } else {
        this.pickMarker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
        this.pickMarker.on('dragend', () => {
          const pos = this.pickMarker.getLatLng();
          this.positionPicked.emit([pos.lat, pos.lng]);
        });
      }
      this.positionPicked.emit([lat, lng]);
    });
  }

  private _renderPickMarker() {
    if (!this.map || this.lat == null || this.lng == null || !this.pickMarker) return;
    this.pickMarker.setLatLng([this.lat, this.lng]);
  }
}
