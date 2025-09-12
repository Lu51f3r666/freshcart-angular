import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../../interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartDetails: Cart | null = null;
  isLoading = true;
  isLoadingClear = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCartDetails();
  }

  getCartDetails(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cartDetails = response.data;
        this.isLoading = false;
        
        // Initialize loading states for each item
        if (this.cartDetails && this.cartDetails.products) {
          this.cartDetails.products.forEach(item => {
            item.isLoadingUpdate = false;
            item.isLoadingRemove = false;
          });
        }
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.isLoading = false;
        this.toastr.error('Failed to load cart', 'Error');
      }
    });
  }

  updateQuantity(productId: string, newCount: number): void {
    if (!this.cartDetails || newCount < 1) return;

    const item = this.cartDetails.products.find(p => 
      (p.product.id && p.product.id === productId) || 
      (p.product._id && p.product._id === productId)
    );
    
    if (item) {
      item.isLoadingUpdate = true;
    }

    this.cartService.updateCartItem(productId, newCount).subscribe({
      next: (response) => {
        this.cartDetails = response.data;
        
        // Reset loading states
        if (this.cartDetails && this.cartDetails.products) {
          this.cartDetails.products.forEach(item => {
            item.isLoadingUpdate = false;
            item.isLoadingRemove = false;
          });
        }
        
        this.toastr.success('Cart updated successfully', 'Success');
      },
      error: (error) => {
        console.error('Error updating cart:', error);
        if (item) {
          item.isLoadingUpdate = false;
        }
        this.toastr.error('Failed to update cart', 'Error');
      }
    });
  }

  removeItem(productId: string): void {
    if (!this.cartDetails) return;

    const item = this.cartDetails.products.find(p => 
      (p.product.id && p.product.id === productId) || 
      (p.product._id && p.product._id === productId)
    );
    
    if (item) {
      item.isLoadingRemove = true;
    }

    this.cartService.removeFromCart(productId).subscribe({
      next: (response) => {
        this.cartDetails = response.data;
        
        // Reset loading states for remaining items
        if (this.cartDetails && this.cartDetails.products) {
          this.cartDetails.products.forEach(item => {
            item.isLoadingUpdate = false;
            item.isLoadingRemove = false;
          });
        }
        
        this.toastr.success('Item removed from cart', 'Success');
      },
      error: (error) => {
        console.error('Error removing item:', error);
        if (item) {
          item.isLoadingRemove = false;
        }
        this.toastr.error('Failed to remove item', 'Error');
      }
    });
  }

  clearCart(): void {
    this.isLoadingClear = true;
    
    this.cartService.clearCart().subscribe({
      next: (response) => {
        this.cartDetails = null;
        this.isLoadingClear = false;
        this.toastr.success('Cart cleared successfully', 'Success');
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.isLoadingClear = false;
        this.toastr.error('Failed to clear cart', 'Error');
      }
    });
  }

  proceedToCheckout(): void {
    console.log('=== PROCEEDING TO CHECKOUT ===');
    console.log('Cart Details:', this.cartDetails);
    
    if (!this.cartDetails || !this.cartDetails._id) {
      console.error('Cart is empty or invalid');
      this.toastr.error('Cart is empty or invalid', 'Error');
      return;
    }
    
    const navigationPath = ['/main/shippingAddress', this.cartDetails._id];
    console.log('Navigating to:', navigationPath);
    this.router.navigate(navigationPath);
  }

  getShortTitle(title: string): string {
    if (!title) return '';
    const words = title.split(' ');
    return words.length > 2 ? words.slice(0, 2).join(' ') + '...' : title;
  }

  getProductId(product: any): string {
    return product.id || product._id || '';
  }
}
