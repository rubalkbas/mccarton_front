import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Colores } from "../admin/products/colors/colors.component";

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

  public crearMaterial(material: any): Observable<any> {
    return this.http.post(
      `${this.urlAdmin}/Materiales/nuevoMaterial`,
      material,
      this.httpOptions
    );
  }

  public actualizarMaterial(material: any): Observable<any> {
    return this.http.put(
      `${this.urlAdmin}/Materiales/actualizarMaterial`,
      material,
      this.httpOptions
    );
  }

  public listarColores(): Observable<any> {
    return this.http.get(`${this.urlAdmin}/colores/todos`, this.httpOptions);
  }

  public crearColor(material: any): Observable<any> {
    return this.http.post(
      `${this.urlAdmin}/colores/nuevoColor`,
      material,
      this.httpOptions
    );
  }

  public actualizarColor(material: any): Observable<any> {
    return this.http.put(
      `${this.urlAdmin}/colores/actualizarEstatusColor`,
      material,
      this.httpOptions
    );
  }

}
