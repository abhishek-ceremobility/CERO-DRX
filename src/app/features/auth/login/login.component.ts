import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  submitting = false;
  loginError = '';
  form: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    // initialize form after DI so we can use injected FormBuilder
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      accept: [false, [Validators.requiredTrue]]
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get accept() { return this.form.get('accept'); }

  onSubmit() {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.loginError = '';
    const { email, password } = this.form.value as { email: string; password: string };
    
    this.auth.login(email!, password!).pipe(
      catchError((error) => {
        // Handle different types of errors
        if (error.status === 401) {
          this.loginError = 'Invalid email or password. Please try again.';
        } else if (error.status === 0) {
          this.loginError = 'Unable to connect to the server. Please check your connection.';
        } else {
          // Try to surface server-provided message if available
          this.loginError = error?.error?.message || 'Login failed. Please try again later.';
        }
        return of(null);
      }),
      finalize(() => {
        this.submitting = false;
      })
    ).subscribe({
      next: (response: any) => {
        // Consider success if a token exists in any common shape
        const token = response?.token || response?.data?.token || response?.accessToken || response?.data?.accessToken;
        if (token) {
          this.router.navigate(['/dashboard']);
        } else if (response && response.success) {
          // Backward compatible: if service still wraps with success flag
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }
}
