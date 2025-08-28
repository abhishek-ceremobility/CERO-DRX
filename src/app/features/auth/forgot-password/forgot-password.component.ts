// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { of } from 'rxjs';
// import { delay, catchError, finalize } from 'rxjs/operators';

// @Component({
//   selector: 'app-forgot-password',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './forgot-password.component.html',
//   styleUrls: ['../login/login.component.scss','./forgot-password.component.scss']
// })
// export class ForgotPasswordComponent {
//   form;
//   message = '';
//   errorMessage = '';
//   isSubmitting = false;
//   constructor(private fb: FormBuilder) {
//     this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
//   }
//   onSubmit(){
//     if(this.form.invalid || this.isSubmitting) { this.form.markAllAsTouched(); return; }
//     this.isSubmitting = true;
//     this.message = '';
//     this.errorMessage = '';
    
//     // TODO: integrate real forgot password API here
//     // Simulate API call with delay
//     of(true).pipe(
//       delay(600),
//       catchError((error) => {
//         this.errorMessage = 'Failed to send reset link. Please try again later.';
//         return of(null);
//       }),
//       finalize(() => {
//         this.isSubmitting = false;
//       })
//     ).subscribe({
//       next: (response) => {
//         if (response) {
//           this.message = 'Reset link sent to registered email';
//         }
//       }
//     });
//   }
// }
