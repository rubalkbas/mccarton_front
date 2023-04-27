import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutComponent } from './checkout.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { NgxPayPalModule } from 'ngx-paypal';

export const routes: Routes = [
  { path: '', component: CheckoutComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    NgxPayPalModule
  ],
  declarations: [
    CheckoutComponent
  ]
})
export class CheckoutModule { }
