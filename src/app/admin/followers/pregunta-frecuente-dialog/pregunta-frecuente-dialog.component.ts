import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminService } from 'src/app/_services/admins.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Util } from '../../../util/util';

@Component({
 selector: 'app-pregunta-frecuente-dialog',
  templateUrl: './pregunta-frecuente-dialog.component.html',
  styleUrls: ['./pregunta-frecuente-dialog.component.scss']
})
export class preguntaFrecuenteDialogComponent implements OnInit {
  public formulario: FormGroup;
  public modoEditar: boolean = false;

  constructor(public dialogRef: MatDialogRef<preguntaFrecuenteDialogComponent>,
    private AdminService: AdminService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      idPreguntaFrecuente: 0,
      pregunta: ['', Validators.required],
      respuesta: ['', Validators.required],
      estatus: 0

    });
    if (this.data) {
      this.modoEditar = true;
      this.formulario.patchValue({
        idPreguntaFrecuente: this.data.idPreguntaFrecuente,
        pregunta: this.data.pregunta,
        respuesta: this.data.respuesta,
        estatus: this.data.estatus
      });
      
    }
  }

  public onSubmit() {
    if (this.modoEditar) {
      // Actualizar la pregunta existente
      const idPreguntaFrecuente = this.formulario.get('idPreguntaFrecuente')?.value;
      const pregunta = this.formulario.get('pregunta')?.value;
      const respuesta = this.formulario.get('respuesta')?.value;
      

      this.AdminService.editarPreguntaFrecuente(idPreguntaFrecuente, pregunta,respuesta).subscribe(result => {
        // Emitir la pregunta actualizada y cerrar el diálogo
        Util.successMessage(result.mensaje);
        this.dialogRef.close(result);
        window.location.reload();
      });

    } else {
      const pregunta = this.formulario.get('pregunta')?.value;
      const respuesta = this.formulario.get('respuesta')?.value;
      this.AdminService.crearPreguntaFrecuente(pregunta, respuesta).subscribe(result => {
        console.log(result)
        Util.successMessage(result.mensaje);
        this.dialogRef.close(result);
        window.location.reload();
      });
    }
  }
}
