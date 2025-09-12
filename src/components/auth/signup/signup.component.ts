import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <div class="bg-white p-4 rounded shadow">
              <div class="text-center mb-4">
                <h1 class="text-success fw-bold mb-3">FreshCart</h1>
                <h3 class="text-success fw-bold">Register Now</h3>
              </div>
              
              <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
                <div class="mb-2">
                  <label for="name">Name:</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    formControlName="name"
                  >
                  <div class="alert alert-danger my-2" *ngIf="signupForm.get('name')?.invalid && signupForm.get('name')?.touched">
                    Name must be at least 3 characters long
                  </div>
                </div>
                
                <div class="mb-2">
                  <label for="email">Email:</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    formControlName="email"
                  >
                  <div class="alert alert-danger my-2" *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched">
                    Please enter a valid email address
                  </div>
                </div>
                
                <div class="mb-2">
                  <label for="password">Password:</label>
                  <div class="position-relative">
                    <input 
                      [type]="showPassword ? 'text' : 'password'"
                      class="form-control" 
                      id="password" 
                      formControlName="password"
                    >
                    <button
                      type="button"
                      class="btn text-color border-0 position-absolute top-50 end-0 translate-middle-y"
                      (click)="togglePasswordVisibility()"
                    >
                      <i [class]="showPassword ? 'fa-regular fa-eye-slash text-main' : 'fa-regular fa-eye'"></i>
                    </button>
                  </div>
                  <div class="alert alert-danger my-2" *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched">
                    Password must be at least 6 characters long
                  </div>
                </div>

                <div class="mb-2">
                  <label for="rePassword">Re-password:</label>
                  <div class="position-relative">
                    <input 
                      [type]="showRePassword ? 'text' : 'password'"
                      class="form-control" 
                      id="rePassword" 
                      formControlName="rePassword"
                    >
                    <button
                      type="button"
                      class="btn text-color border-0 position-absolute top-50 end-0 translate-middle-y"
                      (click)="toggleRePasswordVisibility()"
                    >
                      <i [class]="showRePassword ? 'fa-regular fa-eye-slash text-main' : 'fa-regular fa-eye'"></i>
                    </button>
                  </div>
                  <div class="alert alert-danger my-2" *ngIf="signupForm.get('rePassword')?.invalid && signupForm.get('rePassword')?.touched">
                    Passwords do not match
                  </div>
                </div>

                <div class="mb-3">
                  <label for="phone">Phone:</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="phone" 
                    formControlName="phone"
                  >
                  <div class="alert alert-danger my-2" *ngIf="signupForm.get('phone')?.invalid && signupForm.get('phone')?.touched">
                    Please enter a valid Egyptian phone number
                  </div>
                </div>

                <div class="alert alert-danger text-center" *ngIf="errorMsg">
                  {{ errorMsg }}
                </div>
                
                <div class="alert alert-info text-center small mb-3" *ngIf="signupForm.invalid">
                  <i class="fas fa-info-circle me-2"></i>
                  Please fill all fields correctly to enable registration
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  [disabled]="signupForm.invalid || isLoading"
                >
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Loading...' : 'Register Now' }}
                </button>

                <p class="my-4 text-center">
                  Already have an account?
                  <a routerLink="/auth/signin" class="text-main ms-1 fw-bold">Login</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showRePassword = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    console.log('=== SIGNUP COMPONENT INIT ===');
    console.log('SignupComponent initialized');
    console.log('Current URL:', window.location.href);
    
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
    
    console.log('Signup form created:', this.signupForm);
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const rePassword = control.get('rePassword');
    
    if (password && rePassword && password.value !== rePassword.value) {
      rePassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleRePasswordVisibility() {
    this.showRePassword = !this.showRePassword;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMsg = '';
      
      this.authService.register(this.signupForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/auth/signin']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsg = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
} 