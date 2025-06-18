import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ApiService} from '../../services/api.service';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgIf} from '@angular/common';
import {MatHint} from '@angular/material/form-field';

@Component({
  selector: 'app-user-profile',
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatHint
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);
  readonly username = new FormControl('', [Validators.required]);
  user: any = "";

  accountForm = new FormGroup({
    password: this.password,
    username: this.username,
    email: this.email,
  });

  errorMessage = signal('');

  constructor(protected apiService: ApiService, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit() {
    this.meInfo();
  }

  login(){
    if (this.accountForm.valid){
      const emailValue = this.email.value;
      const passwordValue = this.password.value;
      this.apiService.loginUser(emailValue, passwordValue)
        .subscribe({
          next: (response) => {
            this.router.navigate(['/']);
            this.successfulSnackBar();
          },
          error: (err) => {
            this.errorSnackBar();
          },
        });
    }
  }

  meInfo(){
    this.apiService.me().subscribe((data: any) => {
      this.user = data.user;
      console.log('User inside subscribe:', this.user.email);
    });
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
      duration: 3000
    });
  }
  errorSnackBar() {
    this._snackBar.open("Sign-in error. Check your credentials.", "Hide", {
      duration: 3000
    });
  }

}
