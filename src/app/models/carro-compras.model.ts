import { Cliente } from "./cliente.model";
import { Producto } from "./producto.model";

export class CarroCompras {

    idCarroCompra:number;
    cantidad:number;
    cliente:Cliente;
    producto:Producto;
    subtotal:number

}