import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../app.service';
import { AdminService } from '../../_services/admins.service';
import { CarroCompras } from 'src/app/models/carro-compras.model';
import { Producto } from 'src/app/models/producto.model';
import Swal from 'sweetalert2';
import { CarroComprasRequest } from 'src/app/models/carro-compras-request.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cargando:boolean;
  carritos: CarroCompras[] = [];
  totalProcuctos: number
  productos: Producto[];
  imagenesProductos: { [idProducto: string]: string } = {};
  totalPrecio: number = 0;
  cantidadActualizar: number;


  total = [];
  grandTotal = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  constructor(public appService: AppService, private adminService: AdminService) { }



  ngOnInit() {
    this.appService.Data.cartList.forEach(product => {
      // this.total[product.id] = product.cartCount*product.newPrice;
      // this.grandTotal += product.cartCount*product.newPrice;
      // this.cartItemCount[product.id] = product.cartCount;
      // this.cartItemCountTotal += product.cartCount;
    })
    this.listarCarrito();
  }

  listarCarrito() {
    this.cargando = true;
    const idCliente = parseInt(localStorage.getItem('cliente'));
    this.adminService.listarCarrito(idCliente).subscribe((data: any) => {
      console.log(data)
      if (data.response === null) {
        this.carritos = [];
        return;
      }
      this.carritos = data.response.carrito;
      this.totalProcuctos = this.carritos.length;
      console.log(this.carritos)
      this.carritos.forEach(carrito => {
        console.log(carrito.subtotal);
        this.totalPrecio = data.response.totalEstimado;      
        this.adminService.obtenerImagenesProducto(carrito.producto).subscribe({
          next: data => {
            console.log(data)
            //Obtener el ultmo elemento de un arreglo
            const imagen = data.response[data.response.length - 1];
            this.imagenesProductos[carrito.producto.idProducto] = `data:image/${imagen.tipoImagen};base64,${imagen.imagenBits}`;
            this.cargando = false;
          }
        })
      })
    })
  }

  bytesToImageUrl(bytes: Uint8Array, tipoImagen: string): string {
    return `data:${tipoImagen};base64,${bytes}`;
  }

  verificarCantidadProducto(carrito:CarroCompras){
    if(carrito.cantidad === null || carrito.cantidad === 0 ){
      carrito.cantidad = 1;
    } 
    const busquedaCarrito:CarroCompras = this.carritos.find( carritoFiltro => carritoFiltro.idCarroCompra  === carrito.idCarroCompra)

    if(carrito.cantidad > busquedaCarrito.producto.stock){
      carrito.cantidad = busquedaCarrito.producto.stock;
      Swal.fire('No hay Stock :(',`Stock no disponible, la cantidad disponible es: ${busquedaCarrito.producto.stock}`,'error');
      return;
    }
  }

  checarCantidad(carrito:CarroCompras){
    this.cargando = true;

    
    this.verificarCantidadProducto(carrito);

    console.log(carrito.cantidad)
    const usuario: number = parseInt(localStorage.getItem('cliente'))
    const idProducto: number = carrito.producto.idProducto;

    const carroComprasRequest = new CarroComprasRequest();
    carroComprasRequest.idCliente = usuario;
    carroComprasRequest.idProducto = idProducto;
    carroComprasRequest.cantidad = carrito.cantidad;
    
    this.adminService.actualizarCantidad(carroComprasRequest).subscribe({
      next: data => {
        this.cargando = false;
        console.log(data)
        this.listarCarrito();
      },
      error: data => {

      }
    })
  }


  public updateCart(value) {
    if (value) {
      this.total[value.productId] = value.total;
      this.cartItemCount[value.productId] = value.soldQuantity;
      this.grandTotal = 0;
      this.total.forEach(price => {
        this.grandTotal += price;
      });
      this.cartItemCountTotal = 0;
      this.cartItemCount.forEach(count => {
        this.cartItemCountTotal += count;
      });

      this.appService.Data.totalPrice = this.grandTotal;
      this.appService.Data.totalCartCount = this.cartItemCountTotal;

      this.appService.Data.cartList.forEach(product => {
        this.cartItemCount.forEach((count, index) => {
          // if(product.id == index){
          //   product.cartCount = count;
          // }
        });
      });

    }
  }


  decrementar(carrito: CarroCompras) {
    this.cargando = true;
    this.verificarCantidadProducto(carrito);

    const usuario: number = parseInt(localStorage.getItem('cliente'))
    const idProducto: number = carrito.producto.idProducto;
    // let cantidadProducto: number = carrito.cantidad;
    carrito.cantidad -= 1;
    console.log(carrito.cantidad);
    const carroComprasRequest = new CarroComprasRequest();
    carroComprasRequest.idCliente = usuario;
    carroComprasRequest.idProducto = idProducto;
    carroComprasRequest.cantidad = carrito.cantidad;
    console.log(carrito)
    console.log(carrito.cantidad)

    if (carrito.cantidad <= 0) {
      this.adminService.eliminarProducto(carrito.idCarroCompra).subscribe({
        next: data => {
          this.listarCarrito();
          this.cargando = false;
        }
      })
    }

    this.adminService.actualizarCantidad(carroComprasRequest).subscribe({
      next: data => {
        console.log(data)
        this.listarCarrito();
        this.cargando = false;
      },
      error: data => {

      }
    })

  }

  incrementar(carrito: CarroCompras) {
    this.cargando = true;
    const usuario: number = parseInt(localStorage.getItem('cliente'))
    const idProducto: number = carrito.producto.idProducto;
    // let cantidadProducto: number = carrito.cantidad;
    // cantidadProducto += 1;
    carrito.cantidad += 1;
    this.verificarCantidadProducto(carrito);
    console.log( carrito.cantidad);
    const carroComprasRequest = new CarroComprasRequest();
    carroComprasRequest.idCliente = usuario;
    carroComprasRequest.idProducto = idProducto;
    carroComprasRequest.cantidad =  carrito.cantidad;
    console.log(carrito)
    console.log( carrito.cantidad)

    if (carrito.cantidad <= 0) {
      this.adminService.eliminarProducto(carrito.idCarroCompra).subscribe({
        next: data => {
          this.cargando = false;
          this.listarCarrito();
        }
      })
    }
    this.adminService.actualizarCantidad(carroComprasRequest).subscribe({
      next: data => {
        this.cargando = false;
        this.listarCarrito();

      },
      error: data => {

      }
    })

  }
  // ngModelChange

  // public decrementar(carrito:CarroCompras){

  //   const usuario = parseInt(localStorage.getItem('cliente'))
  //   const idProducto = carrito.producto.idProducto;
  //   const carroComprasRequest = new CarroComprasRequest();
  //   carroComprasRequest.idCliente = usuario;
  //   carroComprasRequest.idProducto = idProducto;

  //   this.adminService.actualizarCantidad(carroComprasRequest).subscribe({
  //     next: data => {

  //       this.listarCarrito();
  //     },
  //     error: data => {

  //     }      
  //   })
  // }

  public eliminarProducto(producto: CarroCompras) {
    console.log(producto)
    this.adminService.eliminarProducto(producto.idCarroCompra).subscribe({
      next: (data: any) => {
        console.log(data)
        Swal.fire('', data.mensaje, 'success')
        this.listarCarrito()
      },
      error: data => {
        this.listarCarrito()

        Swal.fire('', data.mensaje, 'error');
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

  public clear() {
    this.appService.Data.cartList.forEach(product => {
      // this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }

}
