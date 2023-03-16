import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Colores } from "../models/color.model";
import { Materiales } from "../models/material.model";
import { Producto } from "../models/producto.model";

@Injectable({
  providedIn: "root",
})
export class AdminService {

  private urlAdmin = "http://localhost:8090";
  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) {}

  public listarMateriales(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/Materiales/todos`, this.httpOptions);
  }

  public listarMaterialesActivos(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/Materiales/todosActivos`, this.httpOptions);
  }

  public crearMaterial(material: Materiales): Observable<any> {
    return this.http.post(
      `${this.urlAdmin}/Materiales/nuevoMaterial`,
      material,
      this.httpOptions
    );
  }

  public actualizarMaterial(material: Materiales): Observable<any> {
    return this.http.put(
      `${this.urlAdmin}/Materiales/actualizarMaterial`,
      material,
      this.httpOptions
    );
  }

  public listarColores(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/colores/todos`, this.httpOptions);
  }

  public listarColoresActivos(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/colores/todosActivos`, this.httpOptions);
  }

  public crearColor(color: Colores): Observable<any> {
    return this.http.post(
      `${this.urlAdmin}/colores/nuevoColor`,
      color,
      this.httpOptions
    );
  }

  public actualizarColor(color: Colores): Observable<any> {
    return this.http.put(
      `${this.urlAdmin}/colores/actualizarEstatusColor`,
      color,
      this.httpOptions
    );
  }

  public crearProducto (producto: Producto): Observable<any> {
    return this.http.post(`${this.urlAdmin}/Productos/nuevoProducto`, producto, this.httpOptions);
  }

  public listarProductos(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/Productos/todos`, this.httpOptions);
  }

  public actualizarProducto(producto: Producto): Observable<any> {
    return this.http.put(
      `${this.urlAdmin}/Productos/actualizaProducto`,
      producto,
      this.httpOptions
    );
  }

  public obtenerProducto(producto: Producto): Observable<any> {
    return this.http.post(`${this.urlAdmin}/Productos/detalle`, producto, this.httpOptions);
  }

}
