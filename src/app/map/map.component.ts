import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
// export class MapComponent implements OnInit, OnDestroy {
//   private map?: L.Map = undefined;
//   markers: L.Marker[] = [];
//
//   ngOnInit() {
//     this.map = L.map('map').setView([50.8333, 12.9166], 13);
//
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(this.map);
//
//     const customIcon = L.divIcon({
//       className: 'custom-marker',
//       html: '<div class="marker-inner"></div>',
//       iconSize: [30, 30]
//     });
//
//     // this.markers.push(L.marker([50.8333, 12.9166]).addTo(this.map));
//     this.markers.push(
//       L.marker([50.8333, 12.9166], { icon: customIcon }).addTo(this.map)
//     );
//   }
//
//   ngOnDestroy() {
//     if (this.map) {
//       this.map.off();
//       this.map.remove()
//     }
//   }
// }

export class MapComponent implements AfterViewInit {
  private map?: L.Map = undefined;

  private initMap(): void {
    this.map = L.map('map', {
      center: [50.8333, 12.9166],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
