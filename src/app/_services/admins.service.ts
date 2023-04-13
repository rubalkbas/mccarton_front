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
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private urlAdmin = "http://localhost:8090";
  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  token: any;
  constructor(private http: HttpClient) { }

  //CRUD ROLES

  public getAllRoles(): Observable<any> {
    const url = `${this.urlAdmin}/roles/todos`;
    return this.http.get(url);
  }

  public saveRol(nombreRol, descripcionRol): Observable<any> {
    const url = `${this.urlAdmin}/roles/nuevoRol`;
    const body = { nombreRol: nombreRol, descripcionRol: descripcionRol };
    return this.http.post(url, body);
  }

  public editarRol(idRol, estatus): Observable<any> {
    const url = `${this.urlAdmin}/roles/actualizarEstatusRol`;
    const body = { idRol, estatus };
    return this.http.put(url, body);
  }
  public getRolesActivos(): Observable<any> {
    const url = `${this.urlAdmin}/roles/todosActivos`;
    return this.http.get(url);
  }
  //CRUD MATERIALES
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


  //Añadiendo el CRUD  Cliente

  public saveCliente(cliente): Observable<SingleResponse<Cliente>> {
    let headers = new HttpHeaders();
    headers = headers.append('enctype', 'multipart/form-data');
    return this.http.post<SingleResponse<Cliente>>(`${this.urlAdmin}/registro/cliente`, cliente, { headers: headers });
  }

  public actualizarCliente(body: FormData): Observable<any> {
    const headers = new HttpHeaders().append('enctype', 'multipart/form-data');
    const url = `${this.urlAdmin}/clientes/actualizarCliente`;
    return this.http.put(url, body, { headers: headers });
  }

  public autenticacionCliente(correoElectronico: string, password: string): Observable<Cliente[]> {
    const complemento = "/loginCliente";
    const cliente = {
      email: correoElectronico,
      password: password
    };
    return this.http.post<Cliente[]>(this.urlAdmin + complemento, cliente, { observe: 'response' })
      .pipe(
        tap(response => {
          const expiresIn = 900; // tiempo en segundos
          const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
          this.token = response.headers.get('Authorization');
          console.log('Token:', this.token);
          localStorage.setItem('authTokenExpiration', expirationDate.toISOString());
          localStorage.setItem('access_token', this.token);

          // Eliminar el token del localStorage cuando expire
          setTimeout(function () {
            localStorage.removeItem('authTokenExpiration');
            localStorage.removeItem('access_token');
          }, expiresIn * 1000);
        }),
        map(response => response.body || [])
      );
  }

  public loginCliente(cliente: Cliente): Observable<any> {
    return this.http.post<any>(`${this.urlAdmin}/clientes/loginCliente`, cliente);
  }
  public listarClientes(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/clientes/todos`, this.httpOptions);
  }
  public listarClientesActivos(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/clientes/listarClientesActivos`, this.httpOptions);
  }
  public consultarCliente(id: number): Observable<any> {
    const url = `${this.urlAdmin}/clientes/consultarCliente/${id}`;
    return this.http.get(url, this.httpOptions);
  }

  public eliminarCliente(id: number): Observable<SingleResponse<Cliente>> {
    return this.http.delete<SingleResponse<Cliente>>(`${this.urlAdmin}/clientes/eliminarCliente/${id}`, this.httpOptions);
  }

  //CRUD DIRECCIONES
  public consultarDireccion(id: number): Observable<any> {
    const url = `${this.urlAdmin}/direcciones/consultarDireccionPorCliente/${id}`;
    return this.http.get(url, this.httpOptions);
  }
  public eliminarDireccion(id: number): Observable<any> {
    const url = `${this.urlAdmin}/direcciones/eliminarDireccion/${id}`;
    return this.http.delete(url, this.httpOptions);
  }
  public crearDireccion(
    calle,
    numeroExterior,
    numeroInterior,
    codigoPostal,
    nombreDireccion,
    colonia,
    entreCalle1,
    entreCalle2,
    ciudad,
    telefono,
    cliente,
  ): Observable<any> {
    const url = `${this.urlAdmin}/direcciones/crearDireccion/${cliente}`;
    const body = {
      calle: calle,
      numeroExterior: numeroExterior,
      numeroInterior: numeroInterior,
      codigoPostal: codigoPostal,
      nombreDireccion: nombreDireccion,
      colonia: colonia,
      entreCalle1: entreCalle1,
      entreCalle2: entreCalle2,
      ciudad: ciudad,
      telefono: telefono,
    };
    return this.http.post(url, body);
  }

  //CRUD COLORES 
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
  public actualizaColor(color: Colores): Observable<any> {
    return this.http.put(
      `${this.urlAdmin}/colores/actualizarColor`,
      color,
      this.httpOptions
    );
  }

  //CRUD PRODUCTOS
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
  //Lista de Deseos 


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

  public getAllPreguntas(): Observable<any> {
    const url = `${this.urlAdmin}/preguntaFrecuente/consultarTodos`;
    return this.http.get(url);
  }


  public crearPreguntaFrecuente(pregunta, respuesta): Observable<any> {
    const url = `${this.urlAdmin}/preguntaFrecuente/guardar`;
    const body = {
      pregunta: pregunta,
      respuesta: respuesta
    };
    return this.http.post(url, body);
  }
  public editarPreguntaFrecuente(idPreguntaFrecuente, pregunta, respuesta): Observable<any> {
    const url = `${this.urlAdmin}/preguntaFrecuente/actualizar`;
    const body = { idPreguntaFrecuente, pregunta, respuesta };
    return this.http.put(url, body);
  }


  public getAllPreguntasActivas(): Observable<any> {
    const url = `${this.urlAdmin}/preguntaFrecuente/consultarTodosActivos`;
    return this.http.get(url);
  }

  public actualizarEstatusPregunta(idPreguntaFrecuente, estatus): Observable<any> {
    const url = `${this.urlAdmin}/preguntaFrecuente/actualizarEstatus?idPreguntaFrecuente=${idPreguntaFrecuente}&estatus=${estatus}`;
    return this.http.put(url, {});
  }

  public eliminarPreguntaFrecuente(idPreguntaFrecuente): Observable<any> {
    const url = `${this.urlAdmin}/preguntaFrecuente/eliminar?idPreguntaFrecuente=${idPreguntaFrecuente}`;
    return this.http.delete(url, {});

  }
  //PREGUNTAS FRECUENTES


  //Ofrerta de Producto 


  public crearOferta(
    idProducto,
    tipoOferta,
    codigoOferta,
    descuentoEnPorcentaje,
    fechaInicio, fechaFin,
    descripcion,
    condicionesOferta,
    numeroUso,
    estatus
  ):
    Observable<any> {
    const url = `${this.urlAdmin}/oferta/guardar?idProducto=${idProducto}`;
    const body = {

      tipoOferta: tipoOferta,
      codigoOferta: codigoOferta,
      descuentoEnPorcentaje: descuentoEnPorcentaje,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      descripcion: descripcion,
      condicionesOferta: condicionesOferta,
      numeroUso: numeroUso,
      estatus: estatus
    };
    return this.http.post(url, body);
  }


  public editarOferta(
    idProducto,
    idOferta,
    tipoOferta
    , descuentoEnPorcentaje,
    fechaInicio, fechaFin,
    descripcion,
    condicionesOferta,
    codigoOferta,
    numeroUso
  ):
    Observable<any> {
    const url = `${this.urlAdmin}/oferta/actualizar?idProducto=${idProducto}`;
    const body =
    {
      idOferta,
      tipoOferta,
      descuentoEnPorcentaje,
      fechaInicio, fechaFin,
      descripcion,
      condicionesOferta,
      codigoOferta,
      numeroUso
    };
    return this.http.put(url, body);
  }
  public actualizarEstatusOferta(idOferta, estatus): Observable<any> {
    const url = `${this.urlAdmin}/oferta/actualizarActivo?idOferta=${idOferta}&estatus=${estatus}`;
    return this.http.put(url, {});
  }

  public getAllOfertasActivas(): Observable<any> {
    const url = `${this.urlAdmin}/oferta/consultarTodosActivos`;
    return this.http.get(url);
  }

  public getAllOfertas(): Observable<any> {
    const url = `${this.urlAdmin}/oferta/consultarTodos`;
    return this.http.get(url);
  }

  public buscarOfertaId(idProducto): Observable<any> {
    const url = `${this.urlAdmin}/oferta/consultarPorIdProducto?idProducto=${idProducto}`;
    return this.http.get(url, {});

  }
  //Fin de Oferta Pregunta



  //LISTA DE DESEOS


  public guardarDeseo(
    idCliente,
    idProducto
  ): Observable<any> {
    const url = `${this.urlAdmin}/listaDeseos/guardarListaDeseos?idProducto=${idProducto}&idCliente=${idCliente}`;
    return this.http.post(url, {});
  }
  public obtenerDeseos(
    idCliente
  ): Observable<any> {
    const url = `${this.urlAdmin}/listaDeseos/consultarTodos?idCliente=${idCliente}`;
    return this.http.post(url, {});
  }
  public eliminarDeseo(idProducto): Observable<any> {
    const url = `${this.urlAdmin}/preguntaFrecuente/eliminarDeseo?idListaDeseo=${idProducto}`;
    return this.http.delete(url, {});

  }
}





