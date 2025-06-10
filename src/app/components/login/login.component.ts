import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {RouterLink} from '@angular/router';
import {MatFormField, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton, MatButtonModule} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormField,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatButton,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  errorMessage = signal('');

  constructor(protected apiService: ApiService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit() {
  }

  login(){
    if (this.loginForm.valid){
      const emailValue = this.email.value;
      const passwordValue = this.password.value;
      this.apiService.loginUser(emailValue, passwordValue)
        .subscribe({
          next: (response) => {
            this.successfulSnackBar();
            },
          error: (err) => {
            this.errorSnackBar();
          },
        });
    }
  }

  logout(){
    this.apiService.logout();
  }

  // email
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  // password
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // Snackbars
  private _snackBar = inject(MatSnackBar);

  successfulSnackBar() {
    this._snackBar.open("You’ve signed in successfully!", "Hide", {
      duration: 3000,
      horizontalPosition: "start",
      verticalPosition: "bottom",
    });
  }
  errorSnackBar() {
    this._snackBar.open("Sign-in error. Check your credentials.", "Hide", {
      duration: 3000,
      horizontalPosition: "start",
      verticalPosition: "bottom",
    });
  }

}
