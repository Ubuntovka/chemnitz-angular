import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-user-ranking',
  imports: [],
  templateUrl: './user-ranking.component.html',
  styleUrl: './user-ranking.component.css'
})
export class UserRankingComponent implements OnInit {
  usersRankings: any[] = [];

  constructor(
    private apiService: ApiService,
  ) {

  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.apiService.getAllUsersAndRankings().subscribe((data: any) => {
      this.usersRankings = data;
    })
  }

}
