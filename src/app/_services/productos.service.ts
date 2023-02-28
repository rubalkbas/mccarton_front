import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
  };
    
  @Injectable({
    providedIn: 'root'
  })
export class ProductoService {

    constructor(private http: HttpClient) { }

    consultarCategoriasHija(idPadre): Observable<any> {
        return this.http.post( 'http://localhost:8084/categoria/consultaCategoriaHija?padre='+ idPadre + '&categoria=0',httpOptions);
      }

}