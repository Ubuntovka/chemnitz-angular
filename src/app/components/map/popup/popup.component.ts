import {Component, Input} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-popup',
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  @Input() location: any;
  @Input() isFavorite: boolean = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) {}

  toggleFavourite() {
    this.apiService.addFavorite(this.location).subscribe({
      next: (result: any) => {
        this.snackBar.open(result.message)
      },
      error: err => {
        console.log(err);
        this.snackBar.open(err.error)
      }
    })
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
