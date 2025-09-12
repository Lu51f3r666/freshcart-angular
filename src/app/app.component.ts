import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
      
      <!-- Offline Indicator -->
      <div *ngIf="!isOnline" class="offline bg-danger">
        <p class="mb-0">You're offline now!</p>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  isOnline = navigator.onLine;

  constructor(private authService: AuthService) {
    // Listen for online/offline events
    window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);
  }

  ngOnInit() {
    // Check if user is already logged in
    if (localStorage.getItem('token')) {
      this.authService.currentUser.subscribe();
    }
  }
} 