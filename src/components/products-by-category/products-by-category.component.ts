import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-products-by-category',
  template: `
    <div class="products-by-category-container">
      <div class="container py-4">
        <h2 class="text-center mb-4">{{ categoryName }} Products</h2>
        
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
          <h4 class="text-muted mt-3">No products found in this category</h4>
          <p class="text-muted">Try browsing other categories.</p>
          <a routerLink="/categories" class="btn btn-primary">Browse Categories</a>
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
    .products-by-category-container {
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
export class ProductsByCategoryComponent implements OnInit {
  products: Product[] = [];
  categoryName: string = '';
  categoryId: string = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.categoryName = params['categoryName'];
      this.categoryId = params['categoryId'];
      this.loadProducts();
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProductsByCategory(this.categoryId).subscribe({
      next: (response: any) => {
        this.products = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading products by category:', error);
        this.isLoading = false;
      }
    });
  }
} 