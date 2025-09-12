import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-modal',
  template: `
    <!-- Modal -->
    <div class="modal fade" [id]="'modal' + product._id" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">{{ product.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <!-- Main Image -->
                <img [src]="selectedImage || product.imageCover" 
                     [alt]="product.title" 
                     class="img-fluid main-modal-image mb-3">
                
                <!-- Thumbnail Images -->
                <div class="d-flex flex-wrap gap-2" *ngIf="product.images && product.images.length > 0">
                  <img 
                    *ngFor="let image of product.images" 
                    [src]="image" 
                    [alt]="product.title"
                    class="thumbnail-modal-image cursor-pointer"
                    [class.active]="selectedImage === image"
                    (click)="selectImage(image)"
                  >
                </div>
              </div>
              
              <div class="col-md-6">
                <h6 class="text-main">{{ product.category.name }}</h6>
                <h4 class="fw-bold">{{ product.title }}</h4>
                <p class="text-muted">{{ product.description }}</p>
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="h4 text-primary">{{ product.price }} EGP</div>
                  <div>
                    <i class="fa-solid fa-star rating-color"></i>
                    {{ product.ratingsAverage }}
                  </div>
                </div>
                
                <div class="mb-3" *ngIf="product.priceAfterDiscount">
                  <span class="text-decoration-line-through text-muted me-2">{{ product.price }} EGP</span>
                  <span class="h5 text-success">{{ product.priceAfterDiscount }} EGP</span>
                </div>
                
                <button 
                  class="btn bg-main text-white w-100"
                  (click)="onAddToCart()"
                  [disabled]="isLoadingCart"
                >
                  <span *ngIf="isLoadingCart">
                    <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                    Loading...
                  </span>
                  <span *ngIf="!isLoadingCart">
                    <i class="fa-solid fa-cart-plus me-1"></i>
                    Add to Cart
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-modal-image {
      max-height: 300px;
      object-fit: contain;
      width: 100%;
    }
    
    .thumbnail-modal-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border: 2px solid transparent;
      border-radius: 4px;
      transition: border-color 0.3s;
    }
    
    .thumbnail-modal-image:hover,
    .thumbnail-modal-image.active {
      border-color: var(--main-color, #198754);
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
    
    .cursor-pointer {
      cursor: pointer;
    }
  `]
})
export class ProductModalComponent {
  @Input() product!: Product;
  @Input() isLoadingCart: boolean = false;
  @Output() addToCart = new EventEmitter<string>();
  
  selectedImage: string = '';

  ngOnInit() {
    this.selectedImage = this.product.imageCover;
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  onAddToCart() {
    this.addToCart.emit(this.product._id);
  }
}
