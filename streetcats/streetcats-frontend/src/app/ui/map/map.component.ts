import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-map',
  template: '<div id="map" style="height: 400px; width: 100%;"></div>',
  styles: [':host { display: block; width: 100%; }']
})
export class MapComponent implements AfterViewInit, OnDestroy {

  @Output() mapEmit = new EventEmitter<any>();

  private leaflet: any = (window as any)['L'];
  private map: any = null;

  ngAfterViewInit() {
    if (!this.leaflet) {
      return;
    }

    // Inizializzazione mappa centrata sull'Italia di default
    this.map = this.leaflet.map('map').setView([45, 10], 5);

    this.leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Emette la mappa e Leaflet
    this.mapEmit.emit({ map: this.map, leaflet: this.leaflet });
  }

  ngOnDestroy() {
    this.map?.remove();
    this.map = null;
  }
}
