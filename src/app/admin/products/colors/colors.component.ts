import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material/dialog';
import { Util as util } from 'src/app/util/util';
import { AppSettings, Settings } from 'src/app/app.settings';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/_services/admins.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ColorDialogComponent } from './color-dialog/color-dialog.component';

export class Colores {
  idColor: number;
  nombreColor: string;
  descripcionColor: string;
  estatus: number;
}

const dutchRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0 de ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public categories:Category[] = []; 
  public page: any;
  public count = 6;
  public settings:Settings;

  constructor(
      public appService: AppService, 
      public dialog: MatDialog, 
      public appSettings:AppSettings, 
      private adminService: AdminService, 
      private paginator1: MatPaginatorIntl
    ) {

      this.settings = this.appSettings.settings;
      this.paginator1.itemsPerPageLabel = "Registros por página";
      paginator1.getRangeLabel = dutchRangeLabel;

  }

  listaColores: Colores[] = [];
  displayedColumns: string[] = ['nombre', 'descripcion', 'estatus'];
  dataSource = new MatTableDataSource<Colores>(this.listaColores);

  ngOnInit(): void {
    this.loadGrid();
    this.getCategories();

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  public getCategories(){   
    this.appService.getCategories().subscribe(data => {
      this.categories = data; 
      this.categories.shift();
    }); 
  }

  public loadGrid() {
    this.adminService.listarColores().subscribe({
      next: response => {
        this.listaColores = response.response;
        this.dataSource = new MatTableDataSource<Colores>(this.listaColores);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: error => {
        util.errorMessage(error.error.mensaje);
      }
    });
  }
  
  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public openCategoryDialog(data:any){
    const dialogRef = this.dialog.open(ColorDialogComponent, {
      data: {
        color: data,
        categories: this.categories
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(response => { 
      if(response){
        this.loadGrid();
      }
    });
  }

}
