import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NgClass} from '@angular/common';


export interface UserRanking {
  name: string;
  ranking: number;
}

@Component({
  selector: 'app-user-ranking',
  imports: [
    NgClass
  ],
  templateUrl: './user-ranking.component.html',
  styleUrl: './user-ranking.component.css'
})


export class UserRankingComponent implements OnInit {
  usersRankings: UserRanking[] = [];
  currentUser: any = [];


  constructor(
    private apiService: ApiService,
  ) {

  }

  ngOnInit() {
    this.fetchData();
    this.setRanking();
  }

  getRankClass(index: number): string {
    if (index === 0) return 'first-place';
    if (index === 1) return 'second-place';
    if (index === 2) return 'third-place';
    return '';
  }

  getCurrentUserRankIndex(): number {
    return this.usersRankings.findIndex(u =>
      u.name === this.currentUser.name && u.ranking === this.currentUser.ranking
    );
  }


  fetchData() {
    this.apiService.getAllUsersAndRankings().subscribe((data: UserRanking[]) => {
      this.usersRankings = data.sort((a, b) => b.ranking - a.ranking);
      console.log(this.usersRankings);
    });
  }

  setRanking() {
    if (this.apiService.isLoggedIn()) {
      this.apiService.me().subscribe((data: UserRanking[]) => {
        this.currentUser = data;
        console.log({name: this.currentUser.name, ranking: this.currentUser.ranking})
      })
    }


  }
}
