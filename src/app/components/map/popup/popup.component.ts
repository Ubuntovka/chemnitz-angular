import {Component, Input} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '../../../services/map.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-popup',
  imports: [
    JsonPipe
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  @Input() location: any;
  @Input() isFavorite: boolean = false;
  @Input() latLng: any;

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

  // toggleVisited() {
  //
  // }

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
