import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/layout/header/header.component';
import {ApiService} from './services/api.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'chemnitz-angular';

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.checkTokenOnStartup();
  }
}
