import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: ''
  };

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
  }

  login(){
    this.apiService.loginUser(this.user.email, this.user.password)
      .subscribe({
        next: response => console.log('Logged in successfully', response),
        error: err => console.error('Log in error', err)
      });
  }

}
