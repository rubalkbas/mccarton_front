import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { AdminService } from 'src/app/_services/admins.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Util } from 'src/app/util/util';
import { OfertaProducto } from '../../../../models/ofertaProducto';
import { map } from 'rxjs';
import { until } from 'protractor';
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class OfertaDialogComponent implements OnInit {
  public formulario: FormGroup;
  public modoEditar: boolean = false;
  public idProducto = this.data.idProducto
  product: Producto;


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
          descuentoEnPorcentaje: this.data.descuentoEnPorcentaje,
          codigoOferta: this.data.codigoOferta,
          fechaInicio: this.data.fechaInicio,
          fechaFin: this.data.fechaFin,
          descripcion: this.data.descripcion,
          condicionesOferta: this.data.condicionesOferta,
          numeroUso: this.data.numeroUso,
          estatus: this.data.estatus
        });
        this.formulario.controls['estatus'].disable();
      }
    });

    console.log(this.modoEditar)
  }
  

  public onSubmit() {
    
    if(this.modoEditar==false){
      console.log("entrando....")
      const tipoOferta = this.formulario.get('tipoOferta')?.value;
        const descuentoEnPorcentaje = this.formulario.get('descuentoEnPorcentaje')?.value;
        const fechaInicio = this.formulario.get('fechaInicio')?.value;
        const fechaFin = this.formulario.get('fechaFin')?.value;
        const descripcion = this.formulario.get('descripcion')?.value;
        const condicionesOferta = this.formulario.get('condicionesOferta')?.value;
        const codigoOferta = this.formulario.get('codigoOferta')?.value;
        const numeroUso = this.formulario.get('numeroUso')?.value;
        const estatus=this.formulario.get('estatus')?.value;
        
        this.AdminService.crearOferta
        (this.idProducto,
          tipoOferta, codigoOferta,
           descuentoEnPorcentaje,
            fechaInicio, fechaFin,
            descripcion, condicionesOferta,
             numeroUso, estatus)
             .subscribe(result => {
          console.log(result)
          Util.successMessage(result.mensaje);
          this.dialogRef.close(result);
          window.location.reload();
        });
    }
    
    else if (this.modoEditar==true){
      //Debe de actualizar la oferta existente
    const idProducto=this.idProducto;
    const idOferta=this.formulario.get('idOferta')?.value;
    const tipoOferta = this.formulario.get('tipoOferta')?.value;
    const descuentoEnPorcentaje = this.formulario.get('descuentoEnPorcentaje')?.value;
    const fechaInicio = this.formulario.get('fechaInicio')?.value;
    const fechaFin = this.formulario.get('fechaFin')?.value;
    const descripcion = this.formulario.get('descripcion')?.value;
    const condicionesOferta = this.formulario.get('condicionesOferta')?.value;
    const codigoOferta = this.formulario.get('codigoOferta')?.value;
    const numeroUso = this.formulario.get('numeroUso')?.value;

    this.AdminService.editarOferta(idProducto,idOferta,tipoOferta,descuentoEnPorcentaje,fechaInicio,fechaFin,descripcion,condicionesOferta,codigoOferta,numeroUso).subscribe(result=>{
      Util.successMessage(result.mensaje);
      this.dialogRef.close(result);
      window.location.reload();
    });
 
  }


}
public cambiarestatusoferta(data: any) {
  const idOferta = data.idOferta;
  let estatus = data.estatus;
  console.log(idOferta, estatus);

  // Invierte el valor de estatus usando una expresión condicional if
  if (estatus === 1) {
    estatus = 0;
  } else {
    estatus = 1;
  }

  this.AdminService.actualizarEstatusOferta(idOferta, estatus).subscribe(resp => {
    Util.successMessage(resp.mensaje);
    window.location.reload();
  });
}
}
