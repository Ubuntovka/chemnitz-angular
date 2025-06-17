import {Component, ComponentRef, createComponent, EnvironmentInjector, OnDestroy, OnInit} from '@angular/core';
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
  private markerFocusSub: Subscription;
  private favoriteChangeSub: Subscription;
  private markers: { [id: string]: L.Marker } = {};

  private popupComponents: Map<string, ComponentRef<PopupComponent>> = new Map();

  yellowIcon: Icon
  blueIcon: Icon
  greenIcon: Icon
  redIcon: Icon

  constructor(
    private apiService: ApiService,
    private mapService: MapService,
    private injector: EnvironmentInjector,
  ) {
    this.yellowIcon = this.createIcon('media/marker-icon-yellow.png');
    this.blueIcon = this.createIcon('media/marker-icon-blue.png');
    this.greenIcon = this.createIcon('media/marker-icon-green.png');
    this.redIcon = this.createIcon('media/marker-icon-red.png');

    this.markerFocusSub = this.mapService.markerFocus$.subscribe(id => {
      const marker = this.markers[id];
      if (marker) {
        this.map!.setView(marker.getLatLng(), 15);
        marker.openPopup();
      }
    });

    this.favoriteChangeSub = this.mapService.favoriteChange.subscribe(changeEvent => {
      let component = this.popupComponents.get(changeEvent.favoriteId)
      if (component) {
        component.instance.isFavorite = changeEvent.isFavorite;
        component.changeDetectorRef.detectChanges();
      }

      const location = this.locations.find(loc => loc._id === changeEvent.favoriteId);
      if (!location) return;

      let icon: Icon;

      if (changeEvent.isFavorite) {
        icon = this.yellowIcon;
      } else {
        icon = this.iconColor(location);
      }

      this.markers[changeEvent.favoriteId].setIcon(icon);


      // this.markers[changeEvent.favoriteId].setIcon(changeEvent.isFavorite ? this.redIcon : this.blueIcon)
    });
  }

  ngOnInit() {
    this.fetchLocations();

  }

  fetchLocations() {
    this.apiService.getLocations().subscribe((data: any[]) => {
      this.locations = data;

      if (this.apiService.isLoggedIn()){
        this.apiService.favorites().subscribe({
          next: (favorites: any) => {
            this.favoriteLocations = favorites;
            console.log("fetched favorite locations");
          },
          complete: () => {
            console.log("creating map and markers");
            this.createMapAndMarkers();
          }
        })
      } else {
        this.createMapAndMarkers();
      }

    });
  }

  createMapAndMarkers() {
    this.map = L.map('map').setView([50.8333, 12.9166], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.locations.forEach((location: any) => {
      const isFavorite = this.favoriteLocations.includes(location._id);

      // use angular component as popup, bind inputs and run change detection
      let component = createComponent(PopupComponent, {environmentInjector: this.injector});
      component.instance.location = location;
      component.instance.isFavorite = isFavorite;
      component.changeDetectorRef.detectChanges();

      const [lng, lat] = location.geometry?.coordinates || [];

      let icon;

      if (isFavorite) {
        icon = this.yellowIcon;
      } else {
        icon = this.iconColor(location);
      }

      if (lat && lng) {
        this.markers[location._id] = L.marker([lat, lng], {icon: icon})
          .addTo(this.map!)
          .bindPopup(component.location.nativeElement, {
            className: 'custom-popup',
            autoPan: true,
            closeButton: true
          });

        this.popupComponents.set(location._id, component);
      }
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.off();
      this.map.remove()
    }
    this.markerFocusSub?.unsubscribe();
    this.favoriteChangeSub?.unsubscribe();
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

  private iconColor(location: any) {
    if (location.properties?.tourism === 'museum' ||
      location.properties?.tourism === 'theatre' ||
      location.properties?.amenity === 'theatre') {
      return this.greenIcon;
    } else if (location.properties?.amenity === 'restaurant' ||
      location.properties?.tourism === 'hotel'){
      return this.blueIcon;
    } else if (location.properties?.tourism === 'artwork' ||
      location.properties?.tourism === 'heritage' ||
      location.properties?.tourism_1 === 'heritage') {
      return this.redIcon;
    } else {
      return this.blueIcon;
    }
  }
}
