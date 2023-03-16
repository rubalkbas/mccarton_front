import { AdminService } from './../../../_services/admins.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Category } from 'src/app/app.models';
import { ActivatedRoute } from '@angular/router';
import { Util as util } from "src/app/util/util";
import { Colores } from 'src/app/models/color.model';
import { Producto } from 'src/app/models/producto.model';
import { Materiales } from 'src/app/models/material.model';
import { Categorias } from 'src/app/models/categoria.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  public form: UntypedFormGroup;
  public colors = ["#5C6BC0","#66BB6A","#EF5350","#BA68C8","#FF4081","#9575CD","#90CAF9","#B2DFDB","#DCE775","#FFD740","#00E676","#FBC02D","#FF7043","#F5F5F5","#696969"];
  public colores: Colores[] = [];
  public materiales: Materiales[] = [];
  public categorias: Categorias[] = [
    { idCategorias: 1, 
      descripcionCategoria: "Categoria 1", 
      nombreCategoria: "nombre categoria", 
      detallesCategoria: "Categoria 1", 
      codigoReferencia: "123", 
      idCategoriaPadre: 1},
  ];
  
  public sizes = ["S","M","L","XL","2XL","32", "36","38","46","52","13.3\"","15.4\"","17\"","21\"","23.4\""]; 
  public selectedColors:string;
  public categories:Category[];
  private sub: any;
  public id = 0;
  charsWritten = 0;
  maxChars = 150;

  constructor(public appService:AppService, public formBuilder: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private adminService: AdminService,  ) { }

  ngOnInit(): void {
    this.getColores();
    this.getMateriales();
    this.form = this.formBuilder.group({ 
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'images': null,
      "precio_compra": [null, Validators.required ],
      "precio_venta": [null, Validators.required ],
      "referencia": [null, Validators.required ], 
      "description": null,
      "stock": null, 
      "color": null,
      // "size": null,
      "material": null,
      "weight": null,
      "categoryId": [null, Validators.required ]  ,
      "alto_exterior" : null,
      "alto_interior" : null,
      "ancho_exterior" : null,
      "ancho_interior" : null,
      "largo_exterior" : null,
      "largo_interior" : null
    }); 
    
    this.getCategories();
    this.sub = this.activatedRoute.params.subscribe(params => {  
      if(params['id']){
        this.id = Number(params['id']);
        this.getProductById(); 
      }  
    }); 
  }

  public getColores(){
    this.adminService.listarColoresActivos().subscribe({
      next: response => {
        this.colores = response.response;
      },
      error: error => {
        util.errorMessage(error.error.mensaje);
      }
    });
  }

  updateCharsCount(text: string) {
    this.charsWritten = text.length;
  }

  public getMateriales(){
    this.adminService.listarMaterialesActivos().subscribe({
      next: response => {
        this.materiales = response.response;
      },
      error: error => {
        util.errorMessage(error.error.mensaje);
      }
    });
  }

  public getCategories(){   
    this.appService.getCategories().subscribe(data => {
      this.categories = data; 
      this.categories.shift();
    }); 
  }

  public getProductById(){

    const detalleProducto: Producto = {
      idProducto: this.id,
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
        this.form.patchValue({
          name: response.response.nombreProducto,
          precio_compra: response.response.precioCompra,
          precio_venta: response.response.precioVenta,
          referencia: response.response.codigoReferencia,
          description: response.response.descripcionBreve,
          stock: response.response.stock,
          color: response.response.color.idColor,
          material: response.response.material.idMaterial,
          weight: response.response.peso,
          categoryId: response.response.categoria.idCategorias,
          alto_exterior: response.response.altoExterior,
          alto_interior: response.response.altoInterior,
          ancho_exterior: response.response.anchoExterior,
          ancho_interior: response.response.anchoInterior,
          largo_exterior: response.response.largoExterior,
          largo_interior: response.response.largoInterior
        });
      },
      error: error => {
        util.errorMessage(error.error.mensaje);
      }
    });

    // }(data:any)=>{ 
    //   this.form.patchValue(data); 
    //   this.selectedColors = data.color; 
    //   const images: any[] = [];
    //   data.images.forEach(item=>{
    //     let image = {
    //       link: item.medium,
    //       preview: item.medium
    //     }
    //     images.push(image);
    //   })
    //   this.form.controls.images.setValue(images); 
    // });

  }

  public onSubmit(){

    const color : Colores = this.colores.find(x => x.idColor == this.form.value.color);
    const material : Materiales = this.materiales.find(x => x.idMaterial == this.form.value.material);
    const categoria: Categorias = this.categorias.find(x => x.idCategorias == this.form.value.categoryId);

    if(this.form.valid){

      const producto: Producto = {
        idProducto: this.id,
        codigoReferencia: this.form.value.referencia,
        nombreProducto: this.form.value.name,
        descripcionBreve: this.form.value.description,
        largoInterior: this.form.value.largo_interior,
        largoExterior: this.form.value.largo_exterior,
        anchoInterior: this.form.value.ancho_interior,
        anchoExterior: this.form.value.ancho_exterior,
        altoInterior: this.form.value.alto_interior,
        altoExterior: this.form.value.alto_exterior,
        stock: this.form.value.stock,
        precioCompra: this.form.value.precio_compra,
        precioVenta: this.form.value.precio_venta,
        fechaAlta: new Date(),
        fechaModificacion: new Date(),
        peso: this.form.value.weight,
        material: material,
        color: color,
        categoria: categoria
      }

      if(this.id !== 0){
        this.adminService.actualizarProducto(producto).subscribe({
          next: response => {
            util.successMessage(response.mensaje);
            //this.form.reset();
          },
          error: error => {
            util.errorMessage(error.error.mensaje);
          }
        });
      } else {
        this.adminService.crearProducto(producto).subscribe({
          next: response => {
            util.successMessage(response.mensaje);
            this.form.reset();
          },
          error: error => {
            util.errorMessage(error.error.mensaje);
          }
        });
      }
    }

  }

  // public onColorSelectionChange(event:any){  
  //   if(event.value){
  //     this.selectedColors = event.value.join();
  //   } 
  // }  

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

}
