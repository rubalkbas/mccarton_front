import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../app.service';
import { Direccion } from '../../../models/direccion.model';
import { AdminService } from '../../../_services/admins.service';
import { DireccionDialogComponent } from './direccion-dialog/direccion-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  billingForm: UntypedFormGroup;
  shippingForm: UntypedFormGroup;
  countries = [];
  public direcciones: Direccion= new Direccion();
  constructor(public appService:AppService,  public dialog:MatDialog,
    public adminService: AdminService, public formBuilder: UntypedFormBuilder, public snackBar: MatSnackBar) { }

  ngOnInit() {
    const idCliente=localStorage.getItem('cliente');
    this.adminService.consultarDireccion(parseInt(idCliente)).subscribe(response=>{
      this.direcciones=response.response
      console.log(this.direcciones)
    })
  }
  openRolesDialog(data:any){
    const dialogRef = this.dialog.open(DireccionDialogComponent,{
      data:data
    })
  }
  public onBillingFormSubmit(values:Object):void {
    if (this.billingForm.valid) {
      this.snackBar.open('Your billing address information updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

  public onShippingFormSubmit(values:Object):void {
    if (this.shippingForm.valid) {
      this.snackBar.open('Your shipping address information updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

}
