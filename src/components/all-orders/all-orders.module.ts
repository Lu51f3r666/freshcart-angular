import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllOrdersComponent } from './all-orders.component';

const routes: Routes = [
  { path: '', component: AllOrdersComponent }
];

@NgModule({
  declarations: [
    AllOrdersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AllOrdersModule { } 