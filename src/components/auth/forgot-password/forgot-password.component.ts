import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  template: `
    <!-- DEBUG: Component loaded successfully -->
    <div style="position: fixed; top: 10px; left: 10px; background: blue; color: white; padding: 5px; z-index: 9999; font-size: 12px;">
      FORGOT PASSWORD COMPONENT LOADED
    </div>
    
    <div class="forgot-password-container">
      <div class="text-center mb-4">
        <h1 class="text-success fw-bold mb-3">FreshCart</h1>
        <h3>Forgot Password</h3>
      </div>
      
      <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="email" class="form-label">Email Address</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            formControlName="email"
            [class.is-invalid]="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched"
          >
          <div class="invalid-feedback" *ngIf="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched">
            Please enter a valid email address.
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-3"
          [disabled]="forgotPasswordForm.invalid || isLoading"
        >
          <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading"></span>
          {{ isLoading ? 'Sending...' : 'Send Reset Code' }}
        </button>
      </form>
      
      <div class="text-center">
        <a routerLink="/auth/signin" class="text-decoration-none">Back to Sign In</a>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      max-width: 400px;
      margin: 0 auto;
    }
    
    .form-control:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    console.log('=== FORGOT PASSWORD COMPONENT INIT ===');
    console.log('ForgotPasswordComponent initialized');
    console.log('Current URL:', window.location.href);
    
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    console.log('=== FORGOT PASSWORD SUBMIT ===');
    console.log('Form submitted');
    console.log('Form valid:', this.forgotPasswordForm.valid);
    console.log('Form value:', this.forgotPasswordForm.value);
    
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      console.log('Making forgot password API call...');
      
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (response) => {
          console.log('=== FORGOT PASSWORD SUCCESS ===');
          console.log('API response:', response);
          this.isLoading = false;
          this.toastr.success('Reset code sent to your email!', 'Success');
          this.router.navigate(['/auth/verify-reset-code']);
        },
        error: (error) => {
          console.error('=== FORGOT PASSWORD ERROR ===');
          console.error('API error:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.error);
          this.isLoading = false;
          this.toastr.error(error.error.message || 'Failed to send reset code', 'Error');
        }
      });
    } else {
      console.log('Form is invalid, marking all fields as touched');
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
} 