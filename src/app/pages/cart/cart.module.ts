import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { CartComponent } from './cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberDirective } from '../../util/numbers-only.directive';


export const routes: Routes = [
  { path: '', component: CartComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,    
    ReactiveFormsModule,
    FormsModule,    
    RouterModule.forChild(routes),
    SharedModule,    
  ],
  declarations: [
    CartComponent,
    NumberDirective
  ]
})
export class CartModule { }
