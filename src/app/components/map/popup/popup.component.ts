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
}
