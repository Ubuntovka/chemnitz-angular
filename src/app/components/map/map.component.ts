import {Component, ComponentRef, createComponent, EnvironmentInjector, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {ApiService} from '../../services/api.service';
import {MapService} from '../../services/map.service';
import {Subscription} from 'rxjs';
import {PopupComponent} from './popup/popup.component';
import {Icon} from 'leaflet';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapListService} from '../../services/map-list.service';

@Component({
  selector: 'app-map',
  imports: [MatSlideToggleModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  locations: any[] = [];
  favoriteLocations: string[] = [];

  private map?: L.Map = undefined;
  private markerFocusSub: Subscription;
  private favoriteChangeSub: Subscription;
  private visitedChangeSub: Subscription;
  private filteredLocationsSub: Subscription;
  private markers: { [id: string]: L.Marker } = {};
  private currentPosMarker?: L.Circle;

  visitedLocations: string[] = [];
  disabled = false;
  showingVisitedGrey = false;


  private popupComponents: Map<string, ComponentRef<PopupComponent>> = new Map();

  yellowIcon: Icon
  blueIcon: Icon
  greenIcon: Icon
  redIcon: Icon
  greyIcon: Icon

  constructor(
    private apiService: ApiService,
    private mapService: MapService,
    private injector: EnvironmentInjector,
    private snackBar: MatSnackBar,
    private mapListService: MapListService,
  ) {
    this.yellowIcon = this.createIcon('media/marker-icon-yellow.png');
    this.blueIcon = this.createIcon('media/marker-icon-blue.png');
    this.greenIcon = this.createIcon('media/marker-icon-green.png');
    this.redIcon = this.createIcon('media/marker-icon-red.png');
    this.greyIcon = this.createIcon('media/marker-icon-grey.png');

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
    });

    this.visitedChangeSub = this.mapService.visitedChange.subscribe(visitedEvent => {
      let component = this.popupComponents.get(visitedEvent.visitedId);
      if (component) {
        component.instance.isVisited = visitedEvent.isVisited;
        component.changeDetectorRef.detectChanges(); // live re-render
      }
    });

    this.filteredLocationsSub = this.mapListService.filteredLocations$.subscribe(filteredLocations => {
      if (!this.map) return;

      this.locations.forEach(location => {
        const marker = this.markers[location._id];
        if (filteredLocations.find(loc => loc._id === location._id)) {
          console.log("includes layer");
          if (!this.map!.hasLayer(marker)) {
            this.map!.addLayer(marker);
          }
        } else {
          console.log("remove layer");
          if (this.map!.hasLayer(marker)) {
            this.map!.removeLayer(marker);
          }
        }
      });

    });

  }


  ngOnInit() {
    this.disabled = !this.apiService.isLoggedIn();
    this.fetchLocations();
  }

  fetchLocations() {
    this.apiService.getLocations().subscribe((data: any[]) => {
      this.locations = data;

      if (this.apiService.isLoggedIn()) {
        this.apiService.favorites().subscribe({
          next: (favorites: any) => {
            this.favoriteLocations = favorites;
            console.log("Fetched favorite locations");
          },
          complete: () => {
            this.apiService.visitedAll().subscribe({
              next: (visited: any) => {
                this.visitedLocations = visited;
                console.log("Fetched visited locations");
              },
              complete: () => {
                console.log("Creating map and markers");
                this.createMapAndMarkers();
              }
            });
          }
        });
      } else {
        this.createMapAndMarkers();
      }
    });
  }

  createMapAndMarkers() {
    this.map = L.map('map', {zoomControl: false}).setView([50.8333, 12.9166], 15);

    L.control.zoom({
      position: 'bottomleft'
    }).addTo(this.map);

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
      component.instance.isVisited = this.visitedLocations.includes(location._id);
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

    this.requestAndUpdateLocation();
  }

  requestAndUpdateLocation() {
    if (!this.map) return;
    this.map.locate({watch: true, setView: true, maxZoom: 16});
    this.map.on('locationfound', (e) => {
      this.onLocationFound(e)
    });
  }


  private onLocationFound(e: any) {
    const radius = e.accuracy;
    const latLng = e.latlng;

    for (const component of this.popupComponents.values()) {
      if (component) {
        component.instance.latLng = latLng;
        component.changeDetectorRef.detectChanges();
      }
    }

    if (!this.currentPosMarker) {
      this.currentPosMarker = L.circle(latLng, radius).addTo(this.map!);
    } else {
      this.currentPosMarker.setLatLng(latLng);
      this.currentPosMarker.setRadius(radius);
    }
  };

  showVisited() {
    this.showingVisitedGrey = !this.showingVisitedGrey;

    this.visitedLocations.forEach(id => {
      const marker = this.markers[id];
      const location = this.locations.find(loc => loc._id === id);
      if (!marker || !location) return;

      const icon = this.showingVisitedGrey ? this.greyIcon : this.iconColor(location);
      marker.setIcon(icon);
    });
  }

  handleToggleClick() {
    if (this.disabled) {
      this.snackBar.open("You need to be registered to use this functionality.", "Hide");
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.off();
      this.map.remove()
    }
    this.markerFocusSub?.unsubscribe();
    this.favoriteChangeSub?.unsubscribe();
    this.visitedChangeSub?.unsubscribe();
    this.filteredLocationsSub?.unsubscribe();
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
      location.properties?.tourism === 'hotel') {
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
