import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  template: `
    <div class="container-fluid vh-100 bg-white">
      <div class="row h-100">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <div class="w-100" style="max-width: 400px;">
            <div class="text-center mb-4">
              <h1 class="text-success fw-bold mb-3">FreshCart</h1>
              <h3 class="text-dark">Login Now</h3>
            </div>
            
            <form [formGroup]="signinForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="email" class="form-label text-muted">Email</label>
                <input 
                  type="email" 
                  class="form-control border-2"
                  id="email" 
                  formControlName="email"
                  placeholder=""
                >
                <div class="text-danger small mt-1" *ngIf="signinForm.get('email')?.invalid && signinForm.get('email')?.touched">
                  Please enter a valid email address
                </div>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label text-muted">Password</label>
                <div class="position-relative">
                  <input 
                    [type]="showPassword ? 'text' : 'password'"
                    class="form-control border-2"
                    id="password" 
                    formControlName="password"
                    placeholder=""
                  >
                  <button
                    type="button"
                    class="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
                    (click)="togglePasswordVisibility()"
                    style="border: none; background: none;"
                  >
                    <i [class]="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                  </button>
                </div>
                <div class="text-danger small mt-1" *ngIf="signinForm.get('password')?.invalid && signinForm.get('password')?.touched">
                  Password is required
                </div>
              </div>

              <div class="mb-3">
                <label for="rePassword" class="form-label text-muted">Re-password</label>
                <div class="position-relative">
                  <input 
                    type="password"
                    class="form-control border-2"
                    id="rePassword" 
                    placeholder=""
                  >
                  <button
                    type="button"
                    class="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
                    style="border: none; background: none;"
                  >
                    <i class="fa fa-eye"></i>
                  </button>
                </div>
              </div>

              <div class="text-danger text-center mb-3" *ngIf="errorMsg">
                {{ errorMsg }}
              </div>

              <div class="text-center mb-3">
                <small class="text-muted">Forgot your password? </small>
                <a routerLink="/auth/forgot-password" class="text-success text-decoration-none">
                  <small>Reset it here</small>
                </a>
              </div>
              
              <div class="d-grid mb-3">
                <button 
                  type="submit" 
                  class="btn btn-success py-2"
                  [disabled]="signinForm.invalid || isLoading"
                  *ngIf="!isLoading"
                >
                  login
                </button>

                <button 
                  type="submit" 
                  class="btn btn-success py-2"
                  disabled
                  *ngIf="isLoading"
                >
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Loading...
                </button>
              </div>

              <div class="text-center">
                <small class="text-muted">Don't have an account yet? </small>
                <a routerLink="/auth/signup" class="text-success text-decoration-none">
                  <small>Signup</small>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SigninComponent {
  signinForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.isLoading = true;
      this.errorMsg = '';
      
      this.authService.login(this.signinForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/main']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsg = error.error?.message || 'Login failed. Please try again.';
        }
      });
    } else {
      this.signinForm.markAllAsTouched();
    }
  }
} 