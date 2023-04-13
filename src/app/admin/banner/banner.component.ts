import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagenBannerService } from 'src/app/_services/imagen-banner.service';
import { ImagenBanner } from 'src/app/models/imagen-banner.model';
import { Util } from 'src/app/util/util';
import { ImagenDialogComponent } from './imagen-dialog/imagen-dialog.component';
import { BannerDialogComponent } from './banner-dialog/banner-dialog.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  bannersArray:ImagenBanner[]=[];
  // bannersArrayActivos:ImagenBanner[]=[];
  verActivos:boolean=false;
  verTodos:boolean=false;

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
      console.log(error);
      Util.errorMessage(error.error.mensaje);
    }})
  }

  eliminarBanner(id:number){
    this.bannerService.eliminarBanner(id).subscribe({next:response=>{
      Util.successMessage(response.mensaje);
      this.listarBanners();

    }, error:error=>{
      Util.errorMessage(error.error.mensaje);
      this.listarBanners();

    }})
  }

  actualizarEstatusBanner(){
    let enviar:FormData;
    this.bannerService.actualizarEstatusBanner(enviar).subscribe({next:response=>{
      Util.successMessage(response.mensaje);
    }, error:error=>{
      Util.errorMessage(error.error.mensaje);
    }})
  }

  mostrarBannersActivos(){
    this.bannerService.mostrarBannersActivos().subscribe({next:response=>{
      this.bannersArray=response.response;
    },error:error=>{
      Util.errorMessage(error.error.mensaje);
    }})
  }

  openBannerDialog(banner:ImagenBanner){
    const dialogRef= this.dialog.open(BannerDialogComponent,{
      width: 'auto',
      height: 'auto',
      data:{
        banner: banner
      }
    })

    dialogRef.afterClosed().subscribe(()=>{
      this.listarBanners();
    })

  }


  bytesToImageUrl(bytes: Uint8Array, tipoImagen:string): string {
    return `data:${tipoImagen};base64,${bytes}`;
  }

  openDialog(imagenBase64) {
    this.dialog.open(ImagenDialogComponent, {
      width: 'auto',
      height: '75%',
      data:{
        imagen:imagenBase64
      }
    });
  }

  deseleccionarOtroCheckbox(checkboxId: string) {
    if (checkboxId === 'checkbox1') {
      this.listarBanners();

      if (this.verActivos) {
        this.verActivos = false;
      }
    } else if (checkboxId === 'checkbox2') {
      this.mostrarBannersActivos();

      if (this.verTodos) {
        this.verTodos = false;
      }
    }
  }
  

}
