import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RolesService } from 'src/app/_services/roles.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-roles-dialog',
  templateUrl: './roles-dialog.component.html',
  styleUrls: ['./roles-dialog.component.scss']
})
export class RolesDialogComponent implements OnInit {
  public formulario: FormGroup;
  public modoEditar: boolean = false;
  constructor(public dialogRef: MatDialogRef<RolesDialogComponent>,
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      id: 0,
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estatus: 1

    });
    if (this.data) {
      this.modoEditar = true;
      this.formulario.patchValue({
        id: this.data.idRol,
        nombre: this.data.nombreRol,
        descripcion: this.data.descripcionRol,
        estatus: this.data.estatus
      });
      this.formulario.controls['nombre'].disable();
      this.formulario.controls['descripcion'].disable();
    }
  }
  public onSubmit() {
    if (this.modoEditar) {
      // Actualizar el rol existente
      const idRol = this.formulario.get('id')?.value;
      const estatus = this.formulario.get('estatus')?.value;

      this.rolesService.editarRol(idRol, estatus).subscribe(result => {
        // Emitir el rol actualizado y cerrar el diálogo
        this.dialogRef.close(result);
        window.location.reload();
      });

    } else {
      const nombreRol = this.formulario.get('nombre')?.value;
      const descripcionRol = this.formulario.get('descripcion')?.value;
      this.rolesService.saveRol(nombreRol,descripcionRol).subscribe(result => {
        console.log(result)
        this.dialogRef.close(result);
        window.location.reload();
      });
    }
  }
}
