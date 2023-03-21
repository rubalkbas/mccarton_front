import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators, FormBuilder, Form } from '@angular/forms';
import { AdminService } from '../../../../_services/admins.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {
  public formulario: FormGroup;
  public modoEditar: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>, 
    private adminService: AdminService,
    private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder
    
    ) { }

  ngOnInit(): void { 
    this.formulario=this.formBuilder.group({
      id: 0,
      descripcion:['', Validators.required],
      nombre: ['', Validators.required],
      detalles: ['', Validators.required],
      codigo: ['', Validators.required],
      idCategoriaPadre: 0,
      estatus:1

    });
    if(this.data){
      this.modoEditar = true;
      this.formulario.patchValue({
        id: this.data.idCategorias,
        nombre: this.data.nombreCategoria,
        detalles: this.data.detallesCategoria,
        codigo: this.data.codigoReferencia,
        descripcion: this.data.descripcionCategoria,
        idCategoriaPadre: this.data.idCategoriaPadre,
        estatus: this.data.estatus
      });
    }
  }

  public onSubmit(){
    if (this.modoEditar) {
      // Actualizar existente
      const idCategorias = this.formulario.get('id')?.value;
      const descripcionCategoria = this.formulario.get('descripcion')?.value;
      const nombreCategoria = this.formulario.get('nombre')?.value;
      const detallesCategoria = this.formulario.get('detalles')?.value;
      const codigoReferencia = this.formulario.get('codigo')?.value;
      const estatus = this.formulario.get('estatus')?.value;

      this.adminService.editarCategoria(idCategorias, estatus, descripcionCategoria,nombreCategoria,detallesCategoria,codigoReferencia).subscribe(result => {
        this.dialogRef.close(result);
        window.location.reload();
      });

    } else {
      const descripcionCategoria = this.formulario.get('descripcion')?.value;
      const nombreCategoria = this.formulario.get('nombre')?.value;
      const detallesCategoria = this.formulario.get('detalles')?.value;
      const codigoReferencia = this.formulario.get('codigo')?.value;
      this.adminService.crearCategoria(descripcionCategoria,nombreCategoria, detallesCategoria,codigoReferencia).subscribe(result => {
        console.log(result)
        this.dialogRef.close(result);
        window.location.reload();
      });
    }
  }

}
