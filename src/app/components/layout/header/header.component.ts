import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-headers',
  imports: [
    RouterLink,
    NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  ngOnInit() {

  }
  constructor(protected apiService: ApiService) {
  }

  logout(){
    this.apiService.logout();
    this.logoutSnackBar();

  }

  private _snackBar = inject(MatSnackBar);

  logoutSnackBar() {
    this._snackBar.open("You are logged out.", "Hide", {
      duration: 3000
    });
  }
}
