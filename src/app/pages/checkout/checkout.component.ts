import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatStep, MatStepper } from "@angular/material/stepper";
import { filter, map, Subscription } from "rxjs";
import { AppService } from "../../app.service";
import { AdminService } from "src/app/_services/admins.service";
import { error } from "console";
import { Direccion } from "src/app/models/direccion.model";
import { CarroCompras } from "src/app/models/carro-compras.model";
import { OrdenesService } from "src/app/_services/ordenes.service";
import { CrearOrdenRequest } from "src/app/models/ordenes.model";
import { Util } from "src/app/util/util";

const IVA:number=0.16;

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild("horizontalStepper") horizontalStepper: MatStepper;

  @ViewChild('paymentStep') paymentStep: MatStep;


  stepperOrientation: "horizontal" | "vertical" = "horizontal";
  billingForm: UntypedFormGroup;
  deliveryForm: UntypedFormGroup;
  paymentForm: UntypedFormGroup;
  metodoPago: UntypedFormGroup;

  countries = [];
  months = [];
  years = [];
  deliveryMethods = [];
  grandTotal = 0;
  watcher: Subscription;

  idCliente:number;
  panelOpenState = false;

  direcciones:Direccion[]=[]

  seleccion:any;

  carritos:CarroCompras[] = [];
  totalProcuctos:number;
  totalPrecio:number = 0;
  imagenesProductos: {[idProducto: string]: string} = {};
  totalProductos:number=0;

  revisionOrden:boolean=false;




  constructor(
    public appService: AppService,
    public formBuilder: UntypedFormBuilder,
    public mediaObserver: MediaObserver,
    private adminService:AdminService,
    private ordenesServices:OrdenesService
  ) {
    this.watcher = mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        if (change.mqAlias == "xs") {
          this.stepperOrientation = "vertical";
        } else if (change.mqAlias == "sm") {
          this.stepperOrientation = "vertical";
        } else if (change.mqAlias == "md") {
          this.stepperOrientation = "horizontal";
        } else {
          this.stepperOrientation = "horizontal";
        }
      });
  }

  ngOnInit() {
    this.idCliente = parseInt(localStorage.getItem('cliente'), 10);

    this.appService.Data.cartList.forEach((product) => {
      this.grandTotal += product.cartCount * product.newPrice;
    });
    this.countries = this.appService.getCountries();
    this.months = this.appService.getMonths();
    this.years = this.appService.getYears();
    this.deliveryMethods = this.appService.getDeliveryMethods();
    
    this.billingForm = this.formBuilder.group({
      idDireccion: ["", Validators.required],
    });
    this.deliveryForm = this.formBuilder.group({
      deliveryMethod: [this.deliveryMethods[0], Validators.required],
    });
    this.paymentForm = this.formBuilder.group({
      cardHolderName: ["", Validators.required],
      cardNumber: ["", Validators.required],
      expiredMonth: ["", Validators.required],
      expiredYear: ["", Validators.required],
      cvv: ["", Validators.required],
    });

    this.metodoPago= this.formBuilder.group({
      metodoDePago:["", Validators.required]
    })

  }

  ngAfterViewInit(): void {
    this.consultarDirecciones();
    this.listarCarrito();

  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  public realizarOrden() {

    if(this.carritos.length==0){
      Util.errorMessage("Carrito vacio");
      return;
    }

    const idCliente = parseInt(localStorage.getItem('cliente'));

    let ordenRequest:CrearOrdenRequest= new CrearOrdenRequest();
    ordenRequest.idCliente=idCliente;
    ordenRequest.idDireccion=this.billingForm.get('idDireccion').getRawValue();
    ordenRequest.totalProductos=this.totalProductos;
    ordenRequest.metodoPago=this.metodoPago.get('metodoDePago').getRawValue();
    ordenRequest.pagoTotal= this.totalPrecio;
    ordenRequest.iva=IVA;
    // return;

    this.ordenesServices.crearOrden(ordenRequest).subscribe({next:data=>{
      console.log(data);
      this.paymentStep.completed = true;
      this.horizontalStepper.next();
      this.listarCarrito();
    }, error:error=>{
      Util.errorMessage(error.error.mensaje)
    }})
  }

  consultarDirecciones(){
    this.adminService.consultarDireccion(9).subscribe({next:data=>{
      console.log(data);
      this.direcciones=data.response;
    }, error:error=>{
      console.log(error);
    }})
  }

  listarCarrito(){
    const idCliente = parseInt(localStorage.getItem('cliente'));
    this.adminService.listarCarrito(idCliente).subscribe({next:(data:any)=>{
      // console.log(data)
      if(data.response === null){
        this.carritos = [];
        return;
      }
      this.carritos = data.response.carrito;
      this.totalProcuctos = this.carritos.length;
      this.carritos.forEach(carrito=>{
        this.totalProductos+=carrito.cantidad;
        this.totalPrecio += carrito.subtotal;
        this.adminService.obtenerImagenesProducto(carrito.producto).subscribe({
          next: data => {
            // Obtener el ultmo elemento de un arreglo
            const imagen = data.response[data.response.length -1];
            this.imagenesProductos[carrito.producto.idProducto] = `data:image/${imagen.tipoImagen};base64,${imagen.imagenBits}`;
          }            
        })
      })   
    }})    
  }

}
