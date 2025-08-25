import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { of } from 'rxjs';
import { delay, catchError, finalize } from 'rxjs/operators';

export function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.scss','./signup.component.scss']
})
export class SignupComponent {
  form;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
    }, { validators: matchPasswords });
  }
  onSubmit(){
    if(this.form.invalid || this.isSubmitting){ this.form.markAllAsTouched(); return; }
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    // TODO: integrate real signup API here
    // Simulate API call with delay
    of(true).pipe(
      delay(1800),
      catchError((error) => {
        this.errorMessage = 'Failed to create account. Please try again later.';
        return of(null);
      }),
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe({
      next: (response) => {
        if (response) {
          this.successMessage = 'Account created successfully. Redirecting to login…';
          // Redirect after a short delay
          of(true).pipe(delay(1000)).subscribe(() => {
            this.router.navigate(['/auth/login']);
          });
        }
      }
    });
  }
}
