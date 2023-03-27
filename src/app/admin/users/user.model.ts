//Aqui van los modelos para los usuarios
import { Rol } from "../roles/roles";

export interface Usuario{
  idUsuario?:number,
  nombreUsuario?: string,
  apellidoPaterno?:string,
  apellidoMaterno?:string,
  correoElectronico?:string,
  password?:string,
  nombreImagen?:string,
  tipoImagen?:string,
  bytesImagen?: Uint8Array
  estatus?:number,
  rol?:Rol,
  multipartFile?: File,
  idRolF?: number,
}