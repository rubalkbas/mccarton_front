
import { Colores } from "./color.model";
import { Materiales } from "./material.model";
import { Categorias } from "./categoria.model";
import { Imagen } from "./imagen.model";

export class Producto {
    idProducto?: number;
    codigoReferencia?: string;
    nombreProducto?: string;
    descripcionBreve?: string;
    largoInterior?: number;
    largoExterior?: number;
    anchoInterior?: number;
    anchoExterior?: number;
    altoInterior?: number;
    altoExterior?: number;
    stock?: number;
    precioCompra?: number;
    precioVenta?: number;
    fechaAlta?: Date;
    fechaModificacion?: Date;
    peso?: number;
    imagenes?: Imagen[];
    material?: Materiales;
    color?: Colores;
    categoria?: Categorias;
    estatus?: number;
  }