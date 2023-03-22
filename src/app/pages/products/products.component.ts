import { Categorias } from 'src/app/models/categoria.model';
import { Component, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../../shared/products-carousel/product-dialog/product-dialog.component';
import { AppService } from '../../app.service';
import { Product, Category } from "../../app.models";
import { Settings, AppSettings } from 'src/app/app.settings';
import { isPlatformBrowser } from '@angular/common';
import { AdminService } from 'src/app/_services/admins.service';
import { Util as util } from "src/app/util/util";
import { Producto } from 'src/app/models/producto.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen:boolean = true;
  private sub: any;
  public categorias: Categorias[] = [];
  public selectionCategoria = new SelectionModel<Categorias>(true, []);
  public productos: Producto[] = [];
  public productosFiltrados: Producto[] = [];
  public productosMostrar: Producto[] = [];
  public categoriaSeleccionada = {};
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [12, 24, 36];
  public count:any;
  public imagen: any;
  public sortings = ['Ordenar por defecto', 'Best match', 'Lowest first', 'Highest first'];
  public sort:any;
  public products: Array<Product> = [];
  public categories:Category[];
  public brands = [];
  public priceFrom: number = 750;
  public priceTo: number = 1599;
  public colors = [
    { name: "#5C6BC0", selected: false },
    { name: "#66BB6A", selected: false },
    { name: "#EF5350", selected: false },
    { name: "#BA68C8", selected: false },
    { name: "#FF4081", selected: false },
    { name: "#9575CD", selected: false },
    { name: "#90CAF9", selected: false },
    { name: "#B2DFDB", selected: false },
    { name: "#DCE775", selected: false },
    { name: "#FFD740", selected: false },
    { name: "#00E676", selected: false },
    { name: "#FBC02D", selected: false },
    { name: "#FF7043", selected: false },
    { name: "#F5F5F5", selected: false },
    { name: "#696969", selected: false }
  ];
  public sizes = [
    { name: "S", selected: false },
    { name: "M", selected: false },
    { name: "L", selected: false },
    { name: "XL", selected: false },
    // { name: "2XL", selected: false },
    // { name: "32", selected: false },
    // { name: "36", selected: false },
    // { name: "38", selected: false },
    // { name: "46", selected: false },
    // { name: "52", selected: false },
    // { name: "13.3\"", selected: false },
    // { name: "15.4\"", selected: false },
    // { name: "17\"", selected: false },
    // { name: "21\"", selected: false },
    // { name: "23.4\"", selected: false }
  ]; 
  public page:any;
  public settings: Settings;
  categoriasSeleccionadas: Categorias[] = [];
  constructor(public appSettings:AppSettings, 
              private activatedRoute: ActivatedRoute, 
              public appService:AppService, 
              public dialog: MatDialog, 
              private router: Router,
              private adminService: AdminService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.imagen = 'assets/images/carousel/caja6.jpg';
    this.getProductosActivos();
    this.getCategorias();
    this.count = this.counts[0];
    this.sort = this.sortings[0];
    this.sub = this.activatedRoute.params.subscribe(params => {
      //console.log(params['name']);
    });
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
    if(window.innerWidth < 1280){
      this.viewCol = 33.3;
    };

    // this.getCategories();
    // this.getBrands();
    // this.getAllProducts();   
  }

  public getProductosActivos(){
    this.adminService.listarProductosActivos().subscribe({
      next: (data) => {
        this.productos = data.response;
        this.productosMostrar = this.productos;
      },
      error: () => {
        util.errorMessage("Error interno del servidor");
      }
    });
  }

  public getAllProducts(){
    this.appService.getProducts("featured").subscribe(data=>{
      this.products = data; 
      //for show more product  
      for (var index = 0; index < 3; index++) {
        this.products = this.products.concat(this.products);        
      }
    });
  }

  public filtrarProductos(){

    this.productosFiltrados = this.productos.filter(producto => {
      return this.selectionCategoria.selected.some(categoria => categoria.idCategorias == producto.categoria.idCategorias);
    });

    if(this.selectionCategoria.selected.length === 0 && this.productos.length > 0){
      this.productosMostrar = this.productos;
    } else {
      this.productosMostrar = this.productosFiltrados;
    }

  }

  public selectCategoria(event: MatCheckboxChange, categoria: Categorias) {
    if (event.checked) {
      this.selectionCategoria.select(categoria);
    } else {
      this.selectionCategoria.deselect(categoria);
    }
    this.filtrarProductos();
  }

  // public getCategories(){  
  //   if(this.appService.Data.categories.length == 0) { 
  //     this.appService.getCategories().subscribe(data => {
  //       this.categories = data;
  //       this.appService.Data.categories = data;
  //     });
  //   }
  //   else{
  //     this.categories = this.appService.Data.categories;
  //   }
  // }

  // public getBrands(){
  //   this.brands = this.appService.getBrands();
  //   this.brands.forEach(brand => { brand.selected = false });
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }

  public changeCount(count){
    this.count = count;
    this.getAllProducts(); 
  }

  public changeSorting(sort){
    this.sort = sort;
  }

  public changeViewType(viewType, viewCol){
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product){   
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog',
        direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/products', product.id, product.name]); 
      }
    });
  }

  public onPageChanged(event){
    this.page = event;
    this.getAllProducts(); 
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0,0);
    } 
  }

  public getCategorias(){
  
    this.adminService.getAllCategorias().subscribe(
    {
      next: (data) => {
        this.categorias = data.response;
      },
      error: (err) => {
        util.errorMessage(err.error);
      }
    }
    );
    
  }

  public onChangeCategory(event){
    if(event.target){
      this.router.navigate(['/products', event.target.innerText.toLowerCase()]); 
    }   
  }

}
