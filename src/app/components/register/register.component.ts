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
import {RouterLink} from '@angular/router';

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

  constructor(protected apiService: ApiService) {
    merge(this.email.statusChanges, this.email.valueChanges)
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
    password: ['', Validators.required],
  })
  isLinear = false;

  readonly username = this.firstFormGroup.get('username') as FormControl;
  readonly email = this.secondFormGroup.get('email') as FormControl;
  readonly password = this.thirdFormGroup.get('password') as FormControl;

  register() {
    this.apiService.registerUser(this.username.value, this.email.value, this.password.value)
      .subscribe({
        next: response => console.log('Registered successfully', response),
        error: err => console.error('Registration error', err)
      });
  }

  // password
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  // email
  errorMessage = signal('');
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }
}
