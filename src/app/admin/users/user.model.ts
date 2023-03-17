//Aqui van los modelos para los usuarios
import { Rol } from "../roles/roles";

export interface Usuario{
  idUsuario:number,
  nombreUsuario: string,
  apellidoPaterno:string,
  apellidoMaterno:string,
  correoElectronico:string,
  password:string,
  foto:string,
  estatus:number,
  rol:Rol
}