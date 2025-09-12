import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistComponent } from './wishlist.component';
import { ProductCardModule } from '../product-card/product-card.module';

@NgModule({
  declarations: [
    WishlistComponent
  ],
  imports: [
    CommonModule,
    ProductCardModule,
    RouterModule.forChild([
      { path: '', component: WishlistComponent }
    ])
  ]
})
export class WishlistModule { } 