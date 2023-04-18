import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { InputFileModule } from 'ngx-input-file';
import { OrdenesComponent } from './ordenes.component';
import { OrdenesDetallesComponent } from './ordenes-detalles/ordenes-detalles.component';

export const routes: Routes = [
  { path: '', component: OrdenesComponent, pathMatch: 'full' },
  { path: 'ordenes-detalles', component: OrdenesDetallesComponent, data: { breadcrumb: 'Detalles de orden' } }
];

@NgModule({
  declarations: [
    OrdenesComponent,
    OrdenesDetallesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    InputFileModule,
  ]
})
export class OrdenesModule { }
