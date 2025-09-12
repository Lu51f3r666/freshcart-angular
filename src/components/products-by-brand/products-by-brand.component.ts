import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-products-by-brand',
  template: `
    <div class="products-by-brand-container">
      <div class="container py-4">
        <h2 class="text-center mb-4">{{ brandName }} Products</h2>
        
        <div class="row g-3" *ngIf="products.length > 0">
          <div class="col-lg-4 col-md-6 col-sm-6" *ngFor="let product of products">
            <app-product-card 
              [product]="product"
              [inSlider]="true">
            </app-product-card>
          </div>
        </div>
        
        <div class="text-center" *ngIf="products.length === 0 && !isLoading">
          <i class="fas fa-box-open display-1 text-muted"></i>
          <h4 class="text-muted mt-3">No products found for this brand</h4>
          <p class="text-muted">Try browsing other brands.</p>
          <a routerLink="/brands" class="btn btn-primary">Browse Brands</a>
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
    .products-by-brand-container {
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
export class ProductsByBrandComponent implements OnInit {
  products: Product[] = [];
  brandName: string = '';
  brandId: string = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.brandName = params['brandName'];
      this.brandId = params['brandId'];
      this.loadProducts();
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProductsByBrand(this.brandId).subscribe({
      next: (response: any) => {
        this.products = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading products by brand:', error);
        this.isLoading = false;
      }
    });
  }
} 