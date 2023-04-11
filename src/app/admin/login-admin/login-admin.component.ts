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

  registerForm: FormGroup;
  public password: string = null;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public snackBar: MatSnackBar,
    private usuarioService: UsuariosService,
    private sessionStorage: SessionAdminStorageService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, emailValidator])],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
    this.registerForm = this.formBuilder.group({
      correoElectronico: [
        "",
        Validators.compose([Validators.required, emailValidator]),
      ],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      nombre: ["", Validators.compose([Validators.required])],
      apellidoPaterno: ["", Validators.compose([Validators.required])],
      apellidoMaterno: ["", Validators.compose([Validators.required])],
      telefono: ["", Validators.compose([Validators.required])],
      estatus: [0, Validators.compose([Validators.required])],
      multipartFile: [null],
      bytesImagen: [null],
    });
  }

  onLoginFormSubmit() {
    if (this.loginForm.valid) {
      let usuarioLogin: Usuario = {
        correoElectronico: this.loginForm.get("email").value,
        password: this.loginForm.get("password").value,
      };

      this.usuarioService.loginUsuario(usuarioLogin).subscribe((data) => {
        console.log(data);
      });

      this.usuarioService.loginUsuario2(usuarioLogin).subscribe({
        next: (data) => {
          if (data.ok) {
            this.sessionStorage.saveUser(data.response);
            this.router.navigate(["/admin"]);
          } else {
            Util.errorMessage(data.mensaje);
          }
          const token = localStorage.getItem("access_token");
          console.log(token);
          console.log(data);
        },
        error: (error) => {
          Util.errorMessage(error.error.mensaje);
        },
      });
    }
  }
}
