import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-orders',
  template: `
    <div class="orders-container">
      <div class="container py-4">
        <h2 class="text-center mb-4">My Orders</h2>
        
        <div class="row" *ngIf="orders.length > 0">
          <div class="col-12 mb-4" *ngFor="let order of orders">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Order #{{ order._id }}</h6>
                <span class="badge" [ngClass]="getStatusBadgeClass(order)">
                  {{ getStatusText(order) }}
                </span>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-8">
                    <p><strong>Total:</strong> {{ order.totalOrderPrice | currency }}</p>
                    <p><strong>Date:</strong> {{ order.createdAt | date }}</p>
                    <p><strong>Payment Method:</strong> {{ order.paymentMethodType }}</p>
                  </div>
                  <div class="col-md-4 text-end">
                    <a [routerLink]="['/main/order-details', order._id]" class="btn btn-primary btn-sm">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center" *ngIf="orders.length === 0 && !isLoading && !errorMessage">
          <div class="empty-orders-container">
            <i class="fas fa-shopping-bag display-1 text-muted mb-3"></i>
            <h4 class="text-muted mb-3">No orders yet</h4>
            <p class="text-muted mb-4">Start shopping to see your orders here</p>
            <div class="instructions-card mb-4">
              <h6 class="text-primary mb-2">
                <i class="fas fa-lightbulb text-warning me-2"></i>
                How to place an order:
              </h6>
              <div class="steps-list text-start">
                <div class="step-item">
                  <i class="fas fa-plus-circle text-success me-2"></i>
                  Add products to cart
                </div>
                <div class="step-item">
                  <i class="fas fa-shopping-cart text-primary me-2"></i>
                  Go to cart
                </div>
                <div class="step-item">
                  <i class="fas fa-credit-card text-info me-2"></i>
                  Proceed to checkout
                </div>
                <div class="step-item">
                  <i class="fas fa-map-marker-alt text-warning me-2"></i>
                  Enter shipping address
                </div>
                <div class="step-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  Pay now
                </div>
              </div>
            </div>
            <div class="d-flex gap-3 justify-content-center">
              <a routerLink="/main/products" class="btn btn-primary btn-lg">
                <i class="fas fa-store me-2"></i>
                Browse Products
              </a>
              <a routerLink="/main/cart" class="btn btn-outline-secondary btn-lg">
                <i class="fas fa-shopping-cart me-2"></i>
                View Cart
              </a>
            </div>
          </div>
        </div>

        <div class="text-center" *ngIf="errorMessage">
          <i class="fas fa-exclamation-triangle display-1 text-danger"></i>
          <h4 class="text-danger mt-3">{{ errorMessage }}</h4>
          <button class="btn btn-primary" (click)="loadOrders()">Try Again</button>
        </div>
        
        <div class="text-center" *ngIf="isLoading">
          <div class="loading-container">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Loading...</span>
            </div>
            <h5 class="mt-3 text-muted">Loading orders...</h5>
            <p class="text-muted small">Please wait</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .badge {
      font-size: 0.8rem;
    }
    
    .empty-orders-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .instructions-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #e9ecef;
    }
    
    .steps-list {
      max-width: 300px;
      margin: 0 auto;
    }
    
    .step-item {
      padding: 8px 0;
      font-size: 14px;
      color: #495057;
    }
    
    .card {
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #e9ecef;
      margin-bottom: 20px;
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }
  `]
})
export class AllOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('=== ALL ORDERS COMPONENT INIT ===');
    console.log('AllOrdersComponent initialized');
    console.log('Component URL:', window.location.href);
    console.log('Current time:', new Date().toISOString());
    
    // Check localStorage first
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log('Token in localStorage:', token ? 'exists' : 'missing');
    console.log('UserId in localStorage:', userId);
    
    // Check AuthService state
    const currentUser = this.authService.currentUserValue;
    console.log('Current user from AuthService:', currentUser);
    
    this.loadOrders();
  }

  loadOrders() {
    console.log('=== LOAD ORDERS DEBUGGING ===');
    console.log('Starting to load orders...');
    this.isLoading = true;
    this.errorMessage = '';
    
    // Check localStorage
    const tokenLS = localStorage.getItem('token');
    const userIdLS = localStorage.getItem('userId');
    console.log('Token from localStorage:', tokenLS ? tokenLS.substring(0, 20) + '...' : 'missing');
    console.log('UserId from localStorage:', userIdLS);
    
    const userId = this.authService.getUserId();
    console.log('User ID from AuthService:', userId);
    
    if (!userId) {
      console.log('No user ID found, redirecting to login');
      this.errorMessage = 'Please log in to view your orders';
      this.isLoading = false;
      this.toastr.error('Please log in to view your orders', 'Authentication Error', {
        timeOut: 5000,
        progressBar: true
      });
      setTimeout(() => {
        this.router.navigate(['/auth/signin']);
      }, 2000);
      return;
    }

    console.log('Making API call to get orders for user:', userId);
    console.log('Full API URL:', `${this.orderService['baseUrl']}/orders/user/${userId}`);
    
    this.orderService.getAllOrders(userId).subscribe({
      next: (response) => {
        console.log('=== API RESPONSE RECEIVED ===');
        console.log('Raw API response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', response ? Object.keys(response) : 'null');
        console.log('Response.data:', response?.data);
        console.log('Response.data type:', typeof response?.data);
        console.log('Response.data.length:', response?.data?.length);
        
        // React expects data in response
        this.orders = response?.data || response || [];
        console.log('Final orders array:', this.orders);
        console.log('Orders length:', this.orders.length);
        console.log('Orders content:', JSON.stringify(this.orders, null, 2));
        
        this.isLoading = false;
        if (this.orders.length === 0) {
          console.log('No orders found for user');
          this.toastr.info('No orders found. Start shopping to create your first order!', 'No Orders', {
            timeOut: 5000,
            progressBar: true
          });
        } else {
          console.log(`Found ${this.orders.length} orders`);
          this.toastr.success(`Found ${this.orders.length} order(s)!`, 'Orders Loaded', {
            timeOut: 3000,
            progressBar: true
          });
        }
      },
      error: (error) => {
        console.error('=== API ERROR ===');
        console.error('Error loading orders:', error);
        console.error('Error status:', error.status);
        console.error('Error statusText:', error.statusText);
        console.error('Error body:', error.error);
        console.error('Error message:', error.message);
        
        this.errorMessage = 'Failed to load orders. Please try again.';
        this.isLoading = false;
        
        if (error.status === 404) {
          this.toastr.info('No orders found for this user', 'No Orders', {
            timeOut: 4000,
            progressBar: true
          });
        } else if (error.status === 401) {
          this.toastr.error('Please login again', 'Authentication Error', {
            timeOut: 5000,
            progressBar: true
          });
        } else {
          this.toastr.error('Failed to load orders. Please try again.', 'Error', {
            timeOut: 5000,
            progressBar: true
          });
        }
      }
    });
  }

  getStatusText(order: Order): string {
    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Paid';
    return 'Pending';
  }

  getStatusBadgeClass(order: Order): string {
    if (order.isDelivered) return 'bg-success';
    if (order.isPaid) return 'bg-warning';
    return 'bg-secondary';
  }
} 