import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsByBrandComponent } from './products-by-brand.component';
import { ProductCardModule } from '../product-card/product-card.module';

@NgModule({
  declarations: [
    ProductsByBrandComponent
  ],
  imports: [
    CommonModule,
    ProductCardModule,
    RouterModule.forChild([
      { path: '', component: ProductsByBrandComponent }
    ])
  ]
})
export class ProductsByBrandModule { } 