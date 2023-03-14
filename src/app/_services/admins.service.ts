import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

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

  public eliminarMaterial(id: number): Observable<any> {
    return this.http.delete(
      `${this.urlAdmin}/Materiales/eliminar/${id}`,
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

}
