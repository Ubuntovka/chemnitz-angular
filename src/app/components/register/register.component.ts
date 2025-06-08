import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {

  user = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {

  }

  register() {
    this.apiService.registerUser(this.user.name, this.user.email, this.user.password)
      .subscribe({
        next: response => console.log('Registered successfully', response),
        error: err => console.error('Registration error', err)
      });
  }


}
