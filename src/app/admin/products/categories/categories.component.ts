import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdminService } from '../../../_services/admins.service';
import { MatTableDataSource } from '@angular/material/table';
import { Util } from '../../../util/util';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public categorias:[] = []; 
  public page: any;
  public count = 6;
  public settings:Settings;

  constructor(
    public appService: AppService, 
    public dialog: MatDialog, 
    public appSettings:AppSettings,
    private adminService:AdminService,
    private paginator1:MatPaginatorIntl
    
    ) { }

  ngOnInit(): void {
    this.adminService.getAllCategorias().subscribe(resp=>{
      console.log(resp.response)
      this.categorias=resp.response;
    }, error=>{
      Util.errorMessage(error.error.mensaje);
    })
  }



  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public openCategoryDialog(data:any){
    const dialogRef = this.dialog.open(CategoryDialogComponent,{
      data:data
    });
  }


}
