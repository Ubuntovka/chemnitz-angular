import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainPageWrapperComponent} from './main-page-wrapper/main-page-wrapper.component';

export const routes: Routes = [
  { path: '', component: MainPageWrapperComponent },
  {path: 'login', component: LoginComponent},
];
