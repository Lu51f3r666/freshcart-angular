import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductCardModule } from '../product-card/product-card.module';

@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProductCardModule,
    RouterModule.forChild([
      { path: '', component: ProductsComponent }
    ])
  ]
})
export class ProductsModule { } 