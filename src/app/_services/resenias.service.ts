import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleResponse } from '../models/response.model';
import { Resenia, ReseniaOrden } from '../models/resenia.model';

@Injectable({
  providedIn: 'root'
})
export class ReseniasService {
  
  private API_SERVER = "http://localhost:8090";
  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json",  }),
  };

  constructor(private http:HttpClient) { }

  crearResenia(resenia:ReseniaOrden):Observable<SingleResponse<Resenia>>{
    return this.http.post<SingleResponse<Resenia>>(`${this.API_SERVER}/resenias/crearResenia`, resenia, this.httpOptions);
  }

  listarResenias():Observable<SingleResponse<Resenia>>{
    return this.http.get<SingleResponse<Resenia>>(`${this.API_SERVER}/resenias/lsitarResenias`,this.httpOptions);
  }

  listarReseniasClienteProdudcto(idCliente:number, idProducto:number){
    return this.http.get<SingleResponse<Resenia>>(`${this.API_SERVER}/resenias/listarReseniasClienteProducto?idCliente=${idCliente}&idProducto=${idProducto}`,this.httpOptions);
  }

  consultarReseniasCliente(idCliente:number):Observable<SingleResponse<Resenia>>{
    return this.http.get<SingleResponse<Resenia>>(`${this.API_SERVER}/resenias/listarReseniasCliente?idCliente=${idCliente}`,this.httpOptions);
  }

  listarReseniaId(idResenia:number):Observable<SingleResponse<Resenia>>{
    return this.http.get<SingleResponse<Resenia>>(`${this.API_SERVER}/resenias/lsitarReseniaId/${idResenia}`,this.httpOptions);
  }


  actualizarResenia(resenia:Resenia):Observable<SingleResponse<Resenia>>{
    return this.http.put<SingleResponse<Resenia>>(`${this.API_SERVER}/resenias/actualizarResenia`, resenia, this.httpOptions);
  }

  eliminarResenia(idResenia:number):Observable<SingleResponse<Resenia>>{
    return this.http.delete<SingleResponse<Resenia>>(`${this.API_SERVER}/resenias/eliminarResenia/${idResenia}`, this.httpOptions);
  }

}
