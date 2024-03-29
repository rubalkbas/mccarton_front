import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../app.service';
import { Product } from "../../../app.models";
import { emailValidator } from '../../../theme/utils/app-validators';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { AdminService } from 'src/app/_services/admins.service';
import { Producto } from 'src/app/models/producto.model';
import { Categorias } from 'src/app/models/categoria.model';
import { Colores } from 'src/app/models/color.model';
import { Materiales } from 'src/app/models/material.model';
import { Util as util } from "src/app/util/util";
import { Location } from '@angular/common';
import { Imagen } from '../../../models/imagen.model';
import { Buffer } from 'buffer';
import { CarroService } from '../../../_services/carro.service';
import { MatSelectChange } from '@angular/material/select';
import Swal from 'sweetalert2';
import { V } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  public product: Product;
  public producto: Producto;
  public image: any;
  public zoomImage: any;

  private sub: any;
  public form: UntypedFormGroup;
  public relatedProducts: Array<Product>;
  selectedImage: string;
  // seleccion:string = "1"
  public masCantidades:boolean;
  public cantidad: string = "1";
  public cantidadInput:string = ""
  constructor(public appService: AppService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public formBuilder: UntypedFormBuilder,
    private location: Location,
    public carroService:CarroService,
    private adminService: AdminService) { }


    //Mostrar cajas
    public mostrarCaja1: boolean=false;
    public mostrarCaja2: boolean=false;
    public mostrarCaja3: boolean=false;
    public mostrarCaja4: boolean=false;
    public mostrarCaja5: boolean=false;
    public mostrarCaja6: boolean=false;
    public mostrarCaja7: boolean=false;
    public mostrarCaja8: boolean=false;
    public mostrarCaja9: boolean=false;
    public mostrarCaja10: boolean=false;

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.getProductById(params['id']); 
    });

    this.form = this.formBuilder.group({
      'review': [null, Validators.required],
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])]
    });


  }

  ngAfterViewInit() {
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
  public onMouseMove(e) {
    if (window.innerWidth >= 1280) {
      var image, offsetX, offsetY, x, y, zoomer;
      image = e.currentTarget;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      x = offsetX / image.offsetWidth * 100;
      y = offsetY / image.offsetHeight * 100;
      zoomer = this.zoomViewer.nativeElement.children[0];
      if (zoomer) {
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
        zoomer.style.display = "block";
        zoomer.style.height = image.height + 'px';
        zoomer.style.width = image.width + 'px';
      }
    }
  }

  checarInput(evento){
    if(evento === ""){
      Swal.fire('','Ingresa una cantidad valida','warning')
    }
    this.carroService.unidadProductos = evento;    
  }

  cambioUnidad(){            
    this.carroService.unidadProductos = this.cantidad;
  }
  public onMouseLeave(event) {
    this.zoomViewer.nativeElement.children[0].style.display = "none";
  }

  public openZoomViewer() {
    this.dialog.open(ProductZoomComponent, {
      data: this.zoomImage,
      panelClass: 'zoom-dialog'
    });
  }

  public getProductById(id: any) {

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
            this.zoomImage = this.getDataUrlAsFileUrl(this.producto.imagenes[0].imagen.toString());

            this.mostrarCajas(this.producto.nombreProducto);
            //console.log(this.zoomImage);

            setTimeout(() => {
              this.config.observer = true;
            });
          },
          error: error => {
            util.errorMessage(error.error.mensaje);
          }
        });

      }, error: error => {
        util.errorMessage(error.error.mensaje);
      }

    });

  }

  public selectImage(image) {
    this.image = image;
    this.zoomImage = this.getDataUrlAsFileUrl(image);
  }
  getDataUrlAsFileUrl(dataUrl: string) {
    const base64 = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    return url;
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onSubmit(values: Object): void {
    if (this.form.valid) {
      //email sent
    }
  }

  mostrarCajas(nombreCaja:string){

    if(nombreCaja=="Caja 1"){
      this.mostrarCaja1 = true;
    }
    if(nombreCaja=="Caja 2"){
      this.mostrarCaja2 = true;
    }
    if(nombreCaja=="Caja 3"){
      this.mostrarCaja3 = true;
    }
    if(nombreCaja=="Caja 4"){
      this.mostrarCaja4 = true;
    }
    if(nombreCaja=="Caja 5"){
      this.mostrarCaja5 = true;
    }
    if(nombreCaja=="Caja 6"){
      this.mostrarCaja6 = true;
    }
    if(nombreCaja=="Caja 7"){
      this.mostrarCaja7 = true;
    }
    if(nombreCaja=="Caja 8"){
      this.mostrarCaja8 = true;
    }
    if(nombreCaja=="Caja 9"){
      this.mostrarCaja9 = true;
    }
    if(nombreCaja=="Caja 10"){
      this.mostrarCaja10 = true;
    }
  }

}
