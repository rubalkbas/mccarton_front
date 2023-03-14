import { AdminService } from './../../../../_services/admins.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Materiales } from '../materials.component';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-category-dialog',
  templateUrl: './material-dialog.component.html',
  styleUrls: ['./material-dialog.component.scss']
})
export class MaterialDialogComponent implements OnInit {

  public form = new FormGroup({
    id: new FormControl(0),
    nombre: new FormControl(null, Validators.required),
    descripcion: new FormControl(null, Validators.required),
    estatus: new FormControl(null, Validators.required),
  });
  material: any;

  constructor(
    public dialogRef: MatDialogRef<MaterialDialogComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService,
    public fb: UntypedFormBuilder
    ) { }

  ngOnInit(): void { 
    
    this.form = this.formBuilder.group({
      id: 0,
      nombre: [null, Validators.required],
      descripcion: [null, Validators.required],
      estatus: [null, Validators.required],
    });

    // this.form = this.fb.group({
    //   id: 0,
    //   name: [null, Validators.required],
    //   hasSubCategory: false,
    //   parentId: 0
    // }); 

    this.material = this.data.material;

    /**Si this.material no es vacio o nulo asignamos los valores al formulario */
    console.log(this.material);
    if(this.material){
      //this.form.patchValue(this.material);
      this.form.setValue({
        id: this.material.idMaterial,
        nombre: this.material.nombreMaterial,
        descripcion: this.material.descripcionMaterial,
        estatus: this.material.estatus === 1 ? 'Activo' : 'Inactivo'
      });
    }

    // if(this.data.category){
    //   this.form.patchValue(this.data.category); 
    // };
  }

  public onSubmit(){
    console.log(this.form.value);
    if(this.form.valid){

      const estatus = this.form.value.estatus === 'Activo' ? 1 : 0;

      const material : Materiales = {
        idMaterial: this.form.value.id,
        nombreMaterial: this.form.value.nombre,
        descripcionMaterial: this.form.value.descripcion,
        estatus: estatus
      };
      this.adminService.crearMaterial(material).subscribe({
        next: () => {
          Swal.fire(
            'Guardado',
            'El material ha sido guardado.',
            'success'
          );
          this.dialogRef.close(true);
          },
          error: error => {
            console.log('Error:', error);
          }
        });

      //this.dialogRef.close(this.form.value);
    }
  }

}
