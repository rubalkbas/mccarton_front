import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { ProductsComponent } from './products.component';
import { ProductComponent } from './product/product.component';
import { ProductZoomComponent } from './product/product-zoom/product-zoom.component';
import { CajasComponent } from '../cajas/cajas.component';
import { Caja1Component } from '../carton/caja1/caja1.component';
import { Caja2Component } from '../carton/caja2/caja2.component';
import { Caja3Component } from '../carton/caja3/caja3.component';
import { Caja4Component } from '../carton/caja4/caja4.component';
import { Caja5Component } from '../carton/caja5/caja5.component';
import { Caja6Component } from '../carton/caja6/caja6.component';
import { Caja7Component } from '../carton/caja7/caja7.component';
import { Caja8Component } from '../carton/caja8/caja8.component';
import { Caja9Component } from '../carton/caja9/caja9.component';
import { Caja10Component } from '../carton/caja10/caja10.component';
export const routes: Routes = [
  { path: '', component: ProductsComponent, pathMatch: 'full' },
  { path: ':name', component: ProductsComponent },
  { path: ':id/:name', component: ProductComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        SwiperModule,
        NgxPaginationModule,
        SharedModule,
        PipesModule,
   
    ],
    declarations: [
        ProductsComponent,
        ProductComponent,
        ProductZoomComponent,
        CajasComponent,
        Caja1Component,
        Caja2Component,
        Caja3Component,
        Caja4Component,
        Caja5Component,
        Caja6Component,
        Caja7Component,
        Caja8Component,
        Caja9Component,
        Caja10Component
    ]
})
export class ProductsModule { }
