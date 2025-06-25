import {Component, Input} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '../../../services/map.service';
import { getDistance } from 'geolib';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-popup',
  imports: [
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  @Input() location: any;
  @Input() isFavorite: boolean = false;
  @Input() latLng: any;
  @Input() isVisited: boolean = false;
  popupVisitedClass: string = 'popup-action'

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private mapService: MapService
  ) {}

  toggleFavourite() {
    if (this.isFavorite) {
      this.apiService.removeFavorite(this.location._id).subscribe(this.handleFavoriteResult())
    } else {
      this.apiService.addFavorite(this.location._id).subscribe(this.handleFavoriteResult())
    }
  }

  toggleVisited() {
    if (this.isVisited) {
      this.popupVisitedClass = 'popup-action-visited'
      } else {
      const [lng, lat] = this.location.geometry?.coordinates || [];
      const distance = getDistance(
        { latitude: this.latLng.lat, longitude: this.latLng.lng },
        { latitude: lat, longitude: lng }
      );
      if (distance < 150) {
        this.apiService.addVisited(this.location._id).subscribe({
          next: () => {
            this.isVisited = true;
            this.mapService.addVisited(this.location._id); // notify the map
            // this.apiService.increaseRanking(1);

            this.apiService.increaseRanking(1).subscribe({
              next: () => {
                // this.apiService.getRanking().subscribe({
                //   next: (res) => {
                //     console.log("Updated ranking:", res.ranking);
                //     this.snackBar.open(`Location visited! Your new ranking is ${res.ranking}.`, "Hide");
                //   }
                // });
              },
              error: (err) => {
                console.error(err);
                this.snackBar.open("Error increasing ranking", "Hide");
              }
            });

            this.snackBar.open("Great job! You’ve marked this location as visited.", "Hide");
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open("Something went wrong :(", "Hide");
          }
        });
      } else {
        this.snackBar.open("You need to be at this location to mark it as visited.", "Hide");
        console.log("User is too far away.");
      }
    }
  }

  private handleFavoriteResult() {
    return {
      next: (result: any) => {
        this.snackBar.open(result.message, "Hide");
        if (this.isFavorite) {
          this.mapService.removeFavorite(this.location._id);
        } else {
          this.mapService.addFavorite(this.location._id);
        }
      },
      error: (err: any) => {
        console.log(err);
        this.snackBar.open(err.error, "Hide")
      }
    };
  }

  getProperties(): {title: string, value: any}[] {
    let result: {title: string, value: any}[] = [];
    for (let property in this.location.properties) {
      result.push({title: this.getPropertyTitle(property), value: this.location.properties[property]});
    }
    return result;
  }

  private getPropertyTitle(key: string): string {
    return key
      .replace(/[:_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
