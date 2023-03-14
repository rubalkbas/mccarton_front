import { AdminService } from "../../../../_services/admins.service";
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
import { Colores } from "../colors.component";
import Swal from "sweetalert2";
import { Util as util } from "src/app/util/util";

@Component({
  selector: "app-color-dialog",
  templateUrl: "./color-dialog.component.html",
  styleUrls: ["./color-dialog.component.scss"],
})
export class ColorDialogComponent implements OnInit {
  charsWritten = 0;
  maxChars = 100;
  isUpdate = false;

  public form = new FormGroup({
    id: new FormControl(0),
    nombre: new FormControl(null, Validators.required),
    descripcion: new FormControl(null, Validators.required),
    estatus: new FormControl(null, Validators.required),
  });
  color: Colores;

  constructor(
    public dialogRef: MatDialogRef<ColorDialogComponent>,
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

    this.color = this.data.color;
    this.isUpdate = this.color ? true : false;

    /**Si this.color no es vacio o nulo asignamos los valores al formulario */

    if (this.color) {
      this.charsWritten = this.color.descripcionColor.length;
      this.form.setValue({
        id: this.color.idColor,
        nombre: this.color.nombreColor,
        descripcion: this.color.descripcionColor,
        estatus: this.color.estatus === 1 ? "Activo" : "Inactivo",
      });
    }
  }

  updateCharsCount(text: string) {
    this.charsWritten = text.length;
  }

  public onSubmit() {

    const estatus = this.form.value.estatus === "Activo" ? 1 : 0;

    const color: Colores = {
      idColor: this.form.value.id,
      nombreColor: this.form.value.nombre,
      descripcionColor: this.form.value.descripcion,
      estatus: estatus,
    };

    if (!this.isUpdate) {

      this.adminService.crearColor(color).subscribe({
        next: (response) => {
          util.successMessage(response.mensaje);
          this.dialogRef.close(true);
        },
        error: (error) => {
          util.errorMessage(error.error.mensaje);
          console.log("Error:", error);
          return;
        }
      });
    } else {

      this.adminService.actualizarColor(color).subscribe({
        next: response => {
          util.successMessage(response.mensaje);
          this.dialogRef.close(true);
          
        },
        error: error => {
          util.errorMessage(error.error.mensaje);
          console.log("Error:", error);
          return;
        }
      });
    }
  }
}
