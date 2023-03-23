import { SingleResponse } from './../models/response.model';
import { Usuario } from './../admin/users/user.model';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {


    private urlAdmin = "http://localhost:8090";
    private httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
  
    constructor(private http: HttpClient) {}
    
  //Lista todos los usuarios
  public listarUsuarios(): Observable<SingleResponse<Usuario>>{
    return this.http.get<SingleResponse<Usuario>>(`${this.urlAdmin}/usuarios/todos`, this.httpOptions);
  }
  
  //Crea un nuevo usuario
  public crearUsuario(usuario): Observable<SingleResponse<Usuario>>{
    let headers = new HttpHeaders();
    headers = headers.append('enctype', 'multipart/form-data');
    return this.http.post<SingleResponse<Usuario>>(`${this.urlAdmin}/usuarios/nuevoUsuario`,usuario, { headers: headers });
  }
  
  //Actualiza un usuario
  public actualizarUsuario(usuario): Observable<SingleResponse<Usuario>>{
    let headers = new HttpHeaders();
    headers = headers.append('enctype', 'multipart/form-data');
    return this.http.put<SingleResponse<Usuario>>(`${this.urlAdmin}/usuarios/actualizarUsuario`, usuario, { headers: headers });
  }

  //Elimina un usuario
  public eliminarUsuario(id:number): Observable<SingleResponse<Usuario>>{
    return this.http.delete<SingleResponse<Usuario>>(`${this.urlAdmin}/usuarios/eliminarUsuario/${id}`, this.httpOptions);
  }

  //Lista los usuarios activos
  public listarUsuariosActivos(): Observable<SingleResponse<Usuario>>{
    return this.http.get<SingleResponse<Usuario>>(`${this.urlAdmin}/usuarios/listarUsuariosActivos`, this.httpOptions);
  }

  public listarActivosPorPagina(noPagina:number, campo:string, direccion:string, buscar:string):Observable<any>{
    return this.http.get(`${this.urlAdmin}/usuarios/listarUsuariosActivos/page/${noPagina}?campo=${campo}&direccion=${direccion}&buscar=${buscar}`, 
    this.httpOptions);
  }


}