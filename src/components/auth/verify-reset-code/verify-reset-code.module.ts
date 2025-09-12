import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { VerifyResetCodeComponent } from './verify-reset-code.component';

const routes: Routes = [
  { path: '', component: VerifyResetCodeComponent }
];

@NgModule({
  declarations: [
    VerifyResetCodeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class VerifyResetCodeModule { } 