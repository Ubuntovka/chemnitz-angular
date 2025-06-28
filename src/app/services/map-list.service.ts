import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapListService {

  private filteredLocationsSubject = new Subject<any[]>();
  filteredLocations$ = this.filteredLocationsSubject.asObservable();

  updateLocations(filteredLocations: any[]) {
    this.filteredLocationsSubject.next(filteredLocations);
  }

  constructor() { }
}
