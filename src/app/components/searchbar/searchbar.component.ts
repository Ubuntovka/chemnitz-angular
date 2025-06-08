import {Component, OnInit} from '@angular/core';3
import {ApiService} from '../../services/api.service';
import * as L from 'leaflet';
import {MapService} from '../../services/map.service';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-searchbar',
  imports: [
    FormsModule
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit {
  locations: any[] = [];
  filteredLocations: any[] = [];
  searchTerm: string = '';

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
    });
  }

  locationsBySearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLocations = this.locations.filter(loc =>
      loc.properties?.name?.toLowerCase().includes(term)
    );
  }

}
