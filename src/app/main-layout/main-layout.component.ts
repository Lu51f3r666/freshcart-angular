import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  template: `
    <div class="main-layout">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .main-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .main-content {
      flex: 1;
      padding-top: 80px;
    }
  `]
})
export class MainLayoutComponent {
} 