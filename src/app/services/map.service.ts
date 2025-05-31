import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private markerFocusSource = new Subject<string>();
  markerFocus$ = this.markerFocusSource.asObservable();

  focusMarker(id: string) {
    this.markerFocusSource.next(id);
  }

  constructor() { }
}
