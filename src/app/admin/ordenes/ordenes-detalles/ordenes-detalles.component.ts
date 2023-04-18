import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdenesService } from 'src/app/_services/ordenes.service';
import { OrdenDetalle } from 'src/app/models/ordenes.model';

@Component({
  selector: 'app-ordenes-detalles',
  templateUrl: './ordenes-detalles.component.html',
  styleUrls: ['./ordenes-detalles.component.scss']
})
export class OrdenesDetallesComponent implements OnInit {

  private idOrden:number;
  _listaDetallaOrdenes:OrdenDetalle[]=[];

  public page: any=1;
  public sizePage:number=5;


  constructor(
    private route:ActivatedRoute,
    private ordenService:OrdenesService
  ) { }

  ngOnInit(): void {
    this.obtenerDetalleOrden();
  }

  obtenerDetalleOrden(){
    this.route.queryParams.subscribe( params => {
      this.idOrden=params.idOrden;
      this.ordenService.detalleOrden(this.idOrden).subscribe({next:data=>{
        this._listaDetallaOrdenes=data.response.detalles;
      }, error:error=>{
        this._listaDetallaOrdenes=[]
      }
    })
   });
  }
  
}
