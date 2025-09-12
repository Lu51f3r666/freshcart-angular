import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product, Category, Brand } from '../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section bg-primary text-white py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6">
              <h1 class="display-4 fw-bold">Welcome to FreshCart</h1>
              <p class="lead">Discover amazing products at great prices. Shop with confidence!</p>
              <a routerLink="/main/products" class="btn btn-light btn-lg">Shop Now</a>
            </div>
            <div class="col-md-6 text-center">
              <i class="fas fa-shopping-cart display-1"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="py-5">
        <div class="container">
          <h2 class="text-center mb-4">Shop by Category</h2>
          <div class="row" *ngIf="categories.length > 0">
            <div class="col-md-3 mb-4" *ngFor="let category of categories">
              <div class="card category-card cursor-pointer" [routerLink]="['/main/products/category', category.name, category._id]">
                <img [src]="category.image" class="card-img-top" [alt]="category.name">
                <div class="card-body text-center">
                  <h5 class="card-title">{{ category.name }}</h5>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="categories.length === 0" class="text-center">
            <p>Loading categories...</p>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-4">Featured Products</h2>
          <div class="row g-3" *ngIf="products.length > 0">
            <div class="col-lg-4 col-md-6 col-sm-6" *ngFor="let product of products.slice(0, 6)">
              <app-product-card [product]="product"></app-product-card>
            </div>
          </div>
          
          <div *ngIf="products.length === 0" class="text-center">
            <p>Loading products...</p>
          </div>
        </div>
      </section>

      <!-- Brands Section -->
      <section class="py-5">
        <div class="container">
          <h2 class="text-center mb-4">Popular Brands</h2>
          <div class="row" *ngIf="brands.length > 0">
            <div class="col-md-2 mb-4" *ngFor="let brand of brands">
              <div class="card brand-card cursor-pointer" [routerLink]="['/main/products/brand', brand.name, brand._id]">
                <img [src]="brand.image" class="card-img-top" [alt]="brand.name">
                <div class="card-body text-center">
                  <h6 class="card-title">{{ brand.name }}</h6>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="brands.length === 0" class="text-center">
            <p>Loading brands...</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .category-card, .product-card, .brand-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .category-card:hover, .product-card:hover, .brand-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
    
    .card-img-top {
      height: 200px;
      object-fit: cover;
    }
    
    .brand-card .card-img-top {
      height: 120px;
      object-fit: contain;
      padding: 15px;
    }
    
    .product-card .card-img-top {
      height: 250px;
    }
  `]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadBrands() {
    this.productService.getBrands().subscribe({
      next: (response) => {
        this.brands = response.data;
      },
      error: (error) => {
        console.error('Error loading brands:', error);
      }
    });
  }
}
