import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-products',
  template: `
    <div class="products-container">
      <div class="container py-4">
        <h2 class="text-center mb-4">All Products</h2>
        
        <!-- Search and Filter Section -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search products..."
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
              >
              <button class="btn btn-outline-secondary" type="button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <select class="form-select" [(ngModel)]="sortBy" (change)="onSort()">
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        
        <!-- Products Grid -->
        <div class="row g-3" *ngIf="products.length > 0">
          <div class="col-lg-4 col-md-6 col-sm-6" *ngFor="let product of filteredProducts">
            <app-product-card [product]="product"></app-product-card>
          </div>
        </div>
        
        <!-- Loading State -->
        <div class="text-center" *ngIf="isLoading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <!-- Empty State -->
        <div class="text-center" *ngIf="!isLoading && filteredProducts.length === 0">
          <i class="fas fa-box-open display-1 text-muted"></i>
          <h4 class="text-muted mt-3">No products found</h4>
          <p class="text-muted">Try adjusting your search or filter criteria.</p>
        </div>
        
        <!-- Pagination -->
        <nav *ngIf="totalPages > 1" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" [class.disabled]="currentPage === 1">
              <a class="page-link" href="#" (click)="changePage(currentPage - 1)">Previous</a>
            </li>
            <li class="page-item" *ngFor="let page of getPageNumbers()" [class.active]="page === currentPage">
              <a class="page-link" href="#" (click)="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" [class.disabled]="currentPage === totalPages">
              <a class="page-link" href="#" (click)="changePage(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      min-height: 100vh;
    }
    
    .product-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .product-card img {
      height: 200px;
      object-fit: cover;
    }
    
    .pagination .page-link {
      color: #0d6efd;
    }
    
    .pagination .page-item.active .page-link {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  searchQuery = '';
  sortBy = '';
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 12;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.products = response.data;
        this.filteredProducts = [...this.products];
        this.totalPages = response.metadata.numberOfPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe(response => {
        this.filteredProducts = response.data;
      });
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  onSort() {
    if (!this.sortBy) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-asc':
          return (a.priceAfterDiscount || a.price) - (b.priceAfterDiscount || b.price);
        case 'price-desc':
          return (b.priceAfterDiscount || b.price) - (a.priceAfterDiscount || a.price);
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
} 