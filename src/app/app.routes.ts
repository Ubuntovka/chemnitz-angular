import { Routes } from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import {MainPageWrapperComponent} from './components/main-page-wrapper/main-page-wrapper.component';
import {LoginComponent} from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: MainPageWrapperComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
];
