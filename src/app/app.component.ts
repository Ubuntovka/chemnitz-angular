import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './layout/header/header/header.component';
import {SearchbarComponent} from './layout/searchbar/searchbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SearchbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chemnitz-angular';
}
