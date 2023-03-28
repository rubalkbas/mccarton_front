import { AdminService } from "./../../../_services/admins.service";
import { Component, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { AppService } from "src/app/app.service";
import { Category } from "src/app/app.models";
import { ActivatedRoute } from "@angular/router";
import { Util as util } from "src/app/util/util";
import { Colores } from "src/app/models/color.model";
import { Producto } from "src/app/models/producto.model";
import { Materiales } from "src/app/models/material.model";
import { Categorias } from "src/app/models/categoria.model";
import { Imagen } from "src/app/models/imagen.model";
import { Buffer } from "buffer";
import { ImagenResponse } from "src/app/models/imagen-response.model";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent implements OnInit {
  public form: UntypedFormGroup;
  public colors = [
    "#5C6BC0",
    "#66BB6A",
    "#EF5350",
    "#BA68C8",
    "#FF4081",
    "#9575CD",
    "#90CAF9",
    "#B2DFDB",
    "#DCE775",
    "#FFD740",
    "#00E676",
    "#FBC02D",
    "#FF7043",
    "#F5F5F5",
    "#696969",
  ];
  public colores: Colores[] = [];
  public materiales: Materiales[] = [];
  public categorias: Categorias[] = [];
  public imagenes: Imagen[] = [];
  public imagenesResponse: ImagenResponse[] = [];
  public imagenesEliminadas: ImagenResponse[] = [];
  public imagenesAgregadas: ImagenResponse[] = [];
  public sizes = [
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "32",
    "36",
    "38",
    "46",
    "52",
    '13.3"',
    '15.4"',
    '17"',
    '21"',
    '23.4"',
  ];
  public selectedColors: string;
  public categories: Category[];
  private sub: any;
  public id = 0;
  charsWritten = 0;
  maxChars = 150;

  constructor(
    public appService: AppService,
    public formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getCategorias();
    this.getColores();
    this.getMateriales();
    this.form = this.formBuilder.group({
      name: [
        null,
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
      images: null,
      precio_compra: [null, Validators.required],
      precio_venta: [null, Validators.required],
      referencia: [null, Validators.required],
      description: null,
      stock: null,
      color: null,
      // "size": null,
      material: null,
      weight: null,
      categoryId: [null, Validators.required],
      alto_exterior: null,
      alto_interior: null,
      ancho_exterior: null,
      ancho_interior: null,
      largo_exterior: null,
      largo_interior: null,
    });

    this.getCategories();
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.id = Number(params["id"]);
        this.getProductById();
      }
    });
  }

  public getColores() {
    this.adminService.listarColoresActivos().subscribe({
      next: (response) => {
        this.colores = response.response;
      },
      error: (error) => {
        util.errorMessage(error.error.mensaje);
      },
    });
  }

  updateCharsCount(text: string) {
    this.charsWritten = text.length;
  }

  public getMateriales() {
    this.adminService.listarMaterialesActivos().subscribe({
      next: (response) => {
        this.materiales = response.response;
      },
      error: (error) => {
        util.errorMessage(error.error.mensaje);
      },
    });
  }

  public getCategorias() {
    this.adminService.getCategoriasActivas().subscribe({
      next: (data) => {
        this.categorias = data.response;
      },
      error: (err) => {
        util.errorMessage(err.error);
      },
    });
  }

  public getCategories() {
    this.appService.getCategories().subscribe((data) => {
      this.categories = data;
      this.categories.shift();
    });
  }

  public getProductById() {
    const detalleProducto: Producto = {};
    detalleProducto.idProducto = this.id;

    this.adminService.obtenerProducto(detalleProducto).subscribe({
      next: (response) => {
        this.adminService.obtenerImagenesProducto(detalleProducto).subscribe({
          next: (responseImagenes) => {
            this.imagenesResponse = responseImagenes.response;
            this.charsWritten = response.response.descripcionBreve.length;
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
              largo_interior: response.response.largoInterior,
            });

            const images: any[] = [];
            this.imagenesResponse.forEach((item: any) => {

              let img: Imagen = {};
              img.nombreImagen = item.nombreImagen;
              img.estatus = item.estatus;
              img.imagenPredeterminado = item.imagenPredeterminado;
              img.tipoImagen = item.tipoImagen;
              img.imagen = item.imagenBits;
              this.imagenes.push(img);

              
              let imagen = {
                link: `data:image/${item.tipoImagen};base64,${item.imagenBits}`,
                preview: `data:image/${item.tipoImagen};base64,${item.imagenBits}`,
                id: item.idImagen,
                nombre: item.nombreImagen,
                tipo: item.tipoImagen,

              };
              
              images.push(imagen);
            });

            this.form.controls.images.setValue(images);
          },
          error: (error) => {
            util.errorMessage(error.error.mensaje);
          },
        });
      },
      error: (error) => {
        util.errorMessage(error.error.mensaje);
      },
    });
  }

  getDataUrlAsFileUrl(dataUrl: String) {
    const base64 = dataUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");
    const blob = new Blob([buffer], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  handleImageRemoved(event: any) {

    if (event.link) {

      let imagen: Imagen = {};
      imagen.nombreImagen = event.nombre;
      imagen.tipoImagen = event.tipo;
      imagen.imagen = event.link.split(",")[1];
      imagen.estatus = 1;
      imagen.imagenPredeterminado = 0;

      //Eliminamos imagen de la lista de imagenes

      const index = this.imagenes.findIndex(
        (imagen) => imagen.imagen === event.link.split(",")[1]
      );
      if (index >= 0) {
        this.imagenes.splice(index, 1);
      }

      let imagenResponse: ImagenResponse = {};
      imagenResponse.idImagen = event.id;
      imagenResponse.nombreImagen = event.nombre;
      imagenResponse.tipoImagen = event.tipo;
      imagenResponse.imagenBits = event.link.split(",")[1];
      imagenResponse.estatus = 1;
      imagenResponse.imagenPredeterminado = 0;

      this.imagenesEliminadas.push(imagenResponse);

    } else {
      const reader = new FileReader();
      let deletedBase64: any;
      reader.readAsDataURL(event.file);
      reader.onload = (r: any) => {
        deletedBase64 = r.target.result.substring(
          r.target.result.indexOf(",") + 1
        );
        const index = this.imagenes.findIndex(
          (imagen) => imagen.imagen === deletedBase64
        );
        if (index >= 0) {
          this.imagenes.splice(index, 1);
        }
      };
    }

  }


  handleFileInput() {
    this.imagenes = [];

    const imagesControl = this.form.value.images;
    let images: Imagen[] = [];
    
    if (imagesControl.length > 0) {
      imagesControl.forEach((item: any) => {

        if(item.link){
          const imagen: Imagen = {
            imagen: item.link.substring(
              item.link.indexOf(",") + 1
            ),
            nombreImagen: item.nombre,
            tipoImagen: item.tipo,
            estatus: 1,
            imagenPredeterminado: 0,
          };

          images.push(imagen);
          return;
        } else {

          const reader = new FileReader();
          reader.readAsDataURL(item.file);
          reader.onload = (event: any) => {
            const imagen: Imagen = {
              imagen: event.target.result.substring(
                event.target.result.indexOf(",") + 1
              ),
              nombreImagen: item.file.name,
              tipoImagen: item.file.type.split("/").pop() || "",
              estatus: 1,
              imagenPredeterminado: 0,
            };
            
            const imagenResponse : ImagenResponse = {};
            imagenResponse.estatus = 1;
            imagenResponse.idImagen = 0;
            imagenResponse.idProducto = new Producto();
            imagenResponse.imagenBits = event.target.result.substring(
              event.target.result.indexOf(",") + 1
            );
            imagenResponse.imagenPredeterminado = 0;
            imagenResponse.nombreImagen = item.file.name;
            imagenResponse.tipoImagen = item.file.type.split("/").pop() || "";
            this.imagenesAgregadas.push(imagenResponse);

            images.push(imagen);
          };
        }

      });

      this.imagenes = images;
    
    }

  }

  public handleImageRejected(event: any) {
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    const file = event.file;

    if (!allowedFormats.includes(file.type)) {
      util.warningMessage(
        "Solo se permiten imágenes con formato jpg, jpeg o png"
      );
      return;
    }

    if (file.size > 1000000) {
      util.warningMessage("Solo se permiten imágenes de 1MB");
      return;
    }

    util.warningMessage("No se pudo cargar la imagen");

  }

  public nuevasImagenes() {
    // Revisamos si hay imágenes nuevas y diferentes a las que ya existen

    let imagenesNuevas: Imagen[] = [];

    this.imagenes.forEach((imagen) => {
      let imagenNva: Imagen = {};
      imagenNva.imagen = imagen.imagen;
      imagenNva.nombreImagen = imagen.nombreImagen;
      imagenNva.tipoImagen = imagen.tipoImagen;
      imagenNva.estatus = imagen.estatus;
      imagenNva.imagenPredeterminado = imagen.imagenPredeterminado;

      imagenesNuevas.push(imagenNva);
    });

  }

  public onSubmit() {
    const color: Colores = this.colores.find(
      (x) => x.idColor == this.form.value.color
    );
    const material: Materiales = this.materiales.find(
      (x) => x.idMaterial == this.form.value.material
    );
    const categoria: Categorias = this.categorias.find(
      (x) => x.idCategorias == this.form.value.categoryId
    );

    if (this.form.valid) {
      const producto: Producto = {};
        producto.idProducto = this.id;
        producto.codigoReferencia= this.form.value.referencia;
        producto.nombreProducto= this.form.value.name;
        producto.descripcionBreve= this.form.value.description;
        producto.largoInterior= this.form.value.largo_interior;
        producto.largoExterior= this.form.value.largo_exterior;
        producto.anchoInterior= this.form.value.ancho_interior;
        producto.anchoExterior= this.form.value.ancho_exterior;
        producto.altoInterior = this.form.value.alto_interior;
        producto.altoExterior = this.form.value.alto_exterior;
        producto.stock = this.form.value.stock;
        producto.precioCompra = this.form.value.precio_compra;
        producto.precioVenta = this.form.value.precio_venta;
        producto.fechaAlta = new Date();
        producto.fechaModificacion = new Date();
        producto.peso = this.form.value.weight;
        producto.material = material;
        producto.color = color;
        producto.categoria = categoria;
        producto.estatus = 1;

      if (this.id !== 0) {

        //this.adminService.eliminarImagenes()

        this.agregarImagenes();
        this.eliminarImagenes();

        this.adminService.actualizarProducto(producto).subscribe({
          next: (response) => {
            util.successMessage(response.mensaje);
            //this.form.reset();
          },
          error: (error) => {
            util.errorMessage(error.error.mensaje);
          },
        });
      } else {
        //console.log(producto);
        producto.imagenes = this.imagenes;
        this.adminService.crearProducto(producto).subscribe({
          next: (response) => {
            //console.log(response);
            util.successMessage(response.mensaje);
            this.form.reset();
          },
          error: (error) => {
            util.errorMessage(error.error.mensaje);
          },
        });
      }
    }
  }

  public eliminarImagenes() {

    this.imagenesEliminadas.forEach((imagen) => {

      this.adminService.eliminarImagenes(imagen).subscribe({
        next: (response) => {
          console.log(response.mensaje);
        },
        error: (error) => {
          console.log(error.error.mensaje);
        },
      });

    });

  }

  public agregarImagenes() {
    
    this.adminService.agregarImagenesProducto(this.generarProducto()).subscribe({
      next: (response) => {
        console.log(response.mensaje);
      }
    });

  }

  public generarProducto(): Producto {

    let imagenes: Imagen[] = [];
    let producto: Producto = {};


    this.imagenesAgregadas.forEach((imagenResponse: ImagenResponse) => {

      let imagen: Imagen = {};
      
      imagen.nombreImagen = imagenResponse.nombreImagen;
      imagen.tipoImagen = imagenResponse.tipoImagen;
      imagen.imagen = imagenResponse.imagenBits;
      imagen.imagenPredeterminado = imagenResponse.imagenPredeterminado;
      imagen.estatus = imagenResponse.estatus;
      
      imagenes.push(imagen);

    });

    producto.idProducto = this.id;
    producto.imagenes = imagenes;

    console.log(producto);

    return producto;

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
