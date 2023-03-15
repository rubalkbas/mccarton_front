import { AdminService } from "./../../../../_services/admins.service";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Util as util } from "src/app/util/util";
import { Materiales } from "src/app/models/material.model";

@Component({
  selector: "app-material-dialog",
  templateUrl: "./material-dialog.component.html",
  styleUrls: ["./material-dialog.component.scss"],
})
export class MaterialDialogComponent implements OnInit {
  charsWritten = 0;
  maxChars = 100;
  isUpdate = false;

  public form = new FormGroup({
    id: new FormControl(0),
    nombre: new FormControl(null, Validators.required),
    descripcion: new FormControl(null, Validators.required),
    estatus: new FormControl(null, Validators.required),
  });
  material: Materiales;

  constructor(
    public dialogRef: MatDialogRef<MaterialDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService,
    public fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: 0,
      nombre: [null, Validators.required],
      descripcion: [null, Validators.required],
      estatus: [null, Validators.required],
    });

    this.material = this.data.material;
    this.isUpdate = this.material ? true : false;

    /**Si this.material no es vacio o nulo asignamos los valores al formulario */

    if (this.material) {
      this.charsWritten = this.material.descripcionMaterial.length;
      this.form.setValue({
        id: this.material.idMaterial,
        nombre: this.material.nombreMaterial,
        descripcion: this.material.descripcionMaterial,
        estatus: this.material.estatus === 1 ? "Activo" : "Inactivo",
      });
    }
  }

  updateCharsCount(text: string) {
    this.charsWritten = text.length;
  }

  public onSubmit() {

    const estatus = this.form.value.estatus === "Activo" ? 1 : 0;

    const material: Materiales = {
      idMaterial: this.form.value.id,
      nombreMaterial: this.form.value.nombre,
      descripcionMaterial: this.form.value.descripcion,
      estatus: estatus,
    };

    if (!this.isUpdate) {

      this.adminService.crearMaterial(material).subscribe({
        next: (response) => {
            util.successMessage(response.mensaje)
            this.dialogRef.close(true);
          
        },
        error: (error) => {
          util.errorMessage(error.error.mensaje);
          console.log("Error:", error);
          return;
        }
      });
    } else {

      this.adminService.actualizarMaterial(material).subscribe({
        next: (response) => {
          util.successMessage(response.mensaje)
          this.dialogRef.close(true);
          
        },
        error: (error) => {
          util.errorMessage(error.error.mensaje);
          console.log("Error:", error);
          return;
        }
      });
    }
  }
}
