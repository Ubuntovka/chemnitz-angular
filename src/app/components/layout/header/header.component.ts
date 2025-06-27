import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {NgClass, NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    this.setRanking();
  }
  constructor(protected apiService: ApiService) {
  }

  logout() {
    this.apiService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.logoutSnackBar();
        window.location.reload();
        this.mobileMenuClass = "header-right";
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.logoutSnackBar();
      }
    });
  }


  private _snackBar = inject(MatSnackBar);

  logoutSnackBar() {
    this._snackBar.open("You are logged out.", "Hide", {
      duration: 3000
    });
  }

  setRanking(){
    if (this.apiService.isLoggedIn()) {
      this.apiService.userRanking().subscribe((ranking: any) => {
        this.userRanking = ranking.ranking;
      });
    }
  }

}

