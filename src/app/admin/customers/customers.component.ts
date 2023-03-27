import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service'; 
import { MatDialog } from '@angular/material/dialog';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { customers } from './customers';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Cliente } from '../../models/cliente.model';
import { AdminService } from '../../_services/admins.service';
import { Util } from '../../util/util';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  cliente: Cliente[]=[];
  public customers = [];
  public page: any;
  public count = 6;
  constructor(
    public adminService:AdminService
    ) {

  }

  ngOnInit(): void {
    this.adminService.listarClientes().subscribe(resp=>{
      this.cliente=resp.response;
      console.log(resp.response)
    }, error=>{console.error(error)})
  }

  public onPageChanged(event){

  }

  public openCustomerDialog(data:any){

  }

  public remove(cliente:Cliente):void{
    this.adminService.eliminarCliente(cliente.idCliente).subscribe(
      (response) => {
        Util.successMessage(response.mensaje);
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
