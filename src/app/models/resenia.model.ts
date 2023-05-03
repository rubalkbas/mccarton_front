import { Cliente } from "./cliente.model";
import { Producto } from "./producto.model";

export class Resenia{
    idResenia?:number;
    encabezado?:string;
    comentarios?:string;
    valoracion?:number;
    fecha?:Date;
    cliente?:Cliente;
    producto?:Producto;
}

export class ReseniaOrden{
    encabezado?:string;
    comentarios?:string;
    valoracion?:number;
    idCliente?:number;
    idProducto?:number;
}