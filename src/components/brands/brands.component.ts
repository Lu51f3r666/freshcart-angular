import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Brand } from '../../interfaces/product.interface';

@Component({
  selector: 'app-brands',
  template: `
    <div class="brands-container">
      <div class="container py-4">
        <h2 class="text-center mb-4">Product Brands</h2>
        
        <div class="row" *ngIf="brands.length > 0">
          <div class="col-md-3 mb-4" *ngFor="let brand of brands">
            <div class="card brand-card cursor-pointer" [routerLink]="['/products/brand', brand.name, brand._id]">
              <img [src]="brand.image" class="card-img-top" [alt]="brand.name">
              <div class="card-body text-center">
                <h6 class="card-title">{{ brand.name }}</h6>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center" *ngIf="brands.length === 0">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .brands-container {
      min-height: 100vh;
    }
    
    .brand-card {
      transition: transform 0.3s ease;
    }
    
    .brand-card:hover {
      transform: scale(1.05);
    }
    
    .brand-card img {
      height: 150px;
      object-fit: cover;
    }
  `]
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.productService.getBrands().subscribe(response => {
      this.brands = response.data;
    });
  }
} 