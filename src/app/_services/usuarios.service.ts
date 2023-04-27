import { SingleResponse } from './../models/response.model';
import { Usuario } from './../admin/users/user.model';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import jwt_decode from 'jwt-decode';

  @Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  token:any;

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

  public loginUsuario(usuario):Observable<Usuario[]>{

    const usuarioLogin={
      email: usuario.correoElectronico,
      password: usuario.password
    }


    return this.http.post<Usuario[]>(`${this.urlAdmin}/loginUsuario`, usuarioLogin, { observe: 'response' }).pipe(
      tap(response => {
        console.log(response)
        // const expiresIn = 300; // tiempo en segundos
        this.token = response.headers.get('Authorization');
        const expirationDate:any = jwt_decode(this.token);

        console.log('Token:', this.token);
        console.log('Decode', expirationDate);
        localStorage.setItem('authTokenExpiration', expirationDate.exp);
        localStorage.setItem('access_token', this.token);
      }),
      map(response => response.body || [])
    );;
  }

  public loginUsuario2(usuario):Observable<SingleResponse<Usuario>>{
    return this.http.post<SingleResponse<Usuario>>(`${this.urlAdmin}/usuarios/loginUsuario`, usuario, this.httpOptions);
  }

  public detalleUsuario(id:number):Observable<SingleResponse<Usuario>>{
    return this.http.get<SingleResponse<Usuario>>(`${this.urlAdmin}/usuarios/detalleUsuario/${id}`)
  }

}