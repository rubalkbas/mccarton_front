import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/_services/admins.service';
import { OrdenesService } from 'src/app/_services/ordenes.service';
import { OrdenDetalle } from 'src/app/models/ordenes.model';

@Component({
  selector: 'app-ordenes-detalles',
  templateUrl: './ordenes-detalles.component.html',
  styleUrls: ['./ordenes-detalles.component.scss']
})
export class OrdenesDetallesComponent implements OnInit {

  private idOrden:number;
  _listaDetalleOrdenes:OrdenDetalle[]=[];

  imagenesProductos: {[idProducto: string]: string} = {};


  public page: any=1;
  public sizePage:number=5;


  constructor(
    private route:ActivatedRoute,
    private ordenService:OrdenesService,
    private adminService:AdminService
  ) { }

  ngOnInit(): void {
    this.obtenerDetalleOrden();
  }

  obtenerDetalleOrden(){
    this.route.queryParams.subscribe( params => {
      this.idOrden=params.idOrden;
      this.ordenService.detalleOrden(this.idOrden).subscribe({next:data=>{
        this._listaDetalleOrdenes=data.response.detalles;
        this.obtenerImagen(data.response.detalles)
        console.log(this._listaDetalleOrdenes)
      }, error:error=>{
        this._listaDetalleOrdenes=[];
      }
    })
   });
  }
  
  obtenerImagen(ordenes:OrdenDetalle[]){
    ordenes.forEach(producto=>{
      this.adminService.obtenerImagenesProducto(producto.producto).subscribe({
        next:data=>{
          const imagen = data.response[data.response.length -1];
          this.imagenesProductos[producto.producto.idProducto] = `data:image/${imagen.tipoImagen};base64,${imagen.imagenBits}`;
        }, error:error=>{
          //This is intentionally
        }
      })

    })
  }

}
