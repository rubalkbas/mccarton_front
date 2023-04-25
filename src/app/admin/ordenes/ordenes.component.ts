import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenesService } from 'src/app/_services/ordenes.service';
import { Ordenes } from 'src/app/models/ordenes.model';
import { Util } from 'src/app/util/util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {

  ordenes:Ordenes[]=[];

  public count : 6;
  public page: number=1;
  public sizePage:number=0;
  public _totalElementos: number=0;


  constructor(private ordenService:OrdenesService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.listarOrdenesPorPagina(this.page, "idOrden", "asc", "");
  }

  public onPageChanged(event){
    this.page = event;
    this.listarOrdenesPorPagina(this.page, "idOrden", "asc", "");
}

  listarOrdenesPorPagina(noPagina:number, campo:string, direccion:string, buscar:string){
    this.ordenService.listarActivosPorPagina(noPagina, campo, direccion, buscar).subscribe({next:data=>{
        this.ordenes=data.response.content;
        this.sizePage=data.response.size;
        this._totalElementos=data.response.totalElements;
    }, error:error=>{
        this.ordenes=[];
        this._totalElementos=0;
        Util.errorMessage(error.error.mensaje);
    }
})
}

  detalleOrden(id:number){
    this.router.navigate(['/admin/ordenes/ordenes-detalles'], { queryParams: { idOrden: id} });
  }

  eliminarOrden(idOrden:number){
    Swal.fire({
      title: "¿Estas seguro de eliminar esta orden?",
      showConfirmButton: false,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: "SI",
      cancelButtonText: "NO",
    }).then((result) => {
      if (result.isDenied) {
        this.ordenService.eliminarOrden(idOrden).subscribe({next:data=>{
          console.log(data);
          Util.successMessage(data.mensaje);
          this.listarOrdenesPorPagina(this.page, "idOrden", "asc", "");
        }, error:error=>{
          console.log(error);
          Util.errorMessage(error.error.mensaje)
        }})
      }
    });
  }

}
