import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../interfaces/product.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  template: `
    <div class="product-details-container">
      <div class="container py-4">
        <div *ngIf="product; else loading">
          <div class="row">
            <!-- Product Images -->
            <div class="col-md-6">
              <div class="product-images">
                <div class="main-image-container mb-3 position-relative">
                  <div class="image-wrapper d-flex align-items-center justify-content-center position-relative">
                    <img 
                      [src]="mainImage || product.imageCover" 
                      class="img-fluid main-image cursor-pointer" 
                      [alt]="product.title"
                      (click)="openImageModal(mainImage || product.imageCover)"
                      data-bs-toggle="modal" 
                      data-bs-target="#imageModal"
                    >
                    <div class="zoom-overlay position-absolute">
                      <i class="fas fa-search-plus fa-2x"></i>
                      <div class="mt-2">Click to zoom</div>
                    </div>
                  </div>
                  
                  <!-- Navigation Arrows - Outside Image -->
                  <div class="external-navigation" *ngIf="product?.images && product.images.length > 1">
                    <button 
                      class="btn btn-light btn-nav-external btn-prev-external" 
                      (click)="previousImage()"
                      [disabled]="getCurrentImageIndex() === 0">
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <button 
                      class="btn btn-light btn-nav-external btn-next-external" 
                      (click)="nextImage()"
                      [disabled]="getCurrentImageIndex() === (product.images.length || 0) - 1">
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Thumbnail Images -->
                <div class="thumbnail-images" *ngIf="product?.images && product.images.length > 1">
                  <div class="row g-2">
                    <div class="col-3" *ngFor="let image of product.images; let i = index">
                      <div class="thumbnail-wrapper position-relative">
                        <img 
                          [src]="image" 
                          class="thumbnail-image w-100 cursor-pointer"
                          [class.active-thumbnail]="image === mainImage"
                          [alt]="product.title + ' - Image ' + (i + 1)"
                          (click)="setMainImage(image)"
                        >
                        <div class="thumbnail-number position-absolute">{{ i + 1 }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Dots Navigation -->
                <div class="dots-navigation text-center mt-3" *ngIf="product?.images && product.images.length > 1">
                  <span 
                    *ngFor="let image of product.images; let i = index"
                    class="dot cursor-pointer me-2 position-relative"
                    [class.active-dot]="image === mainImage"
                    (click)="setMainImage(image)"
                    [title]="'Image ' + (i + 1) + ' - Press ' + (i + 1) + ' to navigate'"
                  >
                    <span class="dot-number">{{ i + 1 }}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="col-md-6">
              <h2 class="mb-3">{{ product.title }}</h2>
              <p class="text-muted mb-3">{{ product.description }}</p>
              
              <div class="mb-3">
                <span class="h3 text-primary me-3">{{ product.priceAfterDiscount || product.price | currency }}</span>
                <span class="text-muted text-decoration-line-through" *ngIf="product.priceAfterDiscount">
                  {{ product.price | currency }}
                </span>
              </div>
              
              <div class="mb-3">
                <span class="badge bg-success me-2">{{ product.ratingsAverage }} ★</span>
                <span class="text-muted">({{ product.ratingsQuantity }} reviews)</span>
              </div>
              
              <div class="mb-3">
                <strong>Category:</strong> {{ product.category.name }}
              </div>
              
              <div class="mb-3">
                <strong>Brand:</strong> {{ product.brand.name }}
              </div>
              
              <div class="mb-3">
                <strong>Availability:</strong> 
                <span class="text-success" *ngIf="product.quantity > 0">In Stock ({{ product.quantity }})</span>
                <span class="text-danger" *ngIf="product.quantity === 0">Out of Stock</span>
              </div>
              
              <div class="mb-3" *ngIf="product.colors.length > 0">
                <strong>Colors:</strong>
                <div class="mt-2">
                  <span 
                    *ngFor="let color of product.colors" 
                    class="color-swatch me-2"
                    [style.background-color]="color"
                    [title]="color"
                  ></span>
                </div>
              </div>
              
              <div class="d-grid gap-3 buttons-container">
                <button 
                  class="btn btn-primary btn-lg"
                  (click)="addToCart()"
                  [disabled]="product.quantity === 0"
                >
                  <i class="fas fa-shopping-cart me-2"></i>
                  Add to Cart
                </button>
                <button 
                  class="btn btn-lg w-100"
                  [class.btn-danger]="isInWishlist()"
                  [class.btn-outline-danger]="!isInWishlist()"
                  (click)="toggleWishlist()"
                  [disabled]="isLoadingWishlist"
                >
                  <span *ngIf="isLoadingWishlist">
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    {{ isInWishlist() ? 'Removing...' : 'Adding...' }}
                  </span>
                  <span *ngIf="!isLoadingWishlist">
                    <i class="fa-solid fa-heart me-1"></i>
                    {{ isInWishlist() ? 'In Wishlist' : 'Add to Wishlist' }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <ng-template #loading>
          <div class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </ng-template>
        
        <!-- Image Modal -->
        <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="imageModalLabel">{{ product?.title }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body text-center p-0">
                <img [src]="modalImage" class="img-fluid" [alt]="product?.title" style="max-height: 70vh;">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-details-container {
      min-height: 100vh;
    }
    
    .main-image-container {
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      background-color: #f8f9fa;
    }
    
    .image-wrapper {
      min-height: 400px;
      max-height: 500px;
      padding: 20px;
    }
    
    .main-image {
      width: 100%;
      max-width: 100%;
      max-height: 460px;
      object-fit: contain;
      transition: transform 0.3s ease;
      border-radius: 8px;
    }
    
    .main-image:hover {
      transform: scale(1.02);
    }
    
    .zoom-overlay {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      font-size: 14px;
    }
    
    .image-wrapper:hover .zoom-overlay {
      opacity: 1;
    }
    
    .btn-nav {
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #333;
    }
    
    .main-image-container:hover .btn-nav {
      opacity: 1;
    }
    
    .btn-nav:hover {
      background: white;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      color: #0d6efd;
    }
    
    .btn-nav:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      transform: translateY(-50%);
    }
    
    .btn-nav:disabled:hover {
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-50%);
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      color: #999;
    }
    
    .btn-prev {
      left: 20px;
    }
    
    .btn-next {
      right: 20px;
    }
    
    .external-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      padding: 0 20px;
    }
    
    .btn-nav-external {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 2px solid #dee2e6;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #333;
    }
    
    .btn-nav-external:hover {
      background: #f8f9fa;
      border-color: #0d6efd;
      color: #0d6efd;
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .btn-nav-external:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
      background: #f8f9fa;
      color: #6c757d;
    }
    
    .btn-nav-external:disabled:hover {
      border-color: #dee2e6;
      color: #6c757d;
      transform: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .thumbnail-images {
      padding: 10px 0;
    }
    
    .thumbnail-wrapper {
      position: relative;
    }
    
    .thumbnail-image {
      height: 80px;
      object-fit: contain;
      border-radius: 8px;
      border: 3px solid transparent;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      background-color: #f8f9fa;
      padding: 4px;
    }
    
    .thumbnail-number {
      top: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      font-size: 10px;
      font-weight: 600;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-shadow: none;
    }
    
    .thumbnail-image:hover {
      border-color: #0d6efd;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .thumbnail-image.active-thumbnail {
      border-color: #0d6efd;
      box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
    }
    
    .thumbnail-wrapper:hover .thumbnail-number {
      background: #0d6efd;
    }
    
    .color-swatch {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid #ddd;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .color-swatch:hover {
      transform: scale(1.1);
      border-color: #0d6efd;
    }
    
    .btn-danger .fa-heart {
      color: white;
    }
    
    .btn-outline-danger .fa-heart {
      color: #dc3545;
    }
    
    .btn.btn-danger,
    .btn.btn-outline-danger {
      font-size: 18px !important;
      font-weight: 600 !important;
      padding: 14px 28px !important;
      border-radius: 8px !important;
      transition: all 0.3s ease !important;
      position: relative !important;
      z-index: 5 !important;
      margin-top: 0 !important;
      display: block !important;
      width: 100% !important;
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
    
    .btn-outline-danger:hover {
      background-color: #dc3545 !important;
      border-color: #dc3545 !important;
      color: white !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    }
    
    .btn-outline-danger:hover .fa-heart {
      color: white !important;
    }
    
    .btn-primary {
      background-color: #0d6efd !important;
      border-color: #0d6efd !important;
      color: white !important;
      font-weight: 600;
      padding: 14px 28px;
      font-size: 18px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      background-color: #0b5ed7 !important;
      border-color: #0a58ca !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
    }
    
    .buttons-container {
      margin-top: 20px !important;
      padding: 10px 0 !important;
      position: relative !important;
      z-index: 1 !important;
    }
    
    .buttons-container .btn {
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
      position: relative !important;
      z-index: 2 !important;
    }
    
    .d-grid {
      gap: 16px !important;
      display: grid !important;
    }
    
    .d-grid .btn {
      width: 100% !important;
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
      margin: 0 !important;
    }
    
    .btn {
      display: inline-block !important;
      opacity: 1 !important;
      visibility: visible !important;
      position: relative !important;
    }
    
    .btn-lg {
      padding: 14px 28px !important;
      font-size: 18px !important;
      line-height: 1.5 !important;
      border-radius: 8px !important;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
    
    .dots-navigation {
      padding: 20px 0;
      text-align: center;
    }
    
    .dot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      cursor: pointer;
      margin: 0 5px;
      border: 2px solid transparent;
    }
    
    .dot-number {
      font-size: 12px;
      font-weight: 700;
      color: white;
      text-shadow: 0 1px 3px rgba(0,0,0,0.7);
    }
    
    .dot:hover {
      background-color: rgba(0, 0, 0, 0.5);
      transform: scale(1.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    .dot.active-dot {
      background-color: #0d6efd;
      transform: scale(1.25);
      box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
    }
    
    .dot.active-dot .dot-number {
      color: white;
      font-weight: 700;
    }
    
    .dot::before {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      border-radius: 50%;
      background: transparent;
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  mainImage: string = '';
  modalImage: string = '';
  isLoadingWishlist: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(productId: string) {
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        this.product = response.data;
        this.mainImage = this.product.imageCover;
        
        // Ensure imageCover is included in images array if not already present
        if (this.product?.images && !this.product.images.includes(this.product.imageCover)) {
          this.product.images.unshift(this.product.imageCover);
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.toastr.error('Failed to load product details', 'Error');
      }
    });
  }

  setMainImage(imageUrl: string) {
    this.mainImage = imageUrl;
    // Smooth scroll to main image when changed via dots (optional)
    const mainImageElement = document.querySelector('.main-image');
    if (mainImageElement) {
      mainImageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  openImageModal(imageUrl: string) {
    this.modalImage = imageUrl;
  }

  getCurrentImageIndex(): number {
    if (!this.product?.images) return 0;
    return this.product.images.findIndex(img => img === this.mainImage);
  }

  previousImage() {
    if (!this.product?.images) return;
    const currentIndex = this.getCurrentImageIndex();
    if (currentIndex > 0) {
      this.setMainImage(this.product.images[currentIndex - 1]);
    }
  }

  nextImage() {
    if (!this.product?.images) return;
    const currentIndex = this.getCurrentImageIndex();
    if (currentIndex < this.product.images.length - 1) {
      this.setMainImage(this.product.images[currentIndex + 1]);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.product?.images || this.product.images.length <= 1) return;
    
    switch(event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextImage();
        break;
      // Navigate by number keys (1, 2, 3, etc.)
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        const imageIndex = parseInt(event.key) - 1;
        if (imageIndex < this.product.images.length) {
          event.preventDefault();
          this.setMainImage(this.product.images[imageIndex]);
        }
        break;
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product._id).subscribe({
        next: () => {
          this.toastr.success('Product added to cart!', 'Success');
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.toastr.error('Failed to add product to cart', 'Error');
        }
      });
    }
  }

  addToWishlist() {
    if (this.product && !this.isLoadingWishlist) {
      this.isLoadingWishlist = true;
      
      this.wishlistService.addToWishlist(this.product._id).subscribe({
        next: (response) => {
          this.isLoadingWishlist = false;
          this.wishlistService.loadWishlistIds(); // Refresh wishlist state
          this.toastr.success('Product added to wishlist!', 'Success');
        },
        error: (error) => {
          this.isLoadingWishlist = false;
          console.error('Error adding to wishlist:', error);
          this.toastr.error('Failed to add product to wishlist', 'Error');
        }
      });
    }
  }

  removeFromWishlist() {
    if (this.product && !this.isLoadingWishlist) {
      this.isLoadingWishlist = true;
      
      this.wishlistService.removeFromWishlist(this.product._id).subscribe({
        next: (response) => {
          this.isLoadingWishlist = false;
          this.wishlistService.loadWishlistIds(); // Refresh wishlist state
          this.toastr.success('Product removed from wishlist!', 'Success');
        },
        error: (error) => {
          this.isLoadingWishlist = false;
          console.error('Error removing from wishlist:', error);
          this.toastr.error('Failed to remove product from wishlist', 'Error');
        }
      });
    }
  }

  toggleWishlist() {
    if (this.isInWishlist()) {
      this.removeFromWishlist();
    } else {
      this.addToWishlist();
    }
  }

  isInWishlist(): boolean {
    if (!this.product) return false;
    return this.wishlistService.isInWishlist(this.product._id);
  }
} 