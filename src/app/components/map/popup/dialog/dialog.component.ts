import {Component, createComponent, Inject, Input, OnInit} from '@angular/core';
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
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnInit {

  readonly comment = new FormControl('', []);

  reviewForm = new FormGroup({
    comment: this.comment,
  });

  constructor(@Inject(MAT_DIALOG_DATA) public location: any, protected apiService: ApiService ) { }
  ngOnInit() {
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
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

}
