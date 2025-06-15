import {Component, createComponent, EnvironmentInjector, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {ApiService} from '../../services/api.service';
import {MapService} from '../../services/map.service';
import {Subscription} from 'rxjs';
import {PopupComponent} from './popup/popup.component';
import {Icon} from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  locations: any[] = [];
  favoriteLocations: string[] = [];

  private map?: L.Map = undefined;
  private sub?: Subscription;
  private markers: { [id: string]: L.Marker } = {};

  constructor(
    private apiService: ApiService,
    private mapService: MapService,
    private injector: EnvironmentInjector
  ) {
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

      this.apiService.favorites().subscribe({
        next: (favorites: any) => {
          this.favoriteLocations = favorites.favorites;
          console.log("fetched favorite locations");
        },
        complete: () => {
          console.log("creating map and markers");
          this.createMapAndMarkers();
        }
      })

    });
  }

  createMapAndMarkers() {
    this.map = L.map('map').setView([50.8333, 12.9166], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    let redIcon = this.createIcon('media/marker-icon-red.png');
    let blueIcon = this.createIcon('media/marker-icon-blue.png');

    this.locations.forEach((location: any) => {
      const isFavorite = this.favoriteLocations.includes(location._id);

      // use angular component as popup, bind inputs and run change detection
      let component = createComponent(PopupComponent, {environmentInjector: this.injector});
      component.instance.location = location;
      console.log(location._id);
      console.log(this.favoriteLocations)
      component.instance.isFavorite = isFavorite;
      component.changeDetectorRef.detectChanges();

      const [lng, lat] = location.geometry?.coordinates || [];

      if (lat && lng) {
        this.markers[location._id] = L.marker([lat, lng], {icon: isFavorite ? redIcon : blueIcon})
          .addTo(this.map!)
          .bindPopup(component.location.nativeElement, {
            className: 'custom-popup',
            autoPan: true,
            closeButton: true
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

  private createIcon(iconUrl: string): Icon {
    return L.icon({
      iconUrl: iconUrl,
      shadowUrl: 'media/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
  }
}
