import { ImagenResponse } from 'src/app/models/imagen-response.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Colores } from "../models/color.model";
import { Materiales } from "../models/material.model";
import { Producto } from "../models/producto.model";
import { Category } from "../app.models";
import { SingleResponse } from "../models/response.model";
import { Cliente } from '../models/cliente.model';
import { Imagen } from "../models/imagen.model";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private urlAdmin = "http://localhost:8090";
  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) { }

  public listarMateriales(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/Materiales/todos`, this.httpOptions);
  }

  public listarMaterialesActivos(): Observable<any> {
    return this.http.get(
      `${this.urlAdmin}/Materiales/todosActivos`,
      this.httpOptions
    );
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
  //Añadiendo el CRUD categorias

  public getAllCategorias(): Observable<any> {
    const url = `${this.urlAdmin}/categorias/todos`;
    return this.http.get(url);
  }

  public getCategoriasActivas(): Observable<any> {
    const url = `${this.urlAdmin}/categorias/consultarCategoriasActivas`;
    return this.http.get(url);
  }

  public crearCategoria(
    descripcionCategoria,
    nombreCategoria,
    detallesCategoria,
    codigoReferencia
  ): Observable<any> {
    const url = `${this.urlAdmin}/categorias/guardarCategoria`;
    const body = {
      descripcionCategoria: descripcionCategoria,
      nombreCategoria: nombreCategoria,
      detallesCategoria: detallesCategoria,
      codigoReferencia: codigoReferencia,
    };
    return this.http.post(url, body);
  }
  public editarCategoria(
    idCategorias,
    estatus,
    descripcionCategoria,
    nombreCategoria,
    detallesCategoria,
    codigoReferencia
  ): Observable<any> {
    const url = `${this.urlAdmin}/categorias/actualizarCategoria`;
    const body = {
      idCategorias,
      estatus,
      descripcionCategoria,
      nombreCategoria,
      detallesCategoria,
      codigoReferencia,
    };
    return this.http.put(url, body);
  }

  //Terminacion del CRUD categorias
   //Añadiendo el CRUD  Cliente

    public saveCliente(cliente): Observable<SingleResponse<Cliente>>{
      let headers = new HttpHeaders();
      headers = headers.append('enctype', 'multipart/form-data');
      return this.http.post<SingleResponse<Cliente>>(`${this.urlAdmin}/registro/cliente`,cliente, { headers: headers });
    }

    public loginCliente(cliente: Cliente): Observable<any> {
      return this.http.post<any>(`${this.urlAdmin}/clientes/loginCliente`, cliente);
    }
    
    public listarClientes(): Observable<any> {
      return this.http.get(`${this.urlAdmin}/clientes/todos`, this.httpOptions);
    }
    
    public eliminarCliente(id: number): Observable<SingleResponse<Cliente>> {
      return this.http.delete<SingleResponse<Cliente>>(`${this.urlAdmin}/clientes/eliminarCliente/${id}`, this.httpOptions);
    }
   /*
    public saveCliente(cliente: any, file: File): Observable<SingleResponse<Cliente>> {
      const formData = new FormData();
      formData.append('cliente', JSON.stringify(cliente));
      formData.append('file', file);
    
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'multipart/form-data');
      return this.http.post<SingleResponse<Cliente>>(`${this.urlAdmin}/registro/cliente`, formData, { headers: headers });
    }    
    */

  //Terminacion CRUD cliente 
  public listarColores(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/colores/todos`, this.httpOptions);
  }

  public listarColoresActivos(): Observable<any> {
    return this.http.get(
      `${this.urlAdmin}/colores/todosActivos`,
      this.httpOptions
    );
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

  public crearProducto(producto: Producto): Observable<any> {
    return this.http.post(
      `${this.urlAdmin}/ProductosImg/crearProductoImagen`,
      producto,
      this.httpOptions
    );
  }

  public listarProductos(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/Productos/todos`, this.httpOptions);
  }

  public listarProductosActivos(): Observable<any> {
    return this.http.get(
      `${this.urlAdmin}/Productos/todosEnStock`,
      this.httpOptions
    );
  }

  public actualizarProducto(producto: Producto): Observable<any> {
    return this.http.put(
      `${this.urlAdmin}/Productos/actualizaProducto`,
      producto,
      this.httpOptions
    );
  }

  public obtenerProducto(producto: Producto): Observable<any> {
    return this.http.post(
      `${this.urlAdmin}/Productos/detalle`,
      producto,
      this.httpOptions
    );
  }

  public obtenerImagenesProducto(producto: Producto): Observable<any> {
    return this.http.post(
      `${this.urlAdmin}/ProductosImg/buscarImagenesProd`,
      producto,
      this.httpOptions
    );
  }

  eliminarImagenes(productoImg: ImagenResponse): Observable<SingleResponse<string>> {
    const url = `${this.urlAdmin}/ProductosImg/elimina`;
    return this.http.delete<SingleResponse<string>>(url, { body: productoImg });
  }

  public agregarImagenesProducto(productoImg: any): Observable<any> {
    return this.http.post(
      `${this.urlAdmin}/ProductosImg/agregarImagen`,
      productoImg,
      this.httpOptions
    );
  }




//SERVICIOS DE PREGUNTAS FRECUENTES

public crearPreguntaFrecuente(pregunta, respuesta): Observable<any> {
  const url = `${this.urlAdmin}/preguntaFrecuente/guardar`;
  const body = {
    pregunta: pregunta,
    respuesta: respuesta
  };
  return this.http.post(url, body);
}
}
//PREGUNTAS FRECUENTES