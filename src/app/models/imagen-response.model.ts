import { Producto } from 'src/app/models/producto.model';
export class ImagenResponse{
    idImagen?: number;
    nombreImagen?: String;
    imagenBits?: String;
    tipoImagen?: String;
    imagenPredeterminado?: number;
    estatus?: number;
    idProducto?: Producto
}