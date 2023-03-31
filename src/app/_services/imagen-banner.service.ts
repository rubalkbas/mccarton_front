import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleResponse } from '../models/response.model';
import { ImagenBanner } from '../models/imagen-banner.model';

@Injectable({
  providedIn: 'root'
})
export class ImagenBannerService {

  private API_SERVER = "http://localhost:8090";
  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http:HttpClient) { }

  //Listar Todos Banners.
  public listarBanners(): Observable<SingleResponse<ImagenBanner>>{
    return this.http.get<SingleResponse<ImagenBanner>>(`${this.API_SERVER}/imagenbanner/todos`, this.httpOptions);
  }
  //Guardar Banner
  public guardarBanner(imagen:ImagenBanner): Observable<SingleResponse<ImagenBanner>>{
    return this.http.post<SingleResponse<ImagenBanner>>(`${this.API_SERVER}/imagenbanner/guardar`, imagen, this.httpOptions);
  }
  //Actualizar Banner
  public actualizarBanner(imagen:ImagenBanner): Observable<SingleResponse<ImagenBanner>>{
    return this.http.put<SingleResponse<ImagenBanner>>(`${this.API_SERVER}/imagenbanner/actualizar`, imagen, this.httpOptions);
  }
  //Eliminar Banner
  public eliminarBanner(id:number): Observable<SingleResponse<ImagenBanner>>{
    return this.http.delete<SingleResponse<ImagenBanner>>(`${this.API_SERVER}/imagenbanner/eliminar`, this.httpOptions);
  }
  //Actualizar Estatus Banner.
  public actualizarEstatusBanner(idImagenBanner:number, estatus:number): Observable<SingleResponse<ImagenBanner>>{
    return this.http.put<SingleResponse<ImagenBanner>>(`${this.API_SERVER}/imagenbanner/actualizarEstatus`, this.httpOptions);
  }
  //Consultar Todos Banner.
  public mostrarBannersActivos(): Observable<SingleResponse<ImagenBanner>>{
    return this.http.get<SingleResponse<ImagenBanner>>(`${this.API_SERVER}/imagenbanner/todosActivos`, this.httpOptions);
  }



}
