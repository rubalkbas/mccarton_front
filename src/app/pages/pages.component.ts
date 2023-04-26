import { Component, OnInit, HostListener, ViewChild, Inject, PLATFORM_ID } from '@angular/core'; 
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../app.settings';
import { AppService } from '../app.service';
import { Category } from '../app.models';
import { SidenavMenuService } from '../theme/components/sidenav-menu/sidenav-menu.service';
import { isPlatformBrowser } from '@angular/common';
import { AdminService } from '../_services/admins.service';
import { CarroCompras } from '../models/carro-compras.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [ SidenavMenuService ]
})
export class PagesComponent implements OnInit {
  public showBackToTop:boolean = false; 
  public categories:Category[];
  public category:Category;
  public sidenavMenuItems:Array<any>;


  imagenesProductos: { [idProducto: string]: string } = {};
  carritos: CarroCompras[] = [];
  totalProductos: number;
  totalPrecio: number = 0;




  @ViewChild('sidenav', { static: true }) sidenav:any;

  public settings: Settings;
  constructor(public appSettings:AppSettings, 
              public appService:AppService, 
              public sidenavMenuService:SidenavMenuService,
              public router:Router,
              public adminService:AdminService,
              @Inject(PLATFORM_ID) private platformId: Object) { 
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.getCategories();
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
    setTimeout(() => {
      this.settings.theme = 'green'; 
    });
    setInterval(()=>{
      this.listarCarrito();
    },1200)
    this.listarCarrito();
    
  } 

  listarCarrito() {
    // this.cargando = true;
    const idCliente = parseInt(localStorage.getItem('cliente'));
    this.adminService.listarCarrito(idCliente).subscribe((data: any) => {
      // console.log(data)
      if (data.response === null) {
        this.totalProductos = 0;
        
        this.carritos = [];
        return;
      }
      this.carritos = data.response.carrito;
      this.totalProductos = this.carritos.length;
      console.log(this.totalProductos)
      this.carritos.forEach(carrito => {
        // console.log(carrito.subtotal);
        this.totalPrecio = data.response.totalEstimado;      
        this.adminService.obtenerImagenesProducto(carrito.producto).subscribe({
          next: data => {
            // console.log(data)
            //Obtener el ultmo elemento de un arreglo
            const imagen = data.response[data.response.length - 1];
            this.imagenesProductos[carrito.producto.idProducto] = `data:image/${imagen.tipoImagen};base64,${imagen.imagenBits}`;
            // this.cargando = false;
          }
        })
      })
    })
  } 


  public getCategories(){    
    this.appService.getCategories().subscribe(data => {
      this.categories = data;
      this.category = data[0];
      this.appService.Data.categories = data;
    })
  }

  public changeCategory(event){
    if(event.target){
      this.category = this.categories.filter(category => category.name == event.target.innerText)[0];
    }
    if(window.innerWidth < 960){
      this.stopClickPropagate(event);
    } 
  }

  public eliminar(producto) {
    console.log(producto)
    this.adminService.eliminarProducto(producto.idCarroCompra).subscribe({
      next: (data: any) => {
        console.log(data)
        Swal.fire('', data.mensaje, 'success')
        this.listarCarrito()
      },
      error: data => {
        this.listarCarrito()

        Swal.fire('', data.mensaje, 'error');
      }
    })

      // const index: number = this.appService.Data.cartList.indexOf(product);
      // if (index !== -1) {
      //     this.appService.Data.cartList.splice(index, 1);
      //     this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.newPrice*product.cartCount;
      //     this.appService.Data.totalCartCount = this.appService.Data.totalCartCount - product.cartCount;
      //     this.appService.resetProductCartCount(product);
      // }        
  }

  public clear(){
    let ultimo = 0
    const ultimaPosicion = this.carritos.length - 1; 
    this.carritos.forEach(data => {
      this.adminService.eliminarProducto(data.idCarroCompra).subscribe({
        next: (data: any) => {
          
          
          // console.log(data)
                    
        },
        error: data => {
          this.listarCarrito()
  
          Swal.fire('', data.mensaje, 'error');
        }
      })
    });
    if(ultimaPosicion){
      Swal.fire('', 'Se elimino el carro por completo', 'success')
      this.listarCarrito()

    }     
    // this.appService.Data.cartList.forEach(product=>{
    //   this.appService.resetProductCartCount(product);
    // });
    // this.appService.Data.cartList.length = 0;
    // this.appService.Data.totalPrice = 0;
    // this.appService.Data.totalCartCount = 0;
  }
 

  public changeTheme(theme){
    this.settings.theme = theme;       
  }

  public stopClickPropagate(event: any){
    event.stopPropagation();
    event.preventDefault();
  }

  public search(){}

 
  public scrollToTop(){
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset  / (scrollDuration / 20);
    var scrollInterval = setInterval(()=>{
      if(window.pageYOffset != 0){
         window.scrollBy(0, scrollStep);
      }
      else{
        clearInterval(scrollInterval); 
      }
    },10);
    if(window.innerWidth <= 768){
      setTimeout(() => { 
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0,0);
        }  
      });
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);   
    let header_toolbar = document.getElementById('header-toolbar');
    if(header_toolbar){ 
      if(scrollTop >= header_toolbar.clientHeight) {
        this.settings.mainToolbarFixed = true;
      }
      else{
        if(!document.documentElement.classList.contains('cdk-global-scrollblock')){
          this.settings.mainToolbarFixed = false;
        }        
      } 
    } 
    else{
      this.settings.mainToolbarFixed = true;
    }  
    ($event.target.documentElement.scrollTop > 120) ? this.showBackToTop = true : this.showBackToTop = false;  
  }

  ngAfterViewInit(){

  }

  // public closeSubMenus(){
  //   if(window.innerWidth < 960){
  //     this.sidenavMenuService.closeAllSubMenus();
  //   }    
  // }

}