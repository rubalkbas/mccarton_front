import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admins.service';
import { Cliente } from '../../../models/cliente.model';
import { Direccion } from '../../../models/direccion.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public direcciones: Direccion= new Direccion();
  constructor(public adminService: AdminService) { }

  ngOnInit() {
    const idCliente=localStorage.getItem('cliente');
    console.log(idCliente)
    this.adminService.consultarCliente(parseInt(idCliente))
    .subscribe(
      (response: any) => {
        this.cliente = response.response;
        console.log(response)
        console.log('Cliente consultado:', this.cliente);
      },
      (error: any) => {
        console.error('Error al consultar el cliente:', error);
      }
    );
    this.adminService.consultarDireccion(parseInt(idCliente)).subscribe(response=>{
      this.direcciones=response.response
      console.log(this.direcciones)
    })
  }

}
