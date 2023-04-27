import { Injectable } from '@angular/core';
import { CarroCompras } from '../models/carro-compras.model';
import { AdminService } from './admins.service';
import { CarroComprasRequest } from '../models/carro-compras-request.model';
import Swal from 'sweetalert2';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarroService {

  public unidadProductos:string;
  public carritos: CarroCompras[] = [];
  public totalProductos: number;
  public totalPrecio: number = 0;
  public imagenesProductos: { [idProducto: string]: string } = {};
  public cargando:boolean;




  constructor(private adminService:AdminService) { }


  listarCarrito() {
    this.cargando = true;
    const idCliente = parseInt(localStorage.getItem('cliente'));
    this.adminService.listarCarrito(idCliente).subscribe((data: any) => {
      console.log(data)
      console.log("eNTRE SERVICE")
      if (data.response === null) {
        this.totalProductos = 0;
        this.carritos = [];
        this.cargando = false;        
        return;
      }
      this.carritos = data.response.carrito;
      this.totalProductos = this.carritos.length;
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

  
  public agregarCarro(producto:Producto){

    const idUsuario = parseInt(localStorage.getItem('cliente'));
    const idProducto = producto.idProducto;

    const carroCompras = new CarroComprasRequest();
    carroCompras.idCliente = idUsuario;
    carroCompras.idProducto = idProducto;
    carroCompras.cantidad =  parseInt(this.unidadProductos);

    console.log(carroCompras)
    this.adminService.agregarProducto(carroCompras).subscribe({
      next:(data:any)=> {
        console.log(data)
        Swal.fire('',data.mensaje,'success');
        this.listarCarrito();
      },
      error: data=>{

      }
    })
  }

}
