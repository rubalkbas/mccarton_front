import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImagenBannerService } from 'src/app/_services/imagen-banner.service';
import { ImagenBanner } from 'src/app/models/imagen-banner.model';
import { Util } from 'src/app/util/util';

@Component({
  selector: 'app-banner-dialog',
  templateUrl: './banner-dialog.component.html',
  styleUrls: ['./banner-dialog.component.scss']
})
export class BannerDialogComponent implements OnInit {

  modoEditar:boolean=false;
  public formulario: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<BannerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private bannerService: ImagenBannerService) { }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data.banner!=null){
      this.modoEditar=true;

      this.formulario = this.formBuilder.group({
        descripcion: [this.data.banner!=null?this.data.banner.descripcion:null],
        imagen: [[{ file: this.base64ToFile(this.data.banner), preview: this.bytesToImageUrl(this.data.banner.imagenBits, this.data.banner.tipoArchivo) }]], // ahora es un arreglo de objetos con propiedad 'image'
        estatus:[this.data.banner!=null?this.data.banner.estatus:null]
      });
    }else{
      this.formulario = this.formBuilder.group({
        descripcion: [null],
        imagen: [null],
        estatus:[1]
      });
    }
  }

  public onSubmit() {
    if (this.modoEditar) {
      this.actualizarBanner(this.formulario.value);

    } else {
      this.guardarBanner(this.formulario.value);
    }
  }

  actualizarBanner(banner){
    console.log(banner);
    console.log(this.data.idBanner)
    // return;
    let imagenFile: File= new File([], '')
  
    if (banner.imagen != null) {
      imagenFile = banner.imagen[0].file;
    }
    
    let enviar:FormData= new FormData();
    enviar.append("descripcion", banner.descripcion);
    enviar.append("idBanner", this.data.banner.idBanner);
    enviar.append("estatus", banner.estatus);
    enviar.append("imagen", imagenFile)

    this.bannerService.actualizarBanner(enviar).subscribe({next:response=>{
      Util.successMessage(response.mensaje);
      this.dialogRef.close(response);

    }, error:error=>{
      Util.errorMessage(error.error.mensaje);
    }})
  }

  guardarBanner(banner){
    let imagenFile: File= new File([], '')
  
    if (banner.imagen != null) {
      imagenFile = banner.imagen[0].file;
    }

    let enviar:FormData= new FormData();
    enviar.append("descripcion", banner.descripcion);
    enviar.append("imagen", imagenFile);

    this.bannerService.guardarBanner(enviar).subscribe({next:response=>{
      Util.successMessage(response.mensaje);
      this.dialogRef.close(response);

    }, error:error=>{
      Util.errorMessage(error.error.mensaje);
    }})
  }

  bytesToImageUrl(bytes: Uint8Array, tipoImagen:string): string {
    return `data:${tipoImagen};base64,${bytes}`;
  }


  base64ToFile(banner:ImagenBanner): File {

    if(banner==null){
      return null;
    }

    let base64: string=this.bytesToImageUrl(banner.imagenBits, banner.tipoArchivo); 
    let filename: string=banner.nombreArchivo;

    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
    u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

}
