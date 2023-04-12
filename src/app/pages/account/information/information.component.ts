import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../../theme/utils/app-validators';
import { AdminService } from '../../../_services/admins.service';
import { Cliente } from '../../../models/cliente.model';
import { Util } from '../../../util/util';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  infoForm: UntypedFormGroup;
  public cliente: Cliente = new Cliente();
  public IdCliente: any
  public modoEditar: boolean = false;
  passwordForm: UntypedFormGroup;
  constructor(public adminService: AdminService, public formBuilder: UntypedFormBuilder, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.IdCliente = parseInt(localStorage.getItem('cliente'), 10);
    this.infoForm = this.formBuilder.group({
      'nombre': ['', Validators.compose([Validators.required])],
      'apellidoPaterno': ['', Validators.compose([Validators.required])],
      'apellidoMaterno': ['', Validators.compose([Validators.required])],
      'telefono': ['', Validators.compose([Validators.required])],
      'multipartFile': [null],
    });
    const idCliente = localStorage.getItem('cliente');
    console.log(idCliente)
    this.adminService.consultarCliente(parseInt(idCliente))
      .subscribe(
        (response: any) => {
          this.cliente = response.response;
          console.log(response)
          console.log('Cliente consultado:', this.cliente);
          this.modoEditar === true;
          this.infoForm.patchValue({
            nombre: this.cliente.nombre,
            apellidoPaterno: this.cliente.apellidoPaterno,
            apellidoMaterno: this.cliente.apellidoMaterno,
            telefono: this.cliente.telefono,
            multipartFile: this.cliente.multipartFile
          });
  
          // Set the image using the value of "bytesImagen"
          const image = document.getElementById('previewImage') as HTMLImageElement;
          image.setAttribute('src', `data:image/png;base64,${this.cliente.bytesImagen}`);
        },
        (error: any) => {
          console.error('Error al consultar el cliente:', error);
        }
      );
  }
  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.cliente.multipartFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = document.getElementById('previewImage');
      image.setAttribute('src', e.target.result);
    };
    reader.readAsDataURL(file);
  }

  public onInfoFormSubmit(values: Object): void {
    const nombre = this.infoForm.get('nombre')?.value;
    const apellidoPaterno = this.infoForm.get('apellidoPaterno')?.value;
    const apellidoMaterno = this.infoForm.get('apellidoMaterno')?.value;
    const telefono = this.infoForm.get('telefono')?.value;
    const cliente = this.IdCliente
    const body = new FormData();
    body.append('nombre', nombre);
    body.append('apellidoPaterno', apellidoPaterno);
    body.append('apellidoMaterno', apellidoMaterno);
    body.append('telefono', telefono);
    body.append('idCliente', cliente);
    if (this.cliente.multipartFile) {
      body.append('multipartFile', this.cliente.multipartFile, this.cliente.multipartFile.name);
    }
    this.adminService.actualizarCliente(body).subscribe(result => {
      Util.successMessage(result.mensaje)
      window.location.reload();
    });
  }

}
