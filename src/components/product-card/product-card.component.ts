import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../interfaces/product.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  template: `
    <div class="product cursor-pointer rounded-3 overflow-hidden position-relative h-100 d-flex flex-column">
      <a [routerLink]="['/main/product-details', product.slug, product._id]" class="text-decoration-none flex-grow-1 d-flex flex-column">
        <img
          [src]="product.imageCover"
          [alt]="product.title"
          class="d-block w-100 product-image mb-2"
          loading="lazy"
        />
        <h6 class="mt-2 mb-1 text-main font-sm">{{ product.category.name }}</h6>
        <h5 class="fs-6 fw-bold">
          {{ getShortTitle(product.title) }}
        </h5>
        <div class="d-flex justify-content-between my-3 mt-auto">
          <div>{{ product.price }} EGP</div>
          <div>
            <i class="fa-solid fa-star rating-color"></i>
            {{ product.ratingsAverage }}
          </div>
        </div>
      </a>
        
        <button
          class="btn btn-add bg-main text-white w-100 font-sm mb-2"
          (click)="addProductToCart(product._id)"
          [disabled]="isLoadingCart"
        >
          <span *ngIf="isLoadingCart">
            <span
              class="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </span>
          <span *ngIf="!isLoadingCart">
            <i class="fa-solid fa-cart-plus me-1"></i> Add Cart
          </span>
        </button>
        
        <!-- Wishlist Button -->
        <button
          class="btn w-100 font-sm"
          [class.btn-danger]="isInWishlist(product._id)"
          [class.btn-outline-danger]="!isInWishlist(product._id)"
          (click)="toggleWishlist(product._id)"
          [disabled]="isLoadingWishlist"
        >
          <span *ngIf="isLoadingWishlist">
            <span
              class="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isInWishlist(product._id) ? 'Removing...' : 'Adding...' }}
          </span>
          <span *ngIf="!isLoadingWishlist">
            <i class="fa-solid fa-heart me-1"></i>
            {{ isInWishlist(product._id) ? 'In Wishlist' : 'Add to Wishlist' }}
          </span>
        </button>
        
        <div class="overlay" *ngIf="!inSlider">
          <!-- Wishlist Button -->
          <button
            class="btn btn-wishlist px-2 py-1 rounded-1 position-absolute"
            (click)="toggleWishlist(product._id)"
            [disabled]="isLoadingWishlist"
          >
            <span *ngIf="isLoadingWishlist" 
                  class="spinner-border spinner-border-sm" 
                  role="status" 
                  aria-hidden="true">
            </span>
            <i *ngIf="!isLoadingWishlist && isInWishlist(product._id)" 
               class="fa-solid fa-heart"></i>
            <i *ngIf="!isLoadingWishlist && !isInWishlist(product._id)" 
               class="fa-regular fa-heart"></i>
          </button>
          
          <!-- View Images Button -->
          <button
            type="button"
            class="btn btn-view px-2 py-1 rounded-1 position-absolute mt-5"
            data-bs-toggle="modal"
            [attr.data-bs-target]="'#modal' + product._id"
          >
            <i class="fa-regular fa-image"></i>
          </button>
        </div>
        
        <!-- Modal for Images -->
        <app-product-modal 
          [product]="product" 
          [isLoadingCart]="isLoadingCart"
          (addToCart)="addProductToCart($event)">
        </app-product-modal>
    </div>
  `,
  styles: [`
    .product {
      border: solid 1px transparent;
      transition: all 0.3s ease;
      height: 100%;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 12px !important;
      padding: 15px;
    }
    
    .product:hover {
      box-shadow: 0 8px 25px rgba(0,0,0,0.12);
      border-color: var(--main-color, #198754);
      transform: translateY(-2px);
    }

    .product-image {
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
    }
    
    .product .btn-add {
      transition: transform 0.3s, opacity 0.3s;
      font-weight: 600;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    .product .btn-danger,
    .product .btn-outline-danger {
      transition: all 0.3s ease;
      font-weight: 600;
      border-radius: 6px;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      margin-top: 8px;
      position: relative;
      z-index: 10;
      background-color: #dc3545 !important;
      border-color: #dc3545 !important;
      color: white !important;
    }
    
    .product .btn-danger {
      background-color: #dc3545 !important;
      border-color: #dc3545 !important;
      color: white !important;
    }
    
    .product .btn-danger:hover {
      background-color: #bb2d3b !important;
      border-color: #b02a37 !important;
    }
    
    .product .btn-outline-danger {
      background-color: transparent !important;
      border-color: #dc3545 !important;
      color: #dc3545 !important;
    }
    
    .product .btn-outline-danger:hover {
      background-color: #dc3545 !important;
      border-color: #dc3545 !important;
      color: white !important;
    }
    
    .product:hover .btn-add {
      opacity: 1;
      transform: translateY(0%);
    }
    
    .product .overlay {
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .product:hover .overlay {
      opacity: 1;
    }
    
    .product .btn-wishlist {
      top: 5%;
      right: 5%;
      background-color: #fff;
      border: 1px solid #dfe2e1;
      color: #ad0a0a;
      transition: 0.3s;
    }
    
    .product .btn-wishlist:hover {
      background-color: #ad0a0a;
      border-color: #ad0a0a;
      color: #fff;
    }
    
    .product .btn-view {
      top: 5%;
      right: 5%;
      background-color: #fff;
      border: 1px solid #dfe2e1;
      color: #0a67ad;
      transition: 0.3s;
    }
    
    .product .btn-view:hover {
      background-color: #0a67ad;
      border-color: #0a67ad;
      color: #fff;
    }
    
    .rating-color {
      color: #ffc107;
    }
    
    .text-main {
      color: var(--main-color, #198754);
    }
    
    .bg-main {
      background-color: var(--main-color, #198754) !important;
    }
    
    .font-sm {
      font-size: 0.875rem;
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
    
    /* Wishlist Button Specific Styles */
    .btn.btn-danger,
    .btn.btn-outline-danger {
      font-size: 0.875rem !important;
      font-weight: 600 !important;
      padding: 8px 16px !important;
      border-radius: 6px !important;
      transition: all 0.3s ease !important;
      position: relative !important;
      z-index: 5 !important;
      margin-top: 8px !important;
    }
    
    .btn.btn-danger {
      background-color: #dc3545 !important;
      border-color: #dc3545 !important;
      color: white !important;
    }
    
    .btn.btn-danger:hover,
    .btn.btn-danger:focus {
      background-color: #bb2d3b !important;
      border-color: #b02a37 !important;
      color: white !important;
    }
    
    .btn.btn-outline-danger {
      background-color: transparent !important;
      border-color: #dc3545 !important;
      color: #dc3545 !important;
    }
    
    .btn.btn-outline-danger:hover,
    .btn.btn-outline-danger:focus {
      background-color: #dc3545 !important;
      border-color: #dc3545 !important;
      color: white !important;
    }
  `]
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() inSlider: boolean = false;
  
  isLoadingCart = false;
  isLoadingWishlist = false;
  wishlistProductIds: string[] = [];

  constructor(
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Subscribe to wishlist changes
    this.wishlistService.wishlistProductsId$.subscribe(ids => {
      this.wishlistProductIds = ids;
    });
  }

  getShortTitle(title: string): string {
    return title.split(' ').slice(0, 2).join(' ');
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistProductIds.includes(productId);
  }

  async addProductToCart(productId: string) {
    this.isLoadingCart = true;
    
    this.cartService.addToCart(productId).subscribe({
      next: (response) => {
        this.isLoadingCart = false;
        if (response.status === 'success') {
          this.toastr.success('Product added successfully');
          // Update cart counter if needed
        }
      },
      error: (error) => {
        this.isLoadingCart = false;
        this.toastr.error('Failed to add product to cart');
      }
    });
  }

  async toggleWishlist(productId: string) {
    this.isLoadingWishlist = true;
    
    if (this.isInWishlist(productId)) {
      // Remove from wishlist
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: (response) => {
          this.isLoadingWishlist = false;
          if (response.status === 'success') {
            this.toastr.error(response.message || 'Removed from wishlist');
            this.wishlistService.updateWishlistProductsId(response.data || []);
          }
        },
        error: () => {
          this.isLoadingWishlist = false;
          this.toastr.error('Failed to remove from wishlist');
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(productId).subscribe({
        next: (response) => {
          this.isLoadingWishlist = false;
          if (response.status === 'success') {
            this.toastr.success(response.message || 'Added to wishlist');
            this.wishlistService.updateWishlistProductsId(response.data || []);
          }
        },
        error: () => {
          this.isLoadingWishlist = false;
          this.toastr.error('Failed to add to wishlist');
        }
      });
    }
  }
}
