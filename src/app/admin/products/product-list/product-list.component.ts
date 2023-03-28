import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Product } from 'src/app/app.models';
import { MatDialog } from '@angular/material/dialog';
import { Producto } from 'src/app/models/producto.model';
import { AdminService } from 'src/app/_services/admins.service';
import { Util as util } from "src/app/util/util";
import { Imagen } from 'src/app/models/imagen.model';

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
  constructor(public appService:AppService, public dialog: MatDialog, private adminService: AdminService, private el: ElementRef) { }

  ngOnInit(): void {
    if(window.innerWidth < 1280){
      this.viewCol = 33.3;
    };
    //this.getAllProducts(); 
    this.obtenerProductos();    
  }

  // public obtenerProductos() {
  
  //   this.adminService.listarProductos().subscribe({
  //     next: response => {
  //       this.productos = response.response;

  //       this.productos.forEach(producto => {

  //         this.adminService.obtenerImagenesProducto(producto).subscribe({
  //           next: response => {
  //             let image : Imagen = {};
  //             let listImagenes: Imagen[] = [];
  //             image.imagen = `data:image/${response.response[0].tipoImagen};base64,${response.response[0].imagenBits}`
  //             image.estatus = 0;
  //             image.imagenPredeterminado = 1;
  //             image.nombreImagen = response.response[0].nombreImagen;
  //             image.tipoImagen = response.response[0].tipoImagen;
  //             listImagenes.push(image);
  //             producto.imagenes = listImagenes;
  //           },
  //           error: error => {
  //             util.errorMessage(error.error.mensaje);
  //           }
  //         });

  //       });

  //     },
  //     error: error => {
  //       util.errorMessage(error.error.mensaje);
  //     }
  //   });
    
  // }


  public obtenerProductos() {
    this.adminService.listarProductos().subscribe({
      next: response => {
        this.productos = response.response;
        this.obtenerImagenesProductos(0);
      },
      error: error => {
        util.errorMessage(error.error.mensaje);
      }
    });
  }
  
  private obtenerImagenesProductos(index: number) {
    if (index >= this.productos.length) {
      return;
    }
    const producto = this.productos[index];
    this.adminService.obtenerImagenesProducto(producto).subscribe({
      next: response => {
        let image: Imagen = {};
        let listImagenes: Imagen[] = [];
        image.imagen = `data:image/${response.response[0].tipoImagen};base64,${response.response[0].imagenBits}`
        image.estatus = 0;
        image.imagenPredeterminado = 1;
        image.nombreImagen = response.response[0].nombreImagen;
        image.tipoImagen = response.response[0].tipoImagen;
        listImagenes.push(image);
        producto.imagenes = listImagenes;
        // Llamada recursiva para obtener las imágenes del siguiente producto
        this.obtenerImagenesProductos(index + 1);
      },
      error: error => {
        util.errorMessage(error.error.mensaje);
      }
    });
  }
  

  // public obtenerImagenes(producto: Producto):string {
  //   let imagen: string = "";
  //   this.adminService.obtenerImagenesProducto(producto).subscribe({
  //     next: response => {
  //       //console.log(response.response);
  //       let image : Imagen = {};
  //       image.imagen = `data:image/${response.response[0].tipoImagen};base64,${response.response[0].imagenBits}`
  //       image.estatus = 0;
  //       image.imagenPredeterminado = 1;
  //       image.nombreImagen = response.response[0].nombreImagen;
  //       image.tipoImagen = response.response[0].tipoImagen;
  //       producto.imagenes.push(image);
  //       console.log(producto);
  //       //imagen = response.response.imagen_bits;
  //     },
  //     error: error => {
  //       util.errorMessage(error.error.mensaje);
  //     }
  //   });
  //   return imagen;
  // }
    
  // public getAllProducts(){
  //   this.appService.getProducts("featured").subscribe(data=>{
  //     this.products = data; 
  //     //this.imagen = this.products[0].images[0].medium;
  //     //console.log(this.imagen);
  //     //for show more product  
  //     for (var index = 0; index < 3; index++) {
  //       this.products = this.products.concat(this.products);        
  //     }
  //   });
  // }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
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
