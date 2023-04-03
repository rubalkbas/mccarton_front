import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { AdminService } from 'src/app/_services/admins.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Util } from 'src/app/util/util';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class OfertaDialogComponent implements OnInit {
  public formulario: FormGroup;
  public modoEditar: boolean = false;

  constructor(public dialogRef: MatDialogRef<OfertaDialogComponent>,
    private AdminService: AdminService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({

      idOferta: 0,
      tipoOferta: ['', Validators.required],
      descuentoEnPorcentaje: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      descripcion: ['', Validators.required],
      condicionesOferta: ['', Validators.required],
      numeroUso: ['', Validators.required],
      estatus: 1

    });
    if (this.data) {
      this.modoEditar = true;
      this.formulario.patchValue({
        idOferta: this.data.idOferta,
        tipoOferta: this.data.tipoOferta,
        descuentoEnPorcentaje: this.data.descuentoEnPorcentaje,
        fechaInicio: this.data.fechaInicio,
        fechaFin: this.data.fechaFin,
        descripcion: this.data.descripcion,
        condicionesOferta: this.data.condicionesOferta,
        numeroUso: this.data.numeroUso,
        estatus: this.data.estatus
      });
      this.formulario.controls['estatus'].disable();
    }
  }

  public onSubmit() {
    if (this.modoEditar) {
      // Actualizar la Oferta existente
      const idOferta = this.formulario.get('idOferta')?.value;
      const tipoOferta = this.formulario.get('tipoOferta')?.value;
      const descuentoEnPorcentaje = this.formulario.get('descuentoEnPorcentaje')?.value;
      const fechaInicio = this.formulario.get('fechaInicio')?.value;
      const fechaFin = this.formulario.get('fechaFin')?.value;
      const descripcion = this.formulario.get('descripcion')?.value;
      const condicionesOferta = this.formulario.get('condicionesOferta')?.value;
      const numeroUso = this.formulario.get('numeroUso')?.value;

      this.AdminService.editarOferta(idOferta, tipoOferta, descuentoEnPorcentaje, fechaInicio, fechaFin, descripcion, condicionesOferta, numeroUso).subscribe(result => {
        // Emitir la oferta actualizada y cerrar el diálogo
        Util.successMessage(result.mensaje);
        this.dialogRef.close(result);
        window.location.reload();
      });

    } else {
      
      const tipoOferta = this.formulario.get('tipoOferta')?.value;
      const descuentoEnPorcentaje = this.formulario.get('descuentoEnPorcentaje')?.value;
      const fechaInicio = this.formulario.get('fechaInicio')?.value;
      const fechaFin = this.formulario.get('fechaFin')?.value;
      const descripcion = this.formulario.get('descripcion')?.value;
      const condicionesOferta = this.formulario.get('condicionesOferta')?.value;
      const numeroUso = this.formulario.get('numeroUso')?.value;
      this.AdminService.crearOferta( tipoOferta, descuentoEnPorcentaje, fechaInicio, fechaFin, descripcion, condicionesOferta, numeroUso).subscribe(result => {
        console.log(result)
        Util.successMessage(result.mensaje);
        this.dialogRef.close(result);
        window.location.reload();
      });
    }
  }
}
