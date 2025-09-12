import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../interfaces/user.interface';
import { Cart } from '../../interfaces/cart.interface';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <a class="navbar-brand" routerLink="/main">
          <i class="fas fa-shopping-cart me-2"></i>
          FreshCart
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/main" routerLinkActive="active">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/main/products" routerLinkActive="active">Products</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/main/categories" routerLinkActive="active">Categories</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/main/brands" routerLinkActive="active">Brands</a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link position-relative" routerLink="/main/cart">
                <i class="fas fa-shopping-cart"></i>
                <span *ngIf="cartItemCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {{ cartItemCount }}
                </span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/main/wishlist">
                <i class="fas fa-heart"></i>
              </a>
            </li>
            <li class="nav-item dropdown" *ngIf="currentUser">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>
                {{ currentUser.name }}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" routerLink="/main/allorders">My Orders</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" (click)="logout()">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .navbar-brand {
      font-weight: bold;
    }
    
    .nav-link {
      transition: color 0.3s ease;
    }
    
    .nav-link:hover {
      color: #fff !important;
    }
    
    .nav-link.active {
      color: #fff !important;
      font-weight: bold;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  cartItemCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    this.cartService.cart$.subscribe(cart => {
      if (cart) {
        this.cartItemCount = cart.products.length;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }
} 