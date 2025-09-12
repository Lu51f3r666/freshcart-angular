import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Category } from '../../interfaces/product.interface';

@Component({
  selector: 'app-categories',
  template: `
    <div class="categories-container">
      <div class="container py-4">
        <h2 class="text-center mb-4">Product Categories</h2>
        
        <div class="row" *ngIf="categories.length > 0">
          <div class="col-md-4 mb-4" *ngFor="let category of categories">
            <div class="card category-card cursor-pointer" [routerLink]="['/products/category', category.name, category._id]">
              <img [src]="category.image" class="card-img-top" [alt]="category.name">
              <div class="card-body text-center">
                <h5 class="card-title">{{ category.name }}</h5>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center" *ngIf="categories.length === 0">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
      min-height: 100vh;
    }
    
    .category-card {
      transition: transform 0.3s ease;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
    }
    
    .category-card img {
      height: 200px;
      object-fit: cover;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe(response => {
      this.categories = response.data;
    });
  }
} 