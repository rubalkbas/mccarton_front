import { ColorDialogComponent } from './colors/color-dialog/color-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductZoomComponent } from './product-detail/product-zoom/product-zoom.component';
import { AddProductComponent } from './add-product/add-product.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDialogComponent } from './categories/category-dialog/category-dialog.component';
import { MaterialComponent } from './materials/materials.component';
import { ColorComponent } from './colors/colors.component';
import { MaterialDialogComponent } from './materials/material-dialog/material-dialog.component';
import { FollowersComponent } from '../followers/followers.component';
import { OfertaDialogComponent } from './product-list/product-dialog/product-dialog.component';

export const routes: Routes = [ 
  { path: '', redirectTo: 'product-list', pathMatch: 'full'},
  { path: 'categories', component: CategoriesComponent, data: { breadcrumb: 'Categories' } },
  { path: 'product-list', component: ProductListComponent, data: { breadcrumb: 'Product List' } },
  { path: 'product-detail', component: ProductDetailComponent, data: { breadcrumb: 'Product Detail' } },
  { path: 'product-detail/:id', component: ProductDetailComponent, data: { breadcrumb: 'Product Detail' } }, 
  { path: 'add-product', component: AddProductComponent, data: { breadcrumb: 'Add Product' } },
  { path: 'add-product/:id', component: AddProductComponent, data: { breadcrumb: 'Edit Product' } }, 
  { path: 'materials', component: MaterialComponent, data: { breadcrumb: 'Materials' } },
  { path: 'colors', component: ColorComponent, data: { breadcrumb: 'Colors' } },
  
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductZoomComponent,
    AddProductComponent,
    CategoriesComponent,
    CategoryDialogComponent,
    MaterialComponent,
    ColorComponent,
    ColorDialogComponent,
    MaterialDialogComponent,
    
    OfertaDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    SwiperModule,
    InputFileModule
  ]
})
export class ProductsModule { }
