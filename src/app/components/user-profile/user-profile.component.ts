import {booleanAttribute, Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ApiService} from '../../services/api.service';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  readonly email = new FormControl('', [Validators.email]);
  readonly currentPassword = new FormControl('', [Validators.required]);
  readonly newPassword = new FormControl('', []);
  readonly againNewPassword = new FormControl('', []);
  readonly name = new FormControl('', []);

  user: any = "";

  accountForm = new FormGroup({
    name: this.name,
    email: this.email,
    currentPassword: this.currentPassword,
    newPassword: this.newPassword,
    againNewPassword: this.againNewPassword,
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

  updateUserInfo(){
    if (this.accountForm.valid) {

      const usernameValue = this.name.value ?? undefined;
      const emailValue = this.email.value ?? undefined;
      const currentPasswordValue = this.currentPassword.value ?? undefined;
      const newPasswordValue = this.newPassword.value ?? undefined;
      const againNewPasswordValue = this.againNewPassword.value ?? undefined;

      let isFormValid: boolean = false;

      if (newPasswordValue && newPasswordValue !== againNewPasswordValue) {
        this.notTheSamePasswordSnackBar();
      } else if (!currentPasswordValue) {
        this.noCurrentPasswordSnackBar();
      } else {
        isFormValid = true;
      }

      if (isFormValid) {
        this.apiService.updateUser(currentPasswordValue, usernameValue, emailValue, newPasswordValue)
          .subscribe({
            next: (response) => {
              this.successfulSnackBar();
              this.meInfo();
            },
            error: (err) => {
              this.errorSnackBar();
            },
          });
      } else {
        this.errorSnackBar();
      }

      }

  }

  meInfo(){
    this.apiService.me().subscribe((data: any) => {
      this.user = data.user;
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
    this._snackBar.open("You’ve changed your data successfully!", "Hide", {
      duration: 3000
    });
  }
  errorSnackBar() {
    this._snackBar.open("Error. Something went wrong...", "Hide", {
      duration: 3000
    });
  }
  notTheSamePasswordSnackBar(){
    this._snackBar.open("Error. New passwords do not match.", "Hide", {
      duration: 10000
    });
  }
  noCurrentPasswordSnackBar(){
    this._snackBar.open("Error. Please provide your current password.", "Hide", {
      duration: 10000
    })
  }

}
