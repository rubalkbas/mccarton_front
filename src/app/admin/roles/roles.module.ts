import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { RolesDialogComponent } from './roles-dialog/roles-dialog.component';
import { RolesComponent } from './roles.component';

export const routes: Routes = [
  { path: '', component: RolesComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    RolesComponent,
    RolesDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class RolesModule { }
