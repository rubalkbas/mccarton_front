import { Imagen } from 'src/app/models/imagen.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Product } from 'src/app/app.models';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { AdminService } from 'src/app/_services/admins.service';
import { Producto } from 'src/app/models/producto.model';
import { Categorias } from 'src/app/models/categoria.model';
import { Colores } from 'src/app/models/color.model';
import { Materiales } from 'src/app/models/material.model';
import { Util as util } from "src/app/util/util";
import { Buffer } from 'buffer';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('zoomViewer') zoomViewer;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface={};
  public product: Product;
  public producto: Producto;
  public image: any;
  public zoomImage: any;
  private sub: any;
  public form: UntypedFormGroup;
  public show = false;

  constructor(public appService:AppService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, public formBuilder: UntypedFormBuilder, private adminService: AdminService) { }

  ngOnInit(): void {

    this.sub = this.activatedRoute.params.subscribe(params => {  
      if(params['id']){
        this.getProductById(params['id']); 
        this.show = true;
      } else {
        this.show = false;
        util.warningMessage('Debe seleccionar un producto desde la lista de productos.');
      }
    }); 
    this.form = this.formBuilder.group({ 
      'review': [null, Validators.required],            
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])]
    }); 
  }

  ngAfterViewInit(){
    this.config = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 10,      
      keyboard: true,
      navigation: true,
      pagination: false,       
      loop: false, 
      preloadImages: false,
      lazy: true, 
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    }
  }

  public getProductById(id:any){

    const detalleProducto: Producto = {};
    detalleProducto.idProducto = id;

    this.adminService.obtenerProducto(detalleProducto).subscribe({
      next: response => {
        this.producto = response.response;
        
        this.adminService.obtenerImagenesProducto(this.producto).subscribe({
          next: responseImages => {

            let imagenes: Imagen[] = [];
            responseImages.response.forEach(element => {
            
              let imagen: Imagen = {};
            
              imagen.estatus = 1;
              imagen.imagen = `data:image/${element.tipoImagen};base64,${element.imagenBits}`
              imagen.imagenPredeterminado = element.imagenPredeterminado;
              imagen.nombreImagen = element.nombreImagen;
              imagen.tipoImagen = element.tipoImagen;

              imagenes.push(imagen);

            });

            this.producto.imagenes = imagenes;
            this.image = this.producto.imagenes[0].imagen;
            this.zoomImage = this.getDataUrlAsFileUrl(this.producto.imagenes[0].imagen);

            //console.log(this.zoomImage);

            setTimeout(() => {
              this.config.observer = true;
            });
          },
          error: error => {
            util.errorMessage(error.error.mensaje);
          }
        });

      }, error:error => {
        util.errorMessage(error.error.mensaje);
      }

    });

  }

  public selectImage(image){
    this.image = image;
    this.zoomImage = this.getDataUrlAsFileUrl(image);
  }

  getDataUrlAsFileUrl(dataUrl: String) {
    const base64 = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    return url;
  }
  

  public onMouseMove(e){
    if(window.innerWidth >= 1280){
      var image, offsetX, offsetY, x, y, zoomer;
      image = e.currentTarget; 
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      x = offsetX/image.offsetWidth*100;
      y = offsetY/image.offsetHeight*100;
      zoomer = this.zoomViewer.nativeElement.children[0];
      if(zoomer){
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
        zoomer.style.display = "block";
        zoomer.style.height = image.height + 'px';
        zoomer.style.width = image.width + 'px';
      }
    }
  }

  public onMouseLeave(event){
    this.zoomViewer.nativeElement.children[0].style.display = "none";
  }

  public openZoomViewer(){
    this.dialog.open(ProductZoomComponent, {
      data: this.zoomImage,
      panelClass: 'zoom-dialog'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 
  
  public onSubmit(){ 
    if(this.form.valid){
      //console.log(this.form.value);
    }
  }

}
