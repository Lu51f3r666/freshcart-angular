import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Address } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-address',
  template: `
    <div class="address-container min-vh-100 bg-light">
      <div class="container py-5">
        
        <!-- Debug Info -->
        <div class="alert alert-info mb-4" *ngIf="cartId">
          <strong>Debug:</strong> Cart ID = {{cartId}}
        </div>
        
        <h2 class="text-center mb-5" style="color: #495057;">Shipping Address</h2>
        
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card shadow-sm border-0">
              <div class="card-body p-4">
                <form [formGroup]="addressForm" (ngSubmit)="onSubmit()">
                  
                  <div class="mb-4">
                    <label for="details" class="form-label fw-semibold">Details</label>
                    <textarea 
                      class="form-control form-control-lg" 
                      id="details" 
                      rows="3"
                      formControlName="details"
                      placeholder="Enter your full address details..."
                      [class.is-invalid]="addressForm.get('details')?.invalid && addressForm.get('details')?.touched"
                    ></textarea>
                    <div class="invalid-feedback" *ngIf="addressForm.get('details')?.invalid && addressForm.get('details')?.touched">
                      Address details are required (minimum 10 characters).
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label for="phone" class="form-label fw-semibold">Phone</label>
                    <input 
                      type="tel" 
                      class="form-control form-control-lg" 
                      id="phone" 
                      formControlName="phone"
                      placeholder="01xxxxxxxxx"
                      [class.is-invalid]="addressForm.get('phone')?.invalid && addressForm.get('phone')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="addressForm.get('phone')?.invalid && addressForm.get('phone')?.touched">
                      Please enter a valid Egyptian phone number.
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label for="city" class="form-label fw-semibold">City</label>
                    <input 
                      type="text" 
                      class="form-control form-control-lg" 
                      id="city" 
                      formControlName="city"
                      placeholder="Enter your city"
                      [class.is-invalid]="addressForm.get('city')?.invalid && addressForm.get('city')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="addressForm.get('city')?.invalid && addressForm.get('city')?.touched">
                      City is required.
                    </div>
                  </div>
                  
                  <div class="d-grid mt-4">
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg py-3"
                      [disabled]="addressForm.invalid || isLoading"
                    >
                      <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading"></span>
                      {{ isLoading ? 'Processing...' : 'Pay now' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .address-container {
      min-height: 100vh;
    }
    
    .form-control:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
  `]
})
export class AddressComponent implements OnInit {
  addressForm: FormGroup;
  isLoading = false;
  cartId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.addressForm = this.fb.group({
      details: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.cartId = this.route.snapshot.paramMap.get('cartId') || '';
    console.log('Address component loaded with cartId:', this.cartId);
    
    if (!this.cartId) {
      this.toastr.error('Invalid cart ID', 'Error');
      this.router.navigate(['/main/cart']);
    }
  }

  onSubmit() {
    if (this.addressForm.valid) {
      this.isLoading = true;
      const shippingAddress = this.addressForm.value as Address;
      
      console.log('Starting order creation...');
      console.log('Shipping address:', shippingAddress);
      console.log('Cart ID:', this.cartId);
      
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      // Create cash order using OrderService
      this.orderService.createCashOrder(this.cartId, shippingAddress).subscribe({
        next: (response) => {
          console.log('Order created successfully:', response);
          console.log('Order response status:', response?.status);
          console.log('Order response data:', response?.data);
          
          // Check success like React does
          if (response?.status === 'success') {
            this.isLoading = false;
            this.toastr.success('Order placed successfully!', 'Success');
            // Navigate to orders page to see the new order (like React)
            setTimeout(() => {
              this.router.navigate(['/main/allorders']);
            }, 1000);
          } else {
            this.isLoading = false;
            this.toastr.error('Failed to place order. Please try again.', 'Error');
          }
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.isLoading = false;
          
          // Show more detailed error message
          let errorMessage = 'Failed to place order. Please try again.';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.toastr.error(errorMessage, 'Error');
        }
      });
    } else {
      this.addressForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly', 'Error');
    }
  }
} 