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

    const detalleProducto: Producto = {
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

    this.adminService.obtenerProducto(detalleProducto).subscribe({
      next: response => {
        this.producto = response.response;
        this.image = 'assets/images/carousel/caja6.jpg';
        this.zoomImage = 'assets/images/carousel/caja6.jpg';
        // this.image = response.images[0].medium;
        // this.zoomImage = response.images[0].big;
        setTimeout(() => { 
          this.config.observer = true;
         // this.directiveRef.setIndex(0);
        });
      }, error:error => {
        util.errorMessage(error.error.mensaje);
      }

    });

    // this.appService.getProductById(id).subscribe(data=>{
    //   this.product = data;
    //   this.image = data.images[0].medium;
    //   this.zoomImage = data.images[0].big;
    //   setTimeout(() => { 
    //     this.config.observer = true;
    //    // this.directiveRef.setIndex(0);
    //   });
    // });
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 
  
  public onSubmit(){ 
    if(this.form.valid){
      console.log(this.form.value);
    }
  }

}
