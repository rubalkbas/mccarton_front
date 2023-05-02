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
import { CrearOrdenRequest, Ordenes } from "src/app/models/ordenes.model";
import { Util } from "src/app/util/util";
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { CarroService } from "src/app/_services/carro.service";

const IVA: number = 0.16;

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

  pagobueno:boolean = false;
  countries = [];
  months = [];
  years = [];
  deliveryMethods = [];
  grandTotal = 0;
  watcher: Subscription;

  idCliente: number;
  panelOpenState = false;

  direcciones: Direccion[] = []

  seleccion: any;

  carritos: CarroCompras[] = [];
  totalProcuctos: number;
  totalPrecio: number = 0;
  imagenesProductos: { [idProducto: string]: string } = {};
  totalProductos: number = 0;

  revisionOrden: boolean = false;
  showSuccess: boolean = false;
  public payPalConfig: any;
  public showPaypalButtons: boolean;


  constructor(

    public appService: AppService,
    public formBuilder: UntypedFormBuilder,
    public mediaObserver: MediaObserver,
    private adminService: AdminService,
    private ordenesServices: OrdenesService,
    private carroService:CarroService


  ) {
    this.initConfig();
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

    this.metodoPago = this.formBuilder.group({
      metodoDePago: [""]
    })

    //Implementacion de pago con paypal

  }
  initConfig() {
    this.payPalConfig = {
      currency: 'MXN',
      clientId: 'AW2nd15K7m4VO6u51T87TexTGOzPG6m-Pqtmhq1a5kVKmgxknPiofwa8pXvuCE9ft2Knh6i_hWXUEwR7',

      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'MXN',
              value: this.totalPrecio.toFixed(2), // Incluir el total del carrito de compras
              breakdown: {
                item_total: {
                  currency_code: 'MXN',
                  value: this.totalPrecio.toFixed(2) // Incluir el total del carrito de compras
                }
              }
            },
            items: this.carritos.map(carrito => ({ // Mapear los productos del carrito a la estructura de PayPal
              name: carrito.producto.nombreProducto,
              quantity: carrito.cantidad.toString(),
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'MXN',
                value: carrito.subtotal.toFixed(2),
              },
            })),
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        this.pagobueno=true;
        this.realizarOrden();
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }


  ngAfterViewInit(): void {
    this.consultarDirecciones();
    this.listarCarrito();

  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  public realizarOrden() {

    if (this.carritos.length == 0) {
      Util.errorMessage("Carrito vacio");
      return;
    }

    const idCliente = parseInt(localStorage.getItem('cliente'));

    let ordenRequest: CrearOrdenRequest = new CrearOrdenRequest();
    ordenRequest.idCliente = idCliente;
    ordenRequest.idDireccion = this.billingForm.get('idDireccion').getRawValue();
    ordenRequest.totalProductos = this.totalProductos;
    // ordenRequest.metodoPago = this.metodoPago.get('metodoDePago').getRawValue();
    ordenRequest.metodoPago = "PAYPAL"
    ordenRequest.pagoTotal = this.totalPrecio;
    ordenRequest.iva = IVA;
    // return;

    this.ordenesServices.crearOrden(ordenRequest).subscribe({
      next: data => {
        this.paymentStep.completed = true;
        this.horizontalStepper.next();
        this.listarCarrito();
        this.carroService.listarCarrito();
      }, error: error => {
        Util.errorMessage(error.error.mensaje)
      }
    })
  }

  consultarDirecciones() {
    this.adminService.consultarDireccion(9).subscribe({
      next: data => {
        console.log(data);
        this.direcciones = data.response;
      }, error: error => {
        console.log(error);
      }
    })
  }

  listarCarrito() {
    const idCliente = parseInt(localStorage.getItem('cliente'));
    this.adminService.listarCarrito(idCliente).subscribe({
      next: (data: any) => {
        // console.log(data)
        if (data.response === null) {
          this.carritos = [];
          return;
        }
        this.carritos = data.response.carrito;
        this.totalProcuctos = this.carritos.length;
        this.carritos.forEach(carrito => {
          this.totalProductos += carrito.cantidad;
          this.totalPrecio += carrito.subtotal;
          this.adminService.obtenerImagenesProducto(carrito.producto).subscribe({
            next: data => {
              // Obtener el ultmo elemento de un arreglo
              const imagen = data.response[data.response.length - 1];
              this.imagenesProductos[carrito.producto.idProducto] = `data:image/${imagen.tipoImagen};base64,${imagen.imagenBits}`;
            }
          })
        })
      }
    })
  }
  pay() {
    this.showPaypalButtons = true;
  }

  back() {
    this.showPaypalButtons = false;
  }

}
