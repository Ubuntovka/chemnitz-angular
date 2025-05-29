import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import * as L from 'leaflet';


@Component({
  selector: 'app-searchbar',
  imports: [],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit {
  locations: any[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit(){
    this.fetchLocations();


  }

  fetchLocations() {
    this.apiService.getLocations().subscribe((data: any[]) => {
      this.locations = data;
    });
  }

}
