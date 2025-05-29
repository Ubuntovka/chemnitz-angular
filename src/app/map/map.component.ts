import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {ApiService} from '../api.service';
import {marker} from 'leaflet';


@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  private map?: L.Map = undefined;
  locations: any[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.fetchLocations();

    this.map = L.map('map').setView([50.8333, 12.9166], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

  }

  fetchLocations() {
    this.apiService.getLocations().subscribe((data: any[]) => {
      this.locations = data;
      this.createMarkers(); // <-- Call separate function after data is fetched
    });
  }

  createMarkers() {
    this.locations.forEach((location: any) => {
      const [lng, lat] = location.geometry?.coordinates || [];
      if (lat && lng) {
        L.marker([lat, lng])
          .addTo(this.map!)
          .bindPopup(location.properties?.name || location.properties?.artwork_type).openPopup();
      }
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.off();
      this.map.remove()
    }
  }
}
