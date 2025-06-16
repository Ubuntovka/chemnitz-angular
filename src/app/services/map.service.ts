import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface FavoriteChangeEvent {
  favoriteId: string;
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private markerFocusSubject = new Subject<string>();
  markerFocus$ = this.markerFocusSubject.asObservable();

  private favoriteChangeSubject = new Subject<FavoriteChangeEvent>();
  favoriteChange = this.favoriteChangeSubject.asObservable();

  focusMarker(id: string) {
    this.markerFocusSubject.next(id);
  }

  addFavorite(id: string) {
    this.favoriteChangeSubject.next({
      favoriteId: id,
      isFavorite: true
    } as FavoriteChangeEvent);
  }

  removeFavorite(id: string) {
    this.favoriteChangeSubject.next({
      favoriteId: id,
      isFavorite: false
    } as FavoriteChangeEvent);
  }

  constructor() { }
}
