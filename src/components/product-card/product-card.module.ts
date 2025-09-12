import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from './product-card.component';
import { ProductModalComponent } from '../product-modal/product-modal.component';

@NgModule({
  declarations: [
    ProductCardComponent,
    ProductModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ProductCardComponent
  ]
})
export class ProductCardModule { }
