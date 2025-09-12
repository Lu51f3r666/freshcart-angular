import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address.component';

const routes: Routes = [
  { path: '', component: AddressComponent }
];

@NgModule({
  declarations: [
    AddressComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AddressModule { } 