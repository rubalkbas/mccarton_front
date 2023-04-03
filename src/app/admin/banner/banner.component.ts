import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagenBannerService } from 'src/app/_services/imagen-banner.service';
import { ImagenBanner } from 'src/app/models/imagen-banner.model';
import { Util } from 'src/app/util/util';
import { ImagenDialogComponent } from './imagen-dialog/imagen-dialog.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  bannersArray:ImagenBanner[]=[];
  bannersArrayActivos:ImagenBanner[]=[];

  public count : 6;
  public page: any;

  constructor(private bannerService:ImagenBannerService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.listarBanners();
  }

  listarBanners(){
    this.bannerService.listarBanners().subscribe({next:response=>{
      this.bannersArray=response.response;
      console.log(this.bannersArray);
    }, error:error=>{
      Util.errorMessage(error.error);
    }})
  }

  guardarBanner(){
    let enviar:FormData;
    this.bannerService.guardarBanner(enviar).subscribe({next:response=>{
      Util.successMessage(response.mensaje);
    }, error:error=>{
      Util.errorMessage(error.error);
    }})
  }

  actualizarBanner(){
    let enviar:FormData;
    this.bannerService.actualizarBanner(enviar).subscribe({next:response=>{
      Util.successMessage(response.mensaje);
    }, error:error=>{
      Util.errorMessage(error.error);
    }})
  }

  eliminarBanner(id:number){
    this.bannerService.eliminarBanner(id).subscribe({next:response=>{
      Util.successMessage(response.mensaje);
    }, error:error=>{
      Util.errorMessage(error.error);
    }})
  }

  actualizarEstatusBanner(){
    let enviar:FormData;
    this.bannerService.actualizarEstatusBanner(enviar).subscribe({next:response=>{
      Util.successMessage(response.mensaje);
    }, error:error=>{
      Util.errorMessage(error.error);
    }})
  }

  mostrarBannersActivos(){
    this.bannerService.mostrarBannersActivos().subscribe({next:response=>{
      this.bannersArrayActivos=response.response;
    },error:error=>{
      Util.errorMessage(error.error);
    }})
  }

  openBannerDialog(banner:ImagenBanner){

  }


  bytesToImageUrl(bytes: Uint8Array, tipoImagen:string): string {
    return `data:${tipoImagen};base64,${bytes}`;
  }

  openDialog(imagenBase64) {
    const dialogRef = this.dialog.open(ImagenDialogComponent, {
      width: 'auto',
      height: 'auto',
      data:{
        imagen:imagenBase64
      }
    });
  }

}
