import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { AdminService } from 'src/app/_services/admins.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Util } from 'src/app/util/util';
import { OfertaProducto } from '../../../../models/ofertaProducto';
import { map } from 'rxjs';
import { until } from 'protractor';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class OfertaDialogComponent implements OnInit {
  public formulario: FormGroup;
  public modoEditar: boolean = false;
  public idProducto = this.data.idProducto


  constructor(public dialogRef: MatDialogRef<OfertaDialogComponent>,
    private AdminService: AdminService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.formulario = this.formBuilder.group({
      idOferta: 0,
      tipoOferta: ['', Validators.required],
      descuentoEnPorcentaje: ['', Validators.required],
      codigoOferta: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      descripcion: ['', Validators.required],
      condicionesOferta: ['', Validators.required],
      numeroUso: [0, Validators.required],
      estatus: 1

    });

    this.AdminService.buscarOfertaId(this.idProducto).subscribe(resp => {
      if (resp!) {
        console.log(resp)
        this.data = resp.response
        console.log(this.data)
        this.modoEditar = true;

        this.formulario.patchValue({
          idOferta: this.data.idOferta,
          tipoOferta: this.data.tipoOferta,
        });

      }
    });

  }

  public onSubmit() {
    const tipoOferta = this.formulario.get('tipoOferta')?.value;
    const descuentoEnPorcentaje = this.formulario.get('descuentoEnPorcentaje')?.value;
    const fechaInicio = this.formulario.get('fechaInicio')?.value;
    const fechaFin = this.formulario.get('fechaFin')?.value;
    const descripcion = this.formulario.get('descripcion')?.value;
    const condicionesOferta = this.formulario.get('condicionesOferta')?.value;
    const codigoOferta = this.formulario.get('codigoOferta')?.value;
    const numeroUso = this.formulario.get('numeroUso')?.value;
    this.AdminService.crearOferta(this.idProducto, tipoOferta, codigoOferta, descuentoEnPorcentaje, fechaInicio, fechaFin, descripcion, condicionesOferta, numeroUso).subscribe(result => {
      console.log(result)
      Util.successMessage(result.mensaje);
      this.dialogRef.close(result);
      window.location.reload();
    });

  }
}
