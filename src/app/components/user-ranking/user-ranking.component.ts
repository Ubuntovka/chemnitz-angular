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

  constructor(
    private apiService: ApiService,
  ) {

  }

  ngOnInit() {
    this.fetchData();
  }

  getRankClass(user: any, index: number): string {
    if (index === 0) return 'first-place';
    if (index === 1) return 'second-place';
    if (index === 2) return 'third-place';
    return '';
  }

  fetchData() {
    this.apiService.getAllUsersAndRankings().subscribe((data: UserRanking[]) => {
      this.usersRankings = data.sort((a, b) => b.ranking - a.ranking);
    });
  }




}
