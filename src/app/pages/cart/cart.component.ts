import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../app.service';
import { AdminService } from '../../_services/admins.service';
import { CarroCompras } from 'src/app/models/carro-compras.model';
import { Producto } from 'src/app/models/producto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  carritos:CarroCompras[] = [];
  totalProcuctos:number
  productos:Producto[];
  imagenesProductos: {[idProducto: string]: string} = {};
  totalPrecio:number = 0;


  total = [];
  grandTotal = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  constructor(public appService:AppService, private adminService:AdminService) { }

  

  ngOnInit() {
    this.appService.Data.cartList.forEach(product=>{
      // this.total[product.id] = product.cartCount*product.newPrice;
      // this.grandTotal += product.cartCount*product.newPrice;
      // this.cartItemCount[product.id] = product.cartCount;
      // this.cartItemCountTotal += product.cartCount;
    })
    this.listarCarrito();
  }

  listarCarrito(){
    const idCliente = parseInt(localStorage.getItem('cliente'));
    this.adminService.listarCarrito(idCliente).subscribe((data:any)=>{
      console.log(data)
      if(data.response === null){
        this.carritos = [];
        return;
      }
      this.carritos = data.response.carrito;
      this.totalProcuctos = this.carritos.length;
      console.log(this.carritos)
      this.carritos.forEach(carrito=>{
        this.totalPrecio += carrito.subtotal;
        this.adminService.obtenerImagenesProducto(carrito.producto).subscribe({
          next: data => {
            console.log(data)
            //Obtener el ultmo elemento de un arreglo
            const imagen = data.response[data.response.length -1];
            this.imagenesProductos[carrito.producto.idProducto] = `data:image/${imagen.tipoImagen};base64,${imagen.imagenBits}`;
          }            
        })
      })   
    })    
  }

  bytesToImageUrl(bytes: Uint8Array, tipoImagen:string): string {
    return `data:${tipoImagen};base64,${bytes}`;
  }



  public updateCart(value){
    if(value){
      this.total[value.productId] = value.total;
      this.cartItemCount[value.productId] = value.soldQuantity;
      this.grandTotal = 0;
      this.total.forEach(price=>{
        this.grandTotal += price;
      });
      this.cartItemCountTotal = 0;
      this.cartItemCount.forEach(count=>{
        this.cartItemCountTotal +=count;
      });
     
      this.appService.Data.totalPrice = this.grandTotal;
      this.appService.Data.totalCartCount = this.cartItemCountTotal;

      this.appService.Data.cartList.forEach(product=>{
        this.cartItemCount.forEach((count,index)=>{
          // if(product.id == index){
          //   product.cartCount = count;
          // }
        });
      });
      
    }
  }

  public eliminarProducto(producto:CarroCompras) {
    console.log(producto)
    this.adminService.eliminarProducto(producto.idCarroCompra).subscribe({
      next: (data:any) => {
        console.log(data)
        Swal.fire('',data.mensaje,'success')
        this.listarCarrito()
      },
      error: data => {
        this.listarCarrito()

        Swal.fire('',data.mensaje,'error');
      }
    })
    // this.adminService.eliminarProducto().subscribe({  

    // })

    // const index: number = this.appService.Data.cartList.indexOf(product);
    // if (index !== -1) {
    //   this.appService.Data.cartList.splice(index, 1);
    //   this.grandTotal = this.grandTotal - this.total[product.id]; 
    //   this.appService.Data.totalPrice = this.grandTotal;       
    //   this.total.forEach(val => {
    //     if(val == this.total[product.id]){
    //       this.total[product.id] = 0;
    //     }
    //   });

    //   this.cartItemCountTotal = this.cartItemCountTotal - this.cartItemCount[product.id]; 
    //   this.appService.Data.totalCartCount = this.cartItemCountTotal;
    //   this.cartItemCount.forEach(val=>{
    //     if(val == this.cartItemCount[product.id]){
    //       this.cartItemCount[product.id] = 0;
    //     }
    //   });
    //   this.appService.resetProductCartCount(product);
    // }     
  }

  public clear(){
    this.appService.Data.cartList.forEach(product=>{
      // this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  } 

}
