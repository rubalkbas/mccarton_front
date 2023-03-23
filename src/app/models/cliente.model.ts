export class Cliente {
    idCliente: number;
    correoElectronico: string;
    password: string;
    codigoVerificacion: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    estatus: number;
    bytesImagen: any;
    nombreImagen: string;
    tipoImagen: string;
    multipartFile: File;
  }