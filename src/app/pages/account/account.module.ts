import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InformationComponent } from './information/information.component';
import { AddressesComponent } from './addresses/addresses.component';
import { OrdersComponent } from './orders/orders.component';
import { DireccionDialogComponent } from './addresses/direccion-dialog/direccion-dialog.component';
import { LogoutGuard } from '../../logout.guard';

export const routes: Routes = [
  { 
      path: '', 
      component: AccountComponent, children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent, data: {  breadcrumb: 'Dashboard' } },
          { path: 'information', component: InformationComponent, data: {  breadcrumb: 'Information' } },
          { path: 'addresses', component: AddressesComponent, data: {  breadcrumb: 'Addresses' } },
          { path: 'orders', component: OrdersComponent, data: {  breadcrumb: 'Orders' } },

      ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    AccountComponent,
    DashboardComponent,
    InformationComponent,
    AddressesComponent,
    OrdersComponent,
    DireccionDialogComponent
  ]
})
export class AccountModule { }
