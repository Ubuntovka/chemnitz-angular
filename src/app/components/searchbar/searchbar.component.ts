import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {MapService} from '../../services/map.service';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {NgClass, NgIf} from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import {FilterLocationsService} from '../../services/filter-locations.service';
import {MapListService} from '../../services/map-list.service';
import {MatIconButton} from '@angular/material/button';


@Component({
  selector: 'app-searchbar',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    NgClass,
    MatChipsModule,
    NgIf,
    MatIconButton,
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
})
export class SearchbarComponent implements OnInit {
  locations: any[] = [];
  filteredLocations: any[] = [];
  filteredByChipsLocations: any[] = [];
  searchTerm: string = '';
  filterLocationsClass = 'filter-locations';
  locationsListClass = 'locations-list';
  favoriteLocations: string[] = [];
  listForMobileClass: string = 'search-page';

  constructor(
    private apiService: ApiService,
    private mapService: MapService,
    private filterService: FilterLocationsService,
    private mapListService: MapListService
  ) {
  }

  select(id: string) {
    this.mapService.focusMarker(id);
    this.listForMobileClass = 'search-page';
  }

  ngOnInit() {
    this.fetchLocations();
  }

  fetchLocations() {
    this.apiService.getLocations().subscribe((data: any[]) => {
      this.locations = data;
      this.filteredLocations = data;
      this.filteredByChipsLocations = data;
    });

    if (this.apiService.isLoggedIn()) {
      this.apiService.favorites().subscribe({
        next: (favorites: any) => {
          this.favoriteLocations = favorites;
        }
      })
    }

  }

  // Filter chips
  activeFilter: string[] = [];

  locationsByFilter(type: string) {
    this.activeFilter = this.filterService.getActiveFilters();

    this.filteredByChipsLocations = this.filterService.filterLocationsByType(type, this.locations);
    this.filteredLocations = this.filteredByChipsLocations;
    this.mapListService.updateLocations(this.filteredLocations);


  }

  // Search bar
  locationsBySearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLocations = this.filterService.searchLocations(term, this.filteredByChipsLocations);
    this.mapListService.updateLocations(this.filteredLocations);
    this.setActiveMobileClass();
  }

  setActiveClass() {
    if (this.filterLocationsClass == 'filter-locations') {
      this.filterLocationsClass = 'filter-locations active';
      this.locationsListClass = 'locations-list active';
      this.listForMobileClass = 'search-page mobile-active';
    } else {
      this.filterLocationsClass = 'filter-locations';
      this.locationsListClass = 'locations-list';
      this.listForMobileClass = 'search-page';
    }
  }

  setActiveMobileClass() {
    if (this.searchTerm.length > 0 && this.filteredLocations.length > 0) {
      this.listForMobileClass = 'search-page mobile-active';
    } else {
      this.listForMobileClass = 'search-page';
    }
  }


}
