import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleResponse } from '../models/response.model';
import { CrearOrdenRequest, OrdenActualizar, OrdenDetalle, OrdenDetalleAgregarProducto, Ordenes } from '../models/ordenes.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  
  private API_SERVER = "http://localhost:8090";
  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json",  }),
  };

  constructor(private http:HttpClient) { }

  public listarActivosPorPagina(noPagina:number, campo:string, direccion:string, buscar:string):Observable<any>{
    return this.http.get(`${this.API_SERVER}/ordenes/listarOrdenesPorPagina/page/${noPagina}?campo=${campo}&direccion=${direccion}&buscar=${buscar}`, 
    this.httpOptions);
  }

  public detalleOrden(idOrden:number):Observable<any>{
    return this.http.get<any>(`${this.API_SERVER}/ordenes/detalleOrden/${idOrden}`, this.httpOptions);
  }

  public crearOrden(orden:CrearOrdenRequest):Observable<SingleResponse<Ordenes>>{
    return this.http.post<SingleResponse<Ordenes>>(`${this.API_SERVER}/ordenes/crearOrden`, orden, this.httpOptions);
  }

  public actualizarOrden(orden:OrdenActualizar):Observable<SingleResponse<Ordenes>>{
    return this.http.put<SingleResponse<Ordenes>>(`${this.API_SERVER}/ordenes/actualizar`, orden, this.httpOptions);
  }

  public agregarProductoOrdenDetalle(orden:OrdenDetalleAgregarProducto):Observable<SingleResponse<OrdenDetalle>>{
    return this.http.put<SingleResponse<OrdenDetalle>>(`${this.API_SERVER}/ordenes/agregarProductoOrdenDetalle`, orden, this.httpOptions);
  }

  public eliminarProductoOrdenDetalle(idOrden:number,idOrdenDetalle:number, iva:number):Observable<SingleResponse<OrdenDetalle>>{
    return this.http.delete<SingleResponse<OrdenDetalle>>(`${this.API_SERVER}/ordenes/eliminarProductoOrdenDetalle?idOrden=${idOrden}&idOrdenDetalle=${idOrdenDetalle}&iva=${iva}`, this.httpOptions);
  }

  public eliminarOrden(idOrden:number){
    return this.http.delete<SingleResponse<Ordenes>>(`${this.API_SERVER}/ordenes/eliminarOrden?idOrden=${idOrden}`, this.httpOptions);
  }

}
