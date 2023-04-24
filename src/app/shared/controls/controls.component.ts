import { Producto } from './../../models/producto.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../app.service';
import { Product } from '../../app.models';
import { Util } from '../../util/util';
import { Router } from '@angular/router';
import { AdminService } from '../../_services/admins.service';
import { CarroComprasRequest } from 'src/app/models/carro-compras-request.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  @Input() product: Product;
  @Input() producto: Producto;
  @Input() type: string;
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  public count:number = 1;
  public align = 'center center';
  public idProducto:any;
  constructor(public appService:AppService,
    public adminService:AdminService, 
    public snackBar: MatSnackBar, 
    public router: Router

     ) { }

  ngOnInit() {

      this.idProducto=this.producto.idProducto

 
    if(this.producto){
      if(this.product.cartCount > 0){
        this.count = this.producto.stock;
      }
    }  
    this.layoutAlign(); 

    console.log("Este es el producto:" , this.producto)
  }
  //Elimar Deseo 
  public remove(idListaDeseo: any) {
    this.adminService.eliminarDeseo(idListaDeseo).subscribe(resp => {
      Util.successMessage(resp.mensaje);
      window.location.reload();
    });
  }
  //Fin de Eliminar deseo 
  public layoutAlign(){
    if(this.type == 'all'){
      this.align = 'space-between center';
    }
    else if(this.type == 'wish'){
      this.align = 'start center';
    }
    else{
      this.align = 'center center';
    }
  }



  public increment(){
    if(this.count < this.producto.stock){
      this.count++;
      let obj = {
        productId: this.product.id,
        soldQuantity: this.count,
        total: this.count * this.producto.precioVenta
      }
      this.changeQuantity(obj);
    }
    else{
      this.snackBar.open('No se pueden elegir más artículos de los disponibles. En inventario hay ' + this.count + ' productos.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
    }    
  }

  public decrement(count){
    if(this.count > 1){
      this.count--;
      let obj = {
        productId: this.product.id,
        soldQuantity: this.count,
        total: this.count * this.producto.precioVenta
      }
      this.changeQuantity(obj);
    }
  }

  public addToCompare(product:Product){
    this.appService.addToCompare(product);
  }

  public addToWishList(product:Product){
    const idCliente = localStorage.getItem('cliente');

    if(idCliente){
      this.adminService.guardarDeseo(idCliente, this.idProducto).subscribe(result=>{
        Util.successMessage("Deseo Agregado!!")
      })
    }else{
      Util.errorMessage("Necesitas ingresar para poder agregar productos");
      this.router.navigate(['/sign-in']);
    }

  }

  public agregarCarro(producto:Producto){

    const idUsuario = parseInt(localStorage.getItem('cliente'));
    const idProducto = producto.idProducto;

    const carroCompras = new CarroComprasRequest();
    carroCompras.idCliente = idUsuario;
    carroCompras.idProducto = idProducto;
    carroCompras.cantidad = 1;


    this.adminService.agregarProducto(carroCompras).subscribe({
      next:(data:any)=> {
        console.log(data)
        Swal.fire('',data.mensaje,'success')
      },
      error: data=>{

      }
    })
  }

  public addToCart(product:Product){
    // console.log(product)
    let currentProduct = this.appService.Data.cartList.filter(item=>item.id == product.id)[0];
    if(currentProduct){
      if((currentProduct.cartCount + this.count) <= this.producto.stock){
        product.cartCount = currentProduct.cartCount + this.count;
      }
      else{
        this.snackBar.open('No se pueden elegir más artículos de los disponibles. En inventario hay ' + this.producto.stock + ' productos y ya ha agragado ' + currentProduct.cartCount + ' productos a su carrito', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        return false;
      }
    }
    else{
      product.cartCount = this.count;
    }
    this.appService.addToCart(product);
  }

  public openProductDialog(event){
    this.onOpenProductDialog.emit(event);
  }

  public changeQuantity(value){
      this.onQuantityChange.emit(value);
  }

}