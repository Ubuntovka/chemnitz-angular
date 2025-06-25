import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface FavoriteChangeEvent {
  favoriteId: string;
  isFavorite: boolean;
}

export interface VisitedChangeEvent {
  visitedId: string;
  isVisited: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private markerFocusSubject = new Subject<string>();
  markerFocus$ = this.markerFocusSubject.asObservable();

  private favoriteChangeSubject = new Subject<FavoriteChangeEvent>();
  favoriteChange = this.favoriteChangeSubject.asObservable();

  private visitedChangeSubject = new Subject<VisitedChangeEvent>();
  visitedChange = this.visitedChangeSubject.asObservable();

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

  addVisited(id: string) {
    this.visitedChangeSubject.next({
      visitedId: id,
      isVisited: true
    } as VisitedChangeEvent)
  }

  removeVisited(id: string) {
    this.visitedChangeSubject.next({
      visitedId: id,
      isVisited: false
    } as VisitedChangeEvent);
  }

  constructor() { }
}
