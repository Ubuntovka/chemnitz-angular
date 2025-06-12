import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {ApiService} from '../../services/api.service';
import {MapService} from '../../services/map.service';
import {Subscription} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {marker} from 'leaflet';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-map',
  imports: [
    MatIcon,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  private map?: L.Map = undefined;
  locations: any[] = [];
  private sub: Subscription | undefined;
  private markers: { [id: string]: L.Marker } = {};

  constructor(private apiService: ApiService, private mapService: MapService, private snackBar: MatSnackBar) {
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
      const otherDetailsHtml = Object.entries(location.properties || {})
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('');
      const buttonId = `fav-btn-${location._id}`;

      const popupHtml = `
        <div class="popup-card">
          <div class="popup-header">
            <h4>${location.properties?.name || location.properties?.artwork_type ||
      location.properties?.description || location.properties?.tourism || location.properties?.amenity || 'Unknown Location'}</h4>
            <span class="popup-subtitle">${location.properties?.tourism || location.properties?.amenity ||
                                          location.properties?.tourism_1}</span>
          </div>
          <div class="popup-body">
            <span>Phone number: ${location.properties?.phone || "-//-"}</span>
            <p>Website: ${location.properties?.website || "-//-"}</p>
            <p>Address: ${location.properties?.['addr:street'] + ' ' + location.properties?.['addr:housenumber'] +
      ', Chemnitz'}</p>
            <p>Opening hours: ${location.properties?.opening_hours || "-//-"}</p>
          </div>
          <div class="popup-actions">
                <button id="${buttonId}">⭐ Add to Favourites</button>
          </div>
          <div class="popup-body">
          Other information:
          <p>${otherDetailsHtml}</p>
          </div>
        </div>
      `;

      const [lng, lat] = location.geometry?.coordinates || [];

      if (lat && lng) {
        const marker = L.marker([lat, lng])
          .addTo(this.map!)
          .bindPopup(popupHtml, {
            className: 'custom-popup',
            autoPan: true,
            closeButton: true
          });
        this.markers[location._id] = marker;

        marker.on('popupopen', () => {
          const btn = document.getElementById(buttonId);
          if (btn) {
            btn.addEventListener('click', () => {
              this.apiService.addFavorite(location._id).subscribe(() => {
                this.snackBar.open('Added to favorites!', 'Hide', {
                  duration: 3000,
                });
              });
            });
          }
        });
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
