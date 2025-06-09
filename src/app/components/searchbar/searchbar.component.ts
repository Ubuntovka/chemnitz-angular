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

  constructor(private apiService: ApiService, private mapService: MapService) {
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

  activeFilter: string[] = [];
  locationsByFilter(type: string) {

    if(!this.activeFilter.includes(type)){
      this.activeFilter.push(type);
    } else if (this.activeFilter.includes(type)) {
      let index = this.activeFilter?.indexOf(type);
      this.activeFilter?.splice(index, 1);
    }

    if(this.activeFilter.length > 0){
      this.filteredByChipsLocations = this.locations.filter(location =>
        this.activeFilter.some(filter =>
          location.properties?.tourism?.toLowerCase().includes(filter.toLowerCase()) ||
          location.properties?.amenity?.toLowerCase().includes(filter.toLowerCase()) ||
          location.properties?.tourism_1?.toLowerCase().includes(filter.toLowerCase())
        )
      );
      this.filteredLocations = this.filteredByChipsLocations;
    } else {
      this.filteredByChipsLocations = this.locations;
      this.filteredLocations = this.filteredByChipsLocations;
    }
  }

  locationsBySearch(){
    const term = this.searchTerm.toLowerCase();

    this.filteredLocations = this.filteredByChipsLocations.filter(loc =>
      loc.properties?.name?.toLowerCase().includes(term)
    );
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
