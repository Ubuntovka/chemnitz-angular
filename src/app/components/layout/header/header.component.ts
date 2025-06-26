import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {NgClass, NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {async} from 'rxjs';

@Component({
  selector: 'app-headers',
  imports: [
    RouterLink,
    NgIf,
    NgClass,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  mobileMenuClass: string = "header-right";
  userRanking: number = 0;

  toggleMenu() {
    if (this.mobileMenuClass === "header-right") {
      this.mobileMenuClass = "header-right mobile";
    } else {
      this.mobileMenuClass = "header-right";
    }
  }


  ngOnInit() {
    if (this.apiService.isLoggedIn()) {
      this.apiService.userRanking().subscribe((ranking: any) => {
        this.userRanking = ranking.ranking;
      });
    }
  }
  constructor(protected apiService: ApiService) {
  }

  logout(){
    this.apiService.logout();
    this.logoutSnackBar();
    window.location.reload();
    this.mobileMenuClass = "header-right";
  }

  private _snackBar = inject(MatSnackBar);

  logoutSnackBar() {
    this._snackBar.open("You are logged out.", "Hide", {
      duration: 3000
    });
  }
}
