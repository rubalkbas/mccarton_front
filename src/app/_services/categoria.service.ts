import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
  };
    
  @Injectable({
    providedIn: 'root'
  })


export class CategoriaService {

    constructor(private http: HttpClient) { }

    consultarCargos(): Observable<any> {
        return this.http.get( '/cargo/listaCargos');
      }

}