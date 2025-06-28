import {Component, inject, OnInit, signal} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormField, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router, RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatFormField,
    MatIconButton,
    MatButton,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {

  errorMessage = signal('');

  constructor(protected apiService: ApiService, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges,
      this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit() {
  }

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    username: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });
  thirdFormGroup = this._formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
  })
  isLinear = true;

  readonly username = this.firstFormGroup.get('username') as FormControl;
  readonly email = this.secondFormGroup.get('email') as FormControl;
  readonly password = this.thirdFormGroup.get('password') as FormControl;

  register() {
    this.apiService.registerUser(this.username.value, this.email.value, this.password.value)
      .subscribe({
        next: (response) => {console.log('Registered successfully', response);
          this.successfulSnackBar();
          this.router.navigate(['/login']);
        },
        error: (err) => {console.error('Registration error', err)
        this.errorSnackBar();
        }
      });
  };

  // password
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  };


  // email
  updateErrorMessage() {
    if (this.email.hasError('required') || this.password.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else if (this.password.hasError('minlength')) {
      this.errorMessage.set('Your password should be at least 8 characters long');
    } else {
      this.errorMessage.set('');
    }
  }

  // Snackbars
  private _snackBar = inject(MatSnackBar);

  successfulSnackBar() {
    this._snackBar.open("You’ve registered successfully! Please sign in using the email and password that you mentioned earlier.", "Hide", {
      duration: 20000
    });
  }
  errorSnackBar() {
    this._snackBar.open("Registration error.", "Hide", {
      duration: 5000
    });
  }


}
