import {Component, createComponent, Inject, Input, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {PopupComponent} from '../popup.component';

@Component({
  selector: 'app-dialog',
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle
    ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnInit {
  // @Input() location: any;


  constructor(@Inject(MAT_DIALOG_DATA) public location: any ) { }
  ngOnInit() {
  }

}
