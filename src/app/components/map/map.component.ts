import {Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {ApiService} from '../../services/api.service';
import {MapService} from '../../services/map.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-map',
  imports: [
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  private map?: L.Map = undefined;
  locations: any[] = [];
  private sub: Subscription | undefined;
  private markers: { [id: string]: L.Marker } = {};

  constructor(private apiService: ApiService, private mapService: MapService) {
  }

  ngOnInit() {
    this.fetchLocations();

    // Highlight chosen marker
    this.sub = this.mapService.markerFocus$.subscribe(id => {
      const marker = this.markers[id];
      if (marker) {
        this.map!.setView(marker.getLatLng(), 15);
        marker.openPopup();
      }
    });

  }

  fetchLocations() {
    this.apiService.getLocations().subscribe((data: any[]) => {
      this.locations = data;
      this.createMapAndMarkers();
    });
  }

  createMapAndMarkers() {
    this.map = L.map('map').setView([50.8333, 12.9166], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.locations.forEach((location: any) => {
      const popupHtml = `
        <div class="popup-card">
          <div class="popup-header">
            <h4>${location.properties?.name || 'Unknown Location'}</h4>
            <span class="popup-subtitle">${location.properties?.type || 'type'}</span>
          </div>
          <div class="popup-actions">
            <button onclick="window.dispatchEvent(new CustomEvent('fav', { detail: '${location._id}' }))">⭐ Add to Favourites</button>
            <button onclick="window.dispatchEvent(new CustomEvent('route', { detail: '${location._id}' }))">🧭 Route</button>
          </div>
        </div>
      `;


      const [lng, lat] = location.geometry?.coordinates || [];
      if (lat && lng) {
        this.markers[location._id] = L.marker([lat, lng])
          .addTo(this.map!)
          .bindPopup(popupHtml, {
            className: 'custom-popup',
            autoPan: true,
            closeButton: true
          }).openPopup();
      }
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.off();
      this.map.remove()
    }
    this.sub?.unsubscribe();
  }
}
