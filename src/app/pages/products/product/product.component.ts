import { Component, OnInit, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface={};
  public product: Product;
  public producto: Producto;
  public image: any;
  public zoomImage: any;
  
  private sub: any;
  public form: UntypedFormGroup;
  public relatedProducts: Array<Product>;
  selectedImage: string;
  
  constructor(public appService:AppService, 
    private activatedRoute: ActivatedRoute, 
    public dialog: MatDialog, 
    public formBuilder: UntypedFormBuilder,
    private location: Location,
    private adminService: AdminService) {  }

  ngOnInit() {      
    this.sub = this.activatedRoute.params.subscribe(params => { 
      this.getProductById(params['id']); 
      this.getProductoById(params['id']);
    }); 

    this.form = this.formBuilder.group({ 
      'review': [null, Validators.required],            
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])]
    }); 
    this.getRelatedProducts();    
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

  public getProductById(id){
    this.appService.getProductById(id).subscribe(data=>{
      this.product = data;
      this.image = data.images[0].medium;
      this.zoomImage = data.images[0].big;
      setTimeout(() => { 
        this.config.observer = true;
       // this.directiveRef.setIndex(0);
      });
    });
  }

  public getRelatedProducts(){
    this.appService.getProducts('related').subscribe(data => {
      this.relatedProducts = data;
    })
  }

  public selectImage(image){
    this.image = image.medium;
    this.zoomImage = image.big;
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

  public getProductoById(id:any){
    const producto: Producto = {
      idProducto: id,
      codigoReferencia: '',
      nombreProducto: '',
      descripcionBreve: '',
      largoInterior: 0,
      largoExterior: 0,
      anchoInterior: 0,
      anchoExterior: 0,
      altoInterior: 0,
      altoExterior: 0,
      stock: 0,
      precioCompra: 0,
      precioVenta: 0,
      fechaAlta: undefined,
      fechaModificacion: undefined,
      peso: 0,
      material: new Materiales,
      color: new Colores,
      categoria: new Categorias
    };
    this.adminService.obtenerProducto(producto).subscribe({
      next: (data: any) => {
        this.producto = data.response;
        setTimeout(() => { 
          this.config.observer = true;
         // this.directiveRef.setIndex(0);
        });

        // Obtiene las imágenes del producto
        this.obtenerImagenesProducto(this.producto);

      },
      error: (error: any) => {
        util.errorMessage(error.error.message);
      }

    })
  }

  private obtenerImagenesProducto(producto: Producto) {
    this.adminService.obtenerImagenesProducto(producto).subscribe({
      next: response => {
        console.log(response);
        let imagenes: Imagen[] = [];
        response.response.forEach(element => {
        
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

        //console.log(this.zoomImage);

        setTimeout(() => {
          this.config.observer = true;
        });
      },
      error: error => {
        util.errorMessage(error.error.mensaje);
      }
    });
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

  public onSubmit(values:Object):void {
    if (this.form.valid) {
      //email sent
    }
  }

}
