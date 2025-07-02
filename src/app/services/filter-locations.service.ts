import {Injectable} from '@angular/core';
import {Browser} from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class FilterLocationsService {
  private activeFilter: string[] = [];

  constructor() {
  }

  // chips logic
  filterLocationsByType(type: string, locations: any[]): any[] {
    if (!this.activeFilter.includes(type)) {
      this.activeFilter.push(type);
    } else if (this.activeFilter.includes(type)) {
      let index = this.activeFilter?.indexOf(type);
      this.activeFilter?.splice(index, 1);
    }

    if (this.activeFilter.length > 0) {
      return locations.filter(location =>
        this.activeFilter.some(filter =>
          location.properties?.tourism?.toLowerCase().includes(filter.toLowerCase()) ||
          location.properties?.amenity?.toLowerCase().includes(filter.toLowerCase()) ||
          location.properties?.tourism_1?.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      return locations;
    }
  }

  getActiveFilters(): string[] {
    return this.activeFilter;
  }

  clearFilters(): void {
    this.activeFilter = [];
  }

  // search bar logic
  searchLocations(term: string, filteredByChipsLocations: any[]) {
    return filteredByChipsLocations.filter(loc =>
      loc.properties?.name?.toLowerCase().includes(term) ||
      loc.properties?.landuse?.toLowerCase().includes(term) ||
      loc.properties?.museum?.toLowerCase().includes(term) ||
      loc.properties?.operator?.toLowerCase().includes(term)
    );
  }

}
