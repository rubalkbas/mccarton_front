import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { MaterialDialogComponent } from './material-dialog/material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/_services/admins.service';
import Swal from 'sweetalert2';

export class Materiales {
  idMaterial: number;
  nombreMaterial: string;
  descripcionMaterial: string;
  estatus: number;
}

@Component({
  selector: 'app-categories',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialComponent implements OnInit {


  public categories:Category[] = []; 
  public page: any;
  public count = 6;
  public settings:Settings;
  constructor(public appService: AppService, public dialog: MatDialog, public appSettings:AppSettings, private adminService: AdminService) {
    this.settings = this.appSettings.settings;
  }

  listaMateriales: Materiales[] = [];
  displayedColumns: string[] = ['nombre', 'descripcion', 'estatus', 'acciones'];
  dataSource = new MatTableDataSource<Materiales>(this.listaMateriales);

  ngOnInit(): void {
    this.loadGrid();
    this.getCategories();
  }

  public getCategories(){   
    this.appService.getCategories().subscribe(data => {
      this.categories = data; 
      this.categories.shift();
    }); 
  }

  public loadGrid() {
    this.adminService.listarMateriales().subscribe({
      next: response => {
        this.listaMateriales = response.response;
        this.dataSource = new MatTableDataSource<Materiales>(this.listaMateriales);
      },
      error: error => {
        console.log('Error:', error);
      }
    });
  }
  
  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public openCategoryDialog(data:any){
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        material: data,
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

  public eliminarMaterial(elemento: any) {
  
    this.adminService.eliminarMaterial(elemento.idMaterial).subscribe({
      next: () => {
        Swal.fire(
          'Eliminado!',
          'El elemento ha sido eliminado.',
          'success'
        );
        this.loadGrid();
      },
      error: error => {
        console.log('Error:', error);
      }
    });

  }

  public remove(element:any){  

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este elemento será eliminado permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí debes llamar a la función que elimina el elemento de la tabla
        this.eliminarMaterial(element);
      }
    });
    
    

    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   maxWidth: "400px",
    //   data: {
    //     title: "Confirmar",
    //     message: "¿Está seguro de eliminar este material?"
    //   }
    // }); 
    // dialogRef.afterClosed().subscribe(dialogResult => { 
    //   if(dialogResult){
    //     const index: number = this.categories.indexOf(category);
    //     if (index !== -1) {
    //       this.categories.splice(index, 1);  
    //     } 
    //   } 
    // }); 
  }

}
