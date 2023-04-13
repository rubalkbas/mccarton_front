import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/_services/ordenes.service';
import { Ordenes } from 'src/app/models/ordenes.model';
import { Util } from 'src/app/util/util';

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


  constructor(private ordenService:OrdenesService) { }

  ngOnInit(): void {
    this.listarOrdenesPorPagina(this.page, "idOrden", "asc", "");
  }

  public onPageChanged(event){
    this.page = event;
    this.listarOrdenesPorPagina(this.page, "idOrden", "asc", "");
}

  listarOrdenesPorPagina(noPagina:number, campo:string, direccion:string, buscar:string){
    this.ordenService.listarActivosPorPagina(noPagina, campo, direccion, buscar).subscribe({next:data=>{
        console.log(data);
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

}
