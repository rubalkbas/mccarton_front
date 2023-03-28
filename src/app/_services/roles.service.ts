import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private API_SERVER ="http://localhost:8090/roles"
  constructor(private httpClient: HttpClient) { }

  public getAllRoles(): Observable<any>{
    const url=`${this.API_SERVER}/todos`;
    return this.httpClient.get(url);
  }

  public saveRol(nombreRol, descripcionRol): Observable<any>{
    const url=`${this.API_SERVER}/nuevoRol`;
    const body ={nombreRol: nombreRol, descripcionRol: descripcionRol};
    return this.httpClient.post(url, body);
  }
  
  public editarRol(idRol, estatus): Observable<any>{
    const url=`${this.API_SERVER}/actualizarEstatusRol`;
    const body = { idRol, estatus }; 
    return this.httpClient.put(url, body);
  }
}
