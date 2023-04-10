import { Producto } from "./producto.model";

export class Ordenes{
    idOrden:number;
    calle:string;
    numeroExterior:string
    numeroInterior:string;
    codigoPostal:string;
    colonia:string;
    entreCalle1:string;
    entreCalle2:string;
    ciudad:string;
    telefono:string
    impuesto:number;
    subTotal:number;
    total:number;
    fechaOrden:Date;
    metodoPago:string;
    estatusOrden:string;
    cliente:any;
}

export class OrdenDetalle{
    idOrdenDetalle:number;
    cantidad:number;
    subtotal:number;
    precio:number;
    orden:Ordenes;
    producto:Producto;
}

export class CrearOrdenRequest{
    idCliente:number;
    idDireccion:number;
    totalProductos:number;
    iva:number;
    pagoTotal:number;
    metodoPago:any
}

export class OrdenActualizar{
    idOrden:number;
    idCliente:number;
    idDireccion:number;
    totalProductos:number;
    iva:number;
    pagoTotal:number;
    metodoPago:any
}

export class OrdenDetalleAgregarProducto{
    idOrdenEntity:number;
    idProducto:number;
    cantidad:number;
    iva:number;
}