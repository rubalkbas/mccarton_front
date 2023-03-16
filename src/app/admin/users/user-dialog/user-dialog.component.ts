import { emailValidator } from 'src/app/theme/utils/app-validators';
import { Rol } from './../../roles/roles';
import { RolesService } from './../../../_services/roles.service';
import { Usuario } from './../user.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    this.form = this.fb.group({
            idUsuario: null,
            nombreUsuario: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
            apellidoPaterno: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
            apellidoMaterno: null,
            correoElectronico: [null, Validators.compose([Validators.required, Validators.email])],
            password:[null, Validators.compose([Validators.required, Validators.minLength(5)])],
            foto: null,
            estatus: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
            rol: [null, Validators.compose([Validators.required, Validators.minLength(5)])]
        });
  }

  ngOnInit() {
    this.consoltarRoles();
    this.iniciaValores();
  }


  iniciaValores(){
    if(this.user){
      this.form.setValue(this.user);
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
            foto: null,
            estatus: null,
            rol: null
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

  enviarDatos(data:Usuario){
    console.log(data);
    data.password=this.password;
    data.rol={
      idRol:this._rol,
      descripcionRol:null,
      estatus: null,
      nombreRol:null
    };
    // return;
    this.dialogRef.close(
      data
    )
  }

}
