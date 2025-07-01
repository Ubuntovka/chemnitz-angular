import {Component, createComponent, inject, Inject, Input, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  // MatDialog,
  MatDialogActions,
  // MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {PopupComponent} from '../popup.component';
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatFormField} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';


interface Review {
  comment: string;
  rating: number;
  location?: { _id: string };
  user: { _id: string };
}

@Component({
  selector: 'app-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    // MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    NgClass,
    CommonModule,
    MatFormField,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnInit {
  isCommented: boolean = false;
  review: any = {};

  readonly comment = new FormControl('', []);

  reviewForm = new FormGroup({
    comment: this.comment,
  });

  constructor(@Inject(MAT_DIALOG_DATA) public location: any,
              protected apiService: ApiService,
              protected dialogRef: MatDialogRef<DialogComponent>) { }
  ngOnInit() {
    this.checkIfCommented();
  }

  rating: number = 0;
  stars = Array(5).fill(0);

  rate(value: number) {
    this.rating = value;
  }

  addReview() {
    if (this.reviewForm.valid) {
      const commentValue = this.comment.value ?? undefined;
      this.apiService.addReview(this.rating, commentValue, this.location._id).subscribe({
        next: (response) => {
          if (commentValue === undefined || commentValue === "") {
            this.apiService.increaseRanking(1).subscribe({
              next: () => {
              },
              error: (err) => {
                this._snackBar.open("Error increasing ranking", "Hide");
              }
            });
          } else {
            this.apiService.increaseRanking(3).subscribe({
              next: () => {
              },
              error: (err) => {
                this._snackBar.open("Error increasing ranking", "Hide");
              }
            });
          }

          this._snackBar.open("Your review has been saved.", "Hide", { duration: 3000 });
          this.dialogRef.close();

        },
        error: (err) => {
          this._snackBar.open("Something went wrong...", "Hide", { duration: 3000 });
          this.dialogRef.close();
        },
      });
    }
  }

  checkIfCommented() {
    this.apiService.getUserReviews().subscribe((reviews: any) => {
      for (const review of reviews) {
        if (review.location === this.location._id) {
          this.isCommented = true;
          this.review = review;
        }
      }
    });
  }


  // Snackbars
  private _snackBar = inject(MatSnackBar);

}
