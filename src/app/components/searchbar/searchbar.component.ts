import {Component, OnInit} from '@angular/core';3
import {ApiService} from '../../services/api.service';
import * as L from 'leaflet';
import {MapService} from '../../services/map.service';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import {FilterLocationsService} from '../../services/filter-locations.service';


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

  constructor(private apiService: ApiService, private mapService: MapService, private filterService: FilterLocationsService) {
  }

  select(id: string) {
    this.mapService.focusMarker(id);
  }

  ngOnInit(){
    this.fetchLocations();
  }

  fetchLocations() {
    this.apiService.getLocations().subscribe((data: any[]) => {
      this.locations = data;
      this.filteredLocations = data;
      this.filteredByChipsLocations = data;
    });
  }

  // Filter chips
  activeFilter: string[] = [];
  locationsByFilter(type: string) {
    this.activeFilter = this.filterService.getActiveFilters();

    this.filteredByChipsLocations = this.filterService.filterLocationsByType(type, this.locations);
    this.filteredLocations = this.filteredByChipsLocations;


  }

  // Search bar
  locationsBySearch(){
    const term = this.searchTerm.toLowerCase();
    this.filteredLocations = this.filterService.searchLocations(term, this.filteredByChipsLocations);
  }

  setActiveClass(){
    if(this.filterLocationsClass == 'filter-locations'){
      this.filterLocationsClass = 'filter-locations active';
      this.locationsListClass = 'locations-list active';
    } else {
      this.filterLocationsClass = 'filter-locations';
      this.locationsListClass = 'locations-list';
    }
  }

}
