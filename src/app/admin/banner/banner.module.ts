import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BannerComponent } from './banner.component';
import { ImagenDialogComponent } from './imagen-dialog/imagen-dialog.component';
import { BannerDialogComponent } from './banner-dialog/banner-dialog.component';
import { InputFileModule } from 'ngx-input-file';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: '', component: BannerComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    BannerComponent,
    ImagenDialogComponent,
    BannerDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    InputFileModule,
    FormsModule
  ]
})
export class BannerModule { }
