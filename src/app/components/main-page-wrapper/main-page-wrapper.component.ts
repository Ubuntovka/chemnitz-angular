import { Component } from '@angular/core';
import {SearchbarComponent} from '../searchbar/searchbar.component';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'app-main-page-wrapper',
  imports: [
    SearchbarComponent,
    MapComponent
  ],
  templateUrl: './main-page-wrapper.component.html',
  styleUrl: './main-page-wrapper.component.css'
})
export class MainPageWrapperComponent {

}
