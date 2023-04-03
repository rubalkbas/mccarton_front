import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Product } from "../../app.models";
import { AdminService } from '../../_services/admins.service';
import { ImagenBannerService } from 'src/app/_services/imagen-banner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  preguntasFrecuentes:[];
  mostrarCarruzel:boolean=false;

  // public slides = [
  //   { title: 'LA MAYOR VENTA DEL AÑO', subtitle: 'Ofertas especiales HOY', image: 'assets/images/carousel/caja2.jpg' },
  //   { title: 'Colección de Verano', subtitle: 'Nuevos productos en venta', image: 'assets/images/carousel/caja5.jpg' },
  //   { title: 'LA MAYOR VENTA DEL AÑO', subtitle: 'Ofertas especiales HOY', image: 'assets/images/carousel/caja4.jpg' },
  //   { title: 'Colección de Verano', subtitle: 'Nuevos productos en venta', image: 'assets/images/carousel/caja1.png' },
  //   { title: 'LA MAYOR VENTA DEL AÑO', subtitle: 'Ofertas especiales HOY', image: 'assets/images/carousel/caja6.jpg' }
  // ];
  public slides= [];

  public brands = [];
  public banners = [];
  public featuredProducts: Array<Product>;
  public onSaleProducts: Array<Product>;
  public topRatedProducts: Array<Product>;
  public newArrivalsProducts: Array<Product>;


  constructor(public appService:AppService,
    public adminService:AdminService,
    private imagenBannerService: ImagenBannerService
    ) { }

  ngOnInit() {
    this.getBanners();
    this.getProducts("featured");
    this.getBrands();
    this.preguntaFrecuente();
    this.listarBanners();
  }

  public preguntaFrecuente(){
    this.adminService.getAllPreguntasActivas().subscribe(resp=>{
      console.log(resp.response)
      this.preguntasFrecuentes=resp.response;
    }, error=>{console.error(error)});
  }
  public onLinkClick(e){
    this.getProducts(e.tab.textLabel.toLowerCase()); 
  }

  public getProducts(type){
    if(type == "featured" && !this.featuredProducts){
      this.appService.getProducts("featured").subscribe(data=>{
        this.featuredProducts = data;      
      }) 
    }
    if(type == "on sale" && !this.onSaleProducts){
      this.appService.getProducts("on-sale").subscribe(data=>{
        this.onSaleProducts = data;      
      })
    }
    if(type == "top rated" && !this.topRatedProducts){
      this.appService.getProducts("top-rated").subscribe(data=>{
        this.topRatedProducts = data;      
      })
    }
    if(type == "new arrivals" && !this.newArrivalsProducts){
      this.appService.getProducts("new-arrivals").subscribe(data=>{
        this.newArrivalsProducts = data;      
      })
    }
   
  }

  public getBanners(){
    this.appService.getBanners().subscribe(data=>{
      this.banners = data;
    })
  }

  public getBrands(){
    this.brands = this.appService.getBrands();
  }

  public bytesToImageUrl(bytes: Uint8Array, tipoImagen:string): string {
    return `data:${tipoImagen};base64,${bytes}`;
  }


  public listarBanners(){
    this.imagenBannerService.listarBanners().subscribe({
      next: response =>{
        this.slides=[];
        response.response.forEach(data=>{
          this.slides.push(
            { title: data.descripcion, subtitle: data.descripcion, image: this.bytesToImageUrl(data.imagenBits, data.tipoArchivo)}
          )
        })
        this.mostrarCarruzel=true;
        console.log(this.slides);
      }, error:error=>{
        console.error(error);
      }
    })
  }

}
