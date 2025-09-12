import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../interfaces/product.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  template: `
    <div class="wishlist-container">
      <div class="container py-4">
        <h2 class="text-center mb-4">My Wishlist</h2>
        
        <div class="row" *ngIf="wishlistItems.length > 0">
          <app-product-card 
            *ngFor="let product of wishlistItems" 
            [product]="product">
          </app-product-card>
        </div>
        
        <div class="text-center" *ngIf="wishlistItems.length === 0 && !isLoading">
          <i class="fas fa-heart display-1 text-muted"></i>
          <h4 class="text-muted mt-3">Your wishlist is empty</h4>
          <p class="text-muted">Add some products to your wishlist to see them here.</p>
          <a routerLink="/main/products" class="btn btn-primary">Browse Products</a>
        </div>
        
        <div class="text-center" *ngIf="isLoading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-container {
      min-height: 100vh;
    }
    
    .product-card {
      transition: transform 0.3s ease;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
    }
    
    .product-card img {
      height: 200px;
      object-fit: cover;
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];
  isLoading = false;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlistItems = response.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.wishlistItems = [];
        this.isLoading = false;
      }
    });
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.toastr.success('Removed from wishlist');
          this.loadWishlist(); // Reload wishlist
          this.wishlistService.updateWishlistProductsId(response.data || []);
        }
      },
      error: () => {
        this.toastr.error('Failed to remove from wishlist');
      }
    });
  }
} 