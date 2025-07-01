import {Component, inject, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '../../../services/map.service';
import {getDistance} from 'geolib';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {DialogComponent} from './dialog/dialog.component';

@Component({
  selector: 'app-popup',
  imports: [
    MatButtonModule, MatDialogModule
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
  ) {
  }

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
        {latitude: this.latLng.lat, longitude: this.latLng.lng},
        {latitude: lat, longitude: lng}
      );
      if (distance < 150) {
        this.apiService.addVisited(this.location._id).subscribe({
          next: () => {
            this.isVisited = true;
            this.mapService.addVisited(this.location._id); // notify the map

            this.apiService.increaseRanking(1).subscribe({
              next: () => {
              },
              error: (err) => {
                this.snackBar.open("Error increasing ranking", "Hide");
              }
            });

            this.snackBar.open("Great job! You’ve marked this location as visited.", "Hide");
          },
          error: (err) => {
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
        this.snackBar.open("You need to be registered to use this functionality.", "Hide")
      }
    };
  }

  getProperties(): { title: string, value: any }[] {
    let result: { title: string, value: any }[] = [];
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

  readonly dialog = inject(MatDialog);

  openDialog() {
    if (!this.isVisited) {
      this._snackBar.open("To be able to leave a review you need to visit the location first.",
        "Hide", {duration: 10000});
      return;
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: this.location
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Snackbars
  private _snackBar = inject(MatSnackBar);

}
