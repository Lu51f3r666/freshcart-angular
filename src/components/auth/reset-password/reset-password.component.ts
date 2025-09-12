import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  template: `
    <!-- DEBUG: Component loaded successfully -->
    <div style="position: fixed; top: 10px; left: 10px; background: orange; color: white; padding: 5px; z-index: 9999; font-size: 12px;">
      RESET PASSWORD COMPONENT LOADED
    </div>
    
    <div class="reset-password-container">
      <div class="text-center mb-4">
        <h1 class="text-success fw-bold mb-3">FreshCart</h1>
        <h3>Reset Password</h3>
        <p class="text-muted">Enter your email and new password</p>
      </div>
      
      <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="email" class="form-label">Email Address</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            formControlName="email"
            [class.is-invalid]="resetForm.get('email')?.invalid && resetForm.get('email')?.touched"
          >
          <div class="invalid-feedback" *ngIf="resetForm.get('email')?.invalid && resetForm.get('email')?.touched">
            Please enter a valid email address.
          </div>
        </div>
        
        <div class="mb-3">
          <label for="newPassword" class="form-label">New Password</label>
          <input 
            type="password" 
            class="form-control" 
            id="newPassword" 
            formControlName="newPassword"
            [class.is-invalid]="resetForm.get('newPassword')?.invalid && resetForm.get('newPassword')?.touched"
          >
          <div class="invalid-feedback" *ngIf="resetForm.get('newPassword')?.invalid && resetForm.get('newPassword')?.touched">
            Password must be at least 6 characters.
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-3"
          [disabled]="resetForm.invalid || isLoading"
        >
          <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading"></span>
          {{ isLoading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
      
      <div class="text-center">
        <a routerLink="/auth/signin" class="text-decoration-none">Back to Sign In</a>
      </div>
    </div>
  `,
  styles: [`
    .reset-password-container {
      max-width: 400px;
      margin: 0 auto;
    }
    
    .form-control:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
  `]
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    console.log('=== RESET PASSWORD COMPONENT INIT ===');
    console.log('ResetPasswordComponent initialized');
    console.log('Current URL:', window.location.href);
    
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    console.log('Reset form created:', this.resetForm);
  }

  onSubmit() {
    console.log('=== RESET PASSWORD SUBMIT ===');
    console.log('Form submitted');
    console.log('Form valid:', this.resetForm.valid);
    console.log('Form value:', this.resetForm.value);
    
    if (this.resetForm.valid) {
      this.isLoading = true;
      console.log('Making reset password API call...');
      
      this.authService.resetPassword(this.resetForm.value).subscribe({
        next: (response) => {
          console.log('=== RESET PASSWORD SUCCESS ===');
          console.log('API response:', response);
          this.isLoading = false;
          this.toastr.success('Password reset successfully! You can now login with your new password.', 'Success');
          console.log('Navigating to login page...');
          setTimeout(() => {
            this.router.navigate(['/auth/signin']);
          }, 2000);
        },
        error: (error) => {
          console.error('=== RESET PASSWORD ERROR ===');
          console.error('API error:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.error);
          this.isLoading = false;
          this.toastr.error(error.error.message || 'Failed to reset password', 'Error');
        }
      });
    } else {
      console.log('Form is invalid, marking all fields as touched');
      this.resetForm.markAllAsTouched();
    }
  }
} 