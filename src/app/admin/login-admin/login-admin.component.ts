import { SessionAdminStorageService } from './../../_services/session-storage.service';
import { Util } from './../../util/util';
import { Usuario } from './../users/user.model';
import { UsuariosService } from 'src/app/_services/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { emailValidator } from 'src/app/theme/utils/app-validators';

@Component({
  selector: "app-login-admin",
  templateUrl: "./login-admin.component.html",
  styleUrls: ["./login-admin.component.scss"],
})
export class LoginAdminComponent implements OnInit {
  loginForm: FormGroup;

  public password: string = null;

  usuario:any=null;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public snackBar: MatSnackBar,
    private usuarioService: UsuariosService,
    private sessionStorage: SessionAdminStorageService
  ) {}

  ngOnInit() {
    this.verificaSesion();
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, emailValidator])],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  onLoginFormSubmit() {
    if (this.loginForm.valid) {
      let usuarioLogin: Usuario = {
        correoElectronico: this.loginForm.get("email").value,
        password: this.loginForm.get("password").value,
      };

      this.usuarioService.loginUsuario(usuarioLogin).subscribe({next: (data) => {
        this.usuarioService.loginUsuario2(usuarioLogin).subscribe({
          next: (data) => {
            if (data.ok) {
              this.sessionStorage.saveUser(data.response);
              this.router.navigate(["/admin"]);
            } else {
              Util.errorMessage(data.mensaje);
            }
          },
          error: (error) => {
            Util.errorMessage(error.error.mensaje);
          },
        });
      },error: (error) =>{
        if(error.status==401){
          Util.errorMessage("El correo electrónico o la contraseña son incorrectos");
        }
      }});
    }
  }


  verificaSesion(){
      this.sessionStorage.getUser().subscribe((user) => {
        this.usuario = user;
        if(user){
          this.router.navigate(["/admin"]);
        }
      })
    }

}
