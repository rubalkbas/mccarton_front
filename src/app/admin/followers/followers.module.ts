import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FollowersComponent } from './followers.component';
import { preguntaFrecuenteDialogComponent } from './pregunta-frecuente-dialog/pregunta-frecuente-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';


export const routes: Routes = [
  { path: '', component: FollowersComponent, pathMatch: 'full' }
]; 

@NgModule({
  declarations: [
    FollowersComponent,
    preguntaFrecuenteDialogComponent
 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ]
})
export class FollowersModule { }
