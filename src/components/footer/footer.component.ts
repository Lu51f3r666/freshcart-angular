import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-dark text-light py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5 class="text-white fw-bold">FreshCart</h5>
            <p class="text-white">Your trusted online shopping destination for quality products.</p>
          </div>
          <div class="col-md-4">
            <h5 class="text-white fw-bold">Quick Links</h5>
            <ul class="list-unstyled">
              <li><a routerLink="/main/products" class="text-white text-decoration-none">Products</a></li>
              <li><a routerLink="/main/categories" class="text-white text-decoration-none">Categories</a></li>
              <li><a routerLink="/main/brands" class="text-white text-decoration-none">Brands</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5 class="text-white fw-bold">Contact Us</h5>
            <p class="text-white">
              <i class="fas fa-envelope me-2"></i> info&#64;freshcart.com<br>
              <i class="fas fa-phone me-2"></i> +1 234 567 890
            </p>
          </div>
        </div>
        <hr class="my-3 border-white">
        <div class="text-center">
          <p class="text-white mb-0">&copy; 2024 FreshCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: auto;
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
    }
    
    footer h5 {
      color: #fff !important;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    
    footer p, footer li {
      color: rgba(255, 255, 255, 0.9) !important;
      line-height: 1.6;
    }
    
    footer a {
      color: rgba(255, 255, 255, 0.8) !important;
      transition: all 0.3s ease;
      padding: 0.25rem 0;
      display: inline-block;
    }
    
    footer a:hover {
      color: #fff !important;
      text-decoration: underline !important;
      transform: translateX(5px);
    }
    
    footer .border-white {
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
    
    footer i {
      color: #3498db;
    }
  `]
})
export class FooterComponent {
} 