import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../app.service';
import { Product } from '../../app.models';
import { AdminService } from '../../_services/admins.service';
import { Util } from '../../util/util';
import { response } from 'express';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  public quantity: number = 1;
  deseos: any;
  public productos: Producto[] = [];
  imagenesProductos: {[idProducto: string]: string} = {};
  constructor(public appService: AppService, public adminService: AdminService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    const idCliente = localStorage.getItem('cliente');
    this.adminService.obtenerDeseos(idCliente).subscribe(result => {
      Util.successMessage('Lista de deseos Obtenida con exito');
      this.deseos = result.response;
      this.productos = this.deseos.map(deseo => deseo.producto);
      this.productos.forEach(producto => {
        this.adminService.obtenerImagenesProducto(producto).subscribe({
          next: response => {
            const imagen = response.response[0];
            this.imagenesProductos[producto.idProducto] = `data:image/${imagen.tipoImagen};base64,${imagen.imagenBits}`;
          },
          error: error => {
            Util.errorMessage(error.error.mensaje);
          }
        });
      });
    });

    this.appService.Data.cartList.forEach(cartProduct => {
      this.appService.Data.wishList.forEach(product => {
        if (cartProduct.id == product.id) {
          product.cartCount = cartProduct.cartCount;
        }
      });
    });
  }

  public obtenerimagen(idProducto: any) {

  }
  /*
  public remove(product: Product) {
    const index: number = this.appService.Data.wishList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.wishList.splice(index, 1);
    }
  }
  */
  public remove(idListaDeseo: any) {
    this.adminService.eliminarDeseo(idListaDeseo).subscribe(resp => {
      Util.successMessage(resp.mensaje);
      window.location.reload();
    });
  }

  public clear() {
    this.appService.Data.wishList.length = 0;
  }

  public getQuantity(val) {
    this.quantity = val.soldQuantity;
  }

  public addToCart(product: Product) {
    let currentProduct = this.appService.Data.cartList.filter(item => item.id == product.id)[0];
    if (currentProduct) {
      if ((currentProduct.cartCount + this.quantity) <= product.availibilityCount) {
        product.cartCount = currentProduct.cartCount + this.quantity;
      }
      else {
        this.snackBar.open('You can not add more items than available. In stock ' + product.availibilityCount + ' items and you already added ' + currentProduct.cartCount + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        return false;
      }
    }
    else {
      product.cartCount = this.quantity;
    }
    this.appService.addToCart(product);
  }

}