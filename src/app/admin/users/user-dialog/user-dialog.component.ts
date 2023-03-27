import { emailValidator } from 'src/app/theme/utils/app-validators';
import { Rol } from './../../roles/roles';
import { RolesService } from './../../../_services/roles.service';
import { Usuario } from './../user.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/_services/usuarios.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  
  public form:FormGroup;
  public passwordHide:boolean = true;

  public password:string=null;

  public _rol:number;
  public _rolesLista:Rol[];


  constructor(public dialogRef: MatDialogRef<UserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public user: Usuario,
              public fb: FormBuilder,
              private rolesService:RolesService) {
                this.iniciarFormulario();
  }

  ngOnInit() {
    this.consoltarRoles();
    this.iniciaValores();
  }
  

  iniciarFormulario(){
    this.form = this.fb.group({
      idUsuario: null,
      nombreUsuario: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      apellidoPaterno: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      apellidoMaterno: null,
      correoElectronico: [null, Validators.compose([Validators.required, Validators.email])],
      password:[null, Validators.compose([Validators.required, Validators.minLength(5)])],
      bytesImagen: null,
      estatus: [1, Validators.compose([Validators.required, Validators.minLength(5)])],
      multipartFile: null,
      idRolF: [null, Validators.compose([Validators.required, Validators.minLength(5)])]
  });
  }

  iniciaValores(){
    if(this.user){
      console.log(this.user);
      // this.user.bytesImagen=null;
      // this.form.setValue(this.user);
      this.form.setValue({
        idUsuario: this.user.idUsuario,
        nombreUsuario: this.user.nombreUsuario,
        apellidoPaterno: this.user.apellidoPaterno,
        apellidoMaterno: this.user.apellidoMaterno,
        correoElectronico: this.user.correoElectronico,
        password: this.user.password,
        bytesImagen:null,
        estatus: this.user.estatus,
        multipartFile: this.user.multipartFile,
        idRolF: this.user.idRolF
      });
      this._rol=this.user.rol.idRol;
    } 
    else{
      this.user = {
            idUsuario: null,
            nombreUsuario: null,
            apellidoPaterno: null,
            apellidoMaterno: null,
            correoElectronico: null,
            password:null,
            nombreImagen:null,
            tipoImagen:null,
            bytesImagen: null,  
            estatus: null,
            rol: null,
            multipartFile: null,
            idRolF: null
      };
    } 
  }

  consoltarRoles(){
    this.rolesService.getAllRoles().subscribe(data=>{
        this._rolesLista=data.response;
        console.log(this._rolesLista)
    })
}

  close(): void {
    this.dialogRef.close();
  }

  enviarDatos(data) {
    let imagenFile: File= new File([], '')
  
    if (data.bytesImagen != null) {
      imagenFile = data.bytesImagen[0].file;
    }


  console.log(data)
    // Crear instancia de FormData y agregar propiedades del usuarioEnviar
    const formData = new FormData();
    formData.append('idUsuario', data.idUsuario==null? null:data.idUsuario.toString());
    formData.append('nombreUsuario', data.nombreUsuario);
    formData.append('apellidoPaterno', data.apellidoPaterno);
    formData.append('apellidoMaterno', data.apellidoMaterno);
    formData.append('correoElectronico', data.correoElectronico);
    if(this.password!=null){
      formData.append('password', this.password);

    }
    formData.append('estatus', data.estatus==null?null:data.estatus.toString());
    formData.append('multipartFile', imagenFile);
    formData.append('idRolF', this._rol==null? null: this._rol.toString());

    this.dialogRef.close(formData);
  }
  
}
