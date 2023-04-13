import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RolesService } from 'src/app/_services/roles.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Util } from '../../../../util/util';
import { AdminService } from '../../../../_services/admins.service';

@Component({
  selector: 'app-direccion-dialog',
  templateUrl: './direccion-dialog.component.html',
  styleUrls: ['./direccion-dialog.component.scss']
})
export class DireccionDialogComponent implements OnInit {
  public formulario: FormGroup;
  public modoEditar: boolean = false;
  public IdCliente:any
  constructor(public dialogRef: MatDialogRef<DireccionDialogComponent>,
    private rolesService: RolesService,
    private adminService:AdminService,
    private formBuilder: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.IdCliente = parseInt(localStorage.getItem('cliente'), 10);
    console.log(this.IdCliente)
    this.formulario = this.formBuilder.group({
      idDireccion: 0,
      calle: ['', Validators.required],
      ciudad: ['', Validators.required],
      colonia: ['', Validators.required],
      codigoPostal:[],
      entreCalle1: ['', Validators.required],
      entreCalle2: ['', Validators.required],
      estatus: 1,
      nombreDireccion: ['', Validators.required],
      numeroExterior: [, Validators.required],
      numeroInterior:[],
      predeterminado:[0],
      telefono:[],
      idCliente:this.IdCliente

    });
  
    if (this.data) {
      this.modoEditar = true;
      this.formulario.patchValue({
        idDireccion: this.data.idDireccion,
        calle:  this.data.calle,
        ciudad: this.data.ciudad,
        colonia:this.data.colonia,
        codigoPostal: this.data.codigoPostal,
        entreCalle1:  this.data.entreCalle1,
        entreCalle2:  this.data.entreCalle2,
        estatus:  this.data.estatus,
        nombreDireccion:  this.data.nombreDireccion,
        numeroExterior:  this.data.numeroExterior,
        numeroInterior: this.data.numeroInterior,
        predeterminado: this.data.predeterminado,
        telefono: this.data.telefono,
        idCliente: this.data.idCliente,
      });
    }
  }

  public onSubmit() {
    if (this.modoEditar) {
      // Actualizar el rol existente
      const idRol = this.formulario.get('id')?.value;
      const estatus = this.formulario.get('estatus')?.value;

      this.rolesService.editarRol(idRol, estatus).subscribe(result => {
        // Emitir el rol actualizado y cerrar el diálogo
        Util.successMessage(result.mensaje);
        this.dialogRef.close(result);
        window.location.reload();
      });

    } else {
      const calle=this.formulario.get('calle')?.value;
      const ciudad=this.formulario.get('ciudad')?.value;
      const codigoPostal=this.formulario.get('codigoPostal')?.value;
      const colonia=this.formulario.get('colonia')?.value;
      const entreCalle1=this.formulario.get('entreCalle1')?.value;
      const entreCalle2=this.formulario.get('entreCalle2')?.value;
      const nombreDireccion=this.formulario.get('nombreDireccion')?.value;
      const numeroExterior=this.formulario.get('numeroExterior')?.value;
      const numeroInterior=this.formulario.get('numeroInterior')?.value;
      const telefono=this.formulario.get('telefono')?.value;
      const cliente=this.IdCliente

      this.adminService.crearDireccion(calle,numeroExterior,numeroInterior,codigoPostal,nombreDireccion,colonia,entreCalle1,entreCalle2,ciudad,telefono,cliente).subscribe(result=>{
          Util.successMessage(result.mensaje)
          this.dialogRef.close(result);
          window.location.reload();
        })
    }
  }
}
