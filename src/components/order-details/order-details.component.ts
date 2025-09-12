import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-details',
  template: `
    <div class="order-details-container">
      <div class="container py-4">
        <h2 class="text-center mb-4">Order Details</h2>
        
        <div class="row" *ngIf="order">
          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Order Items</h5>
              </div>
              <div class="card-body">
                <div class="order-item mb-3" *ngFor="let item of order.cartItems">
                  <div class="row align-items-center">
                    <div class="col-md-2">
                      <img [src]="item.product.imageCover" class="img-fluid rounded" [alt]="item.product.title">
                    </div>
                    <div class="col-md-6">
                      <h6 class="mb-1">{{ item.product.title }}</h6>
                      <small class="text-muted">Quantity: {{ item.count }}</small>
                    </div>
                    <div class="col-md-4 text-end">
                      <span class="h6 text-primary">{{ item.price | currency }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Order Summary</h5>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span>Order ID:</span>
                  <span>{{ order._id }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Date:</span>
                  <span>{{ order.createdAt | date }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Payment Method:</span>
                  <span>{{ order.paymentMethodType }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Status:</span>
                  <span class="badge" [ngClass]="getStatusBadgeClass()">
                    {{ getStatusText() }}
                  </span>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong class="h5 text-primary">{{ order.totalOrderPrice | currency }}</strong>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Shipping Address</h5>
              </div>
              <div class="card-body">
                <p><strong>{{ order.shippingAddress.alias }}</strong></p>
                <p>{{ order.shippingAddress.details }}</p>
                <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}</p>
                <p>Phone: {{ order.shippingAddress.phone }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center" *ngIf="!order && isLoading">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h5 class="mt-3 text-muted">Loading order details...</h5>
        </div>
        
        <div class="text-center" *ngIf="!order && !isLoading && errorMessage">
          <i class="fas fa-exclamation-triangle display-1 text-danger"></i>
          <h4 class="text-danger mt-3">{{ errorMessage }}</h4>
          <button class="btn btn-primary" (click)="loadOrderDetails()">Try Again</button>
          <a routerLink="/main/allorders" class="btn btn-outline-secondary ms-2">Back to Orders</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-details-container {
      min-height: 100vh;
    }
    
    .order-item {
      border-bottom: 1px solid #eee;
      padding-bottom: 1rem;
    }
    
    .order-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .order-item img {
      max-width: 80px;
      height: 80px;
      object-fit: cover;
    }
  `]
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    console.log('=== ORDER DETAILS COMPONENT INIT ===');
    console.log('OrderDetailsComponent initialized');
    console.log('Current URL:', this.router.url);
    this.loadOrderDetails();
  }

  loadOrderDetails() {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    console.log('Loading order details for orderId:', orderId);
    
    if (!orderId) {
      this.errorMessage = 'Order ID not found';
      this.toastr.error('Order ID not found', 'Error');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('Making API call to get order details:', orderId);
    
    this.orderService.getOrderById(orderId).subscribe({
      next: (response) => {
        console.log('=== ORDER DETAILS API RESPONSE ===');
        console.log('Raw API response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', response ? Object.keys(response) : 'null');
        
        // The response might be wrapped in a data property
        this.order = response?.data || response;
        console.log('Final order object:', this.order);
        
        this.isLoading = false;
        if (this.order) {
          this.toastr.success('Order details loaded successfully!', 'Success');
        } else {
          this.errorMessage = 'Order not found';
          this.toastr.error('Order not found', 'Error');
        }
      },
      error: (error) => {
        console.error('=== ORDER DETAILS API ERROR ===');
        console.error('Error loading order details:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
        
        this.isLoading = false;
        this.errorMessage = 'Failed to load order details';
        
        if (error.status === 404) {
          this.toastr.error('Order not found', 'Error');
        } else if (error.status === 401) {
          this.toastr.error('Please login again', 'Authentication Error');
        } else {
          this.toastr.error('Failed to load order details', 'Error');
        }
      }
    });
  }

  getStatusText(): string {
    if (!this.order) return '';
    if (this.order.isDelivered) return 'Delivered';
    if (this.order.isPaid) return 'Paid';
    return 'Pending';
  }

  getStatusBadgeClass(): string {
    if (!this.order) return '';
    if (this.order.isDelivered) return 'bg-success';
    if (this.order.isPaid) return 'bg-warning';
    return 'bg-secondary';
  }
} 