import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsByCategoryComponent } from './products-by-category.component';
import { ProductCardModule } from '../product-card/product-card.module';

@NgModule({
  declarations: [
    ProductsByCategoryComponent
  ],
  imports: [
    CommonModule,
    ProductCardModule,
    RouterModule.forChild([
      { path: '', component: ProductsByCategoryComponent }
    ])
  ]
})
export class ProductsByCategoryModule { } 