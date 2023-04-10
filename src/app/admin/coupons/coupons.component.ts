import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material/dialog';
import { coupons } from './coupons';
import { CouponDialogComponent } from './coupon-dialog/coupon-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Category } from 'src/app/app.models';
import { AppSettings, Settings } from 'src/app/app.settings';
import { OfertaDialogComponent } from '../products/product-list/product-dialog/product-dialog.component';
import { Util } from 'src/app/util/util';
import { AdminService } from 'src/app/_services/admins.service';
import { OfertaProducto } from 'src/app/models/ofertaProducto';
import { error } from 'console';
import { Producto } from 'src/app/models/producto.model';



@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  public ofertasProducto: OfertaProducto[]= [];
  public productos: Producto[] = [];
  public coupons = [];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ];
  public discountTypes = [
    { id: 1, name: 'Percentage discount' },
    { id: 2, name: 'Fixed Cart Discount' },
    { id: 3, name: 'Fixed Product Discount' }
  ];
  public categories:Category[];
  public page: any;
  public count = 6;
  public settings:Settings;

  constructor(public appService:AppService, 
    public dialog: MatDialog,
     public appSettings:AppSettings,
    private AdminService: AdminService,
    
    ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {

    this.AdminService.getAllOfertas().subscribe(resp =>{
      console.log(resp.response)
      this.ofertasProducto = resp.response;
    }, error => {console.error(error)})
    
    //this.coupons = coupons; 
    //this.getCategories();
  }


  public getCategories(){   
    this.appService.getCategories().subscribe(data => {
      this.categories = data; 
      this.categories.shift();
    }); 
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public openCouponDialog(data:any){
    const dialogRef = this.dialog.open(CouponDialogComponent, {
      data: {
        coupon: data,
        stores: this.stores,
        categories: this.categories,
        discountTypes: this.discountTypes
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(coupon => { 
      if(coupon){    
        const index: number = this.coupons.findIndex(x => x.id == coupon.id);
        if(index !== -1){
          this.coupons[index] = coupon;
        } 
        else{ 
          let last_coupon= this.coupons[this.coupons.length - 1]; 
          coupon.id = last_coupon.id + 1;
          this.coupons.push(coupon);  
        }          
      }
    });
  }

  public remove(coupon:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this coupon?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        const index: number = this.coupons.indexOf(coupon);
        if (index !== -1) {
          this.coupons.splice(index, 1);  
        } 
      } 
    }); 
  }
  public cambiarestatusoferta(oferta: any) {
    const idOferta = oferta.idOferta;
    let estatus = oferta.estatus;
    console.log(idOferta, estatus);
  
    // Invierte el valor de estatus usando una expresión condicional if
    if (estatus === 1) {
      estatus = 0;
    } else {
      estatus = 1;
    }
  
    console.log(estatus)
    this.AdminService.actualizarEstatusOferta(idOferta, estatus).subscribe(resp => {
      Util.successMessage(resp.mensaje);
      window.location.reload();
    });
  }
  }
