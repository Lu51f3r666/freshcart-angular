import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-reset-code',
  template: `
    <div class="verify-reset-code-container">
      <div class="text-center mb-4">
        <h1 class="text-success fw-bold mb-3">FreshCart</h1>
        <h3>Verify Reset Code</h3>
        <p class="text-muted">Enter the verification code sent to your email</p>
      </div>
      
      <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="resetCode" class="form-label">Reset Code</label>
          <input 
            type="text" 
            class="form-control" 
            id="resetCode" 
            formControlName="resetCode"
            placeholder="Enter the code sent to your email"
            [class.is-invalid]="verifyForm.get('resetCode')?.invalid && verifyForm.get('resetCode')?.touched"
          >
          <div class="invalid-feedback" *ngIf="verifyForm.get('resetCode')?.invalid && verifyForm.get('resetCode')?.touched">
            Reset code is required.
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-3"
          [disabled]="verifyForm.invalid || isLoading"
        >
          <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading"></span>
          {{ isLoading ? 'Verifying...' : 'Verify Code' }}
        </button>
      </form>
      
      <div class="text-center">
        <a routerLink="/auth/forgot-password" class="text-decoration-none">Back to Forgot Password</a>
      </div>
    </div>
  `,
  styles: [`
    .verify-reset-code-container {
      max-width: 400px;
      margin: 0 auto;
    }
    
    .form-control:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
  `]
})
export class VerifyResetCodeComponent {
  verifyForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    console.log('=== VERIFY RESET CODE COMPONENT INIT ===');
    console.log('VerifyResetCodeComponent initialized');
    console.log('Current URL:', window.location.href);
    
    this.verifyForm = this.fb.group({
      resetCode: ['', [Validators.required]]
    });
    
    console.log('Verify form created:', this.verifyForm);
  }

  onSubmit() {
    console.log('=== VERIFY RESET CODE SUBMIT ===');
    console.log('Form submitted');
    console.log('Form valid:', this.verifyForm.valid);
    console.log('Form value:', this.verifyForm.value);
    
    if (this.verifyForm.valid) {
      this.isLoading = true;
      console.log('Making verify reset code API call...');
      console.log('Reset code:', this.verifyForm.value.resetCode);
      
      this.authService.verifyResetCode(this.verifyForm.value.resetCode).subscribe({
        next: (response) => {
          console.log('=== VERIFY RESET CODE SUCCESS ===');
          console.log('API response:', response);
          this.isLoading = false;
          this.toastr.success('Code verified successfully! Now set your new password.', 'Success');
          this.router.navigate(['/auth/reset-password']);
        },
        error: (error) => {
          console.error('=== VERIFY RESET CODE ERROR ===');
          console.error('API error:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.error);
          this.isLoading = false;
          this.toastr.error(error.error.message || 'Invalid reset code', 'Error');
        }
      });
    } else {
      console.log('Form is invalid, marking all fields as touched');
      this.verifyForm.markAllAsTouched();
    }
  }
} 