import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AdminService } from '../../_services/admins.service';
import { Cliente } from '../../models/cliente.model';
import { Util } from '../../util/util';
import { until } from 'protractor';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;

  registerForm: FormGroup;
  public password: string = null;
  public cliente: Cliente = new Cliente();

  constructor(

    public formBuilder: FormBuilder,
    private adminService: AdminService,
    public router: Router,
    public snackBar: MatSnackBar
    ) {
    //inicializador de variables:
    this.cliente.correoElectronico = '';
    this.cliente.password = '';
    this.cliente.nombre = '';
    this.cliente.apellidoPaterno = '';
    this.cliente.apellidoMaterno = '';
    this.cliente.telefono = '';
    this.cliente.estatus = 1;
    this.cliente.multipartFile = null;
     }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    this.registerForm = this.formBuilder.group({
      'correoElectronico': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'nombre': ['', Validators.compose([Validators.required])],
      'apellidoPaterno': ['', Validators.compose([Validators.required])],
      'apellidoMaterno': ['', Validators.compose([Validators.required])],
      'telefono': ['', Validators.compose([Validators.required])],
      'estatus': [0, Validators.compose([Validators.required])],
      'multipartFile': [null],
      'bytesImagen': [null],
    });
  }

  public onLoginFormSubmit(values: Object): void {
    this.cliente.correoElectronico=this.loginForm.get('email').value;
    this.cliente.password=this.loginForm.get('password').value;

    let formData = new FormData();
    formData.append('correoElectronico', this.cliente.correoElectronico);
    formData.append('password', this.cliente.password);
    
    console.log(this.cliente.correoElectronico,this.cliente.password)
    this.adminService.autenticacionCliente(this.cliente.correoElectronico,this.cliente.password).subscribe(
      response=>{
       console.log("Buen token")
      }
    )
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
  
  public onRegisterFormSubmit(values: Object): void {
    this.cliente.correoElectronico = this.registerForm.get('correoElectronico').value;
    this.cliente.password = this.registerForm.get('password').value;
    this.cliente.nombre = this.registerForm.get('nombre').value;
    this.cliente.apellidoPaterno = this.registerForm.get('apellidoPaterno').value;
    this.cliente.apellidoMaterno = this.registerForm.get('apellidoMaterno').value;
    this.cliente.telefono = this.registerForm.get('telefono').value;
    this.cliente.estatus = this.registerForm.get('estatus').value;

    let formData = new FormData();
    formData.append('correoElectronico', this.cliente.correoElectronico);
    formData.append('password', this.cliente.password);
    formData.append('nombre', this.cliente.nombre);
    formData.append('apellidoPaterno', this.cliente.apellidoPaterno);
    formData.append('apellidoMaterno', this.cliente.apellidoMaterno);
    formData.append('telefono', this.cliente.telefono);
    formData.append('estatus', this.cliente.estatus.toString());
    if (this.cliente.multipartFile) {
      formData.append('multipartFile', this.cliente.multipartFile, this.cliente.multipartFile.name);
    }
    this.adminService.saveCliente(formData).subscribe({next:data=>{
      Util.successMessage(data.mensaje);
      this.registerForm.reset();
      this.router.navigate(['/account']);
  }})
}

}