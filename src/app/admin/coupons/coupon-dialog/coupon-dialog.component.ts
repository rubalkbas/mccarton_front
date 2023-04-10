import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Producto } from 'src/app/models/producto.model';
import { AdminService } from 'src/app/_services/admins.service';
import { Util } from 'src/app/util/util';

@Component({
  selector: 'app-coupon-dialog',
  templateUrl: './coupon-dialog.component.html',
  styleUrls: ['./coupon-dialog.component.scss']
})
export class CouponDialogComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public products = []; 
  public form: UntypedFormGroup;
  public formulario: FormGroup;
  public modoEditar: boolean = false;
  public idProducto = this.data.idProducto;
  product: Producto;

  constructor(public dialogRef: MatDialogRef<CouponDialogComponent>, 
    private AdminService: AdminService,
    private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public fb: UntypedFormBuilder) { }

  ngOnInit(): void { 
    this.form = this.fb.group({
      //
       //id: 0, 
       //title: ['', Validators.required],
       //code: ['', Validators.required],
       //desc: null, 
      // discountType: null,
       //amount: null,
      // expiryDate: null,
       //allowFreeShipping: false,
       //storeId: null,
       //showOnStore: false,
       //restriction: this.fb.group({ 
       //  minimumSpend: null,
        // maximumSpend: null,
         //individualUseOnly: false,
         //excludeSaleItems: false,
        // products: [[]],
        // categories: [[]]
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
      }),
       //limit: this.fb.group({ 
        // perCoupon: null,
         //perItems: null,
         //perUser: null
      // }) 
    // }); 

    // if(this.data.coupon){
      // this.form.patchValue(this.data.coupon);
      // this.products = this.data.coupon.restriction.products;
    // };
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
   }

  public onSubmit(){
    if(this.modoEditar==false){
      const tipoOferta = this.formulario.get('tipoOferta')?.value;
        const descuentoEnPorcentaje = this.formulario.get('descuentoEnPorcentaje')?.value;
        const fechaInicio = this.formulario.get('fechaInicio')?.value;
        const fechaFin = this.formulario.get('fechaFin')?.value;
        const descripcion = this.formulario.get('descripcion')?.value;
        const condicionesOferta = this.formulario.get('condicionesOferta')?.value;
        const codigoOferta = this.formulario.get('codigoOferta')?.value;
        const numeroUso = this.formulario.get('numeroUso')?.value;
        const estatus=this.formulario.get('estatus')?.value;
        
        console.log(fechaInicio)
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

  public addProduct(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value; 
    if ((value || '').trim()) {
      this.products.push( value.trim() );
    } 
    if (input) {
      input.value = '';
    }  
    this.form['controls'].restriction['controls'].products.patchValue(this.products);
  }

  public removeProduct(fruit: any): void {
    const index = this.products.indexOf(fruit); 
    if (index >= 0) {
      this.products.splice(index, 1);
    }
    this.form['controls'].restriction['controls'].products.patchValue(this.products);
  }

}
