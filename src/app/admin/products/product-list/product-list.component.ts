import { Component, OnInit, HostListener } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Product } from 'src/app/app.models';
import { MatDialog } from '@angular/material/dialog';
import { Producto } from 'src/app/models/producto.model';
import { AdminService } from 'src/app/_services/admins.service';
import { Util as util } from "src/app/util/util";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public products: Array<Product> = [];
  public productos: Producto[] = [];
  public viewCol: number = 25;
  public page: any;
  public count = 12;
  public imagen: any;
  constructor(public appService:AppService, public dialog: MatDialog, private adminService: AdminService) { }

  ngOnInit(): void {
    if(window.innerWidth < 1280){
      this.viewCol = 33.3;
    };
    this.getAllProducts(); 
    this.obtenerProductos();    
  }

  public obtenerProductos() {
  
    this.adminService.listarProductos().subscribe({
      next: response => {
        this.productos = response.response;
      },
      error: error => {
        util.errorMessage(error.error.mensaje);
      }
    });
    
  }

  public getAllProducts(){
    this.appService.getProducts("featured").subscribe(data=>{
      this.products = data; 
      this.imagen = this.products[0].images[0].medium;
      //for show more product  
      for (var index = 0; index < 3; index++) {
        this.products = this.products.concat(this.products);        
      }
    });
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  @HostListener('window:resize')
  public onWindowResize():void { 
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }
 

  // public remove(product:any){  
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     maxWidth: "400px",
  //     data: {
  //       title: "Confirm Action",
  //       message: "Are you sure you want delete this product?"
  //     }
  //   }); 
  //   dialogRef.afterClosed().subscribe(dialogResult => { 
  //     if(dialogResult){
  //       const index: number = this.products.indexOf(product);
  //       if (index !== -1) {
  //         this.products.splice(index, 1);  
  //       } 
  //     } 
  //   }); 
  // }

}
