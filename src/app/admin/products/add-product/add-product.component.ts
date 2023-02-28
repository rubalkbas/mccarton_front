import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Category } from 'src/app/app.models';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/_services/productos.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  public form: FormGroup;
  public colors = ["#5C6BC0","#66BB6A","#EF5350","#BA68C8","#FF4081","#9575CD","#90CAF9","#B2DFDB","#DCE775","#FFD740","#00E676","#FBC02D","#FF7043","#F5F5F5","#696969"];
  public sizes = ["S","M","L","XL","2XL","32", "36","38","46","52","13.3\"","15.4\"","17\"","21\"","23.4\""]; 
  public selectedColors:string;
  public categories:Category[];
  private sub: any;
  public id:any;

  categoriasLista: any;
  nuevaCatego = 0;


  panelOpenState = false;
  constructor(public appService:AppService,public productoService:ProductoService, public formBuilder: FormBuilder, private activatedRoute: ActivatedRoute ) {
    this.newSteps.push({ title: null, value: null });

   }

  isLinear = false;
  formGroup: FormGroup;
  formStepper: FormArray;
  @ViewChild('stepper') stepper;
  stepOptions = [
    { label: 'Buy Groceries', value: '1' },
    { label: 'Cook Dinner', value: '2' },
    { label: 'Go To Sleep', value: '3' },
    { label: 'Go To Work', value: '4' },
    { label: 'Wake Up', value: '5' }
  ]
  newSteps = [];

  isSet = (value) => {
    return value !== undefined && value !== null;
  }

  addItem() {
    this.newSteps.push({ title: null, value: null }); 
    this.stepper.selectedIndex = this.newSteps.length - 1;
  }
  changeStep(event, index) {
    let x = this.stepper.selectedIndex

    

    for (let i = 0; i < this.categoriasLista.length; i++) {
      console.log(this.categoriasLista[i]);

      if (this.categoriasLista[i].nivelcategoria == event.value){
        this.newSteps[index].title = this.categoriasLista[i].descCategoria;
        this.newSteps[index].value = this.categoriasLista[i].nivelcategoria
        this.getCategorias(this.categoriasLista[i].nivelcategoria)
        this.newSteps.push({ title: null, value: null }); 
        this.newSteps[index + 1 ].title = this.categoriasLista[i+ 1].descCategoria;
        this.newSteps[index + 1].value = this.categoriasLista[i+ 1].nivelcategoria
        this.stepper.selectedIndex = (x + 1);
      }

    }

  //  
    // console.log(event.value, index, this.stepperIndex)
  }

  public onStepChange(event: any): void {


    console.log(this.newSteps[event.selectedIndex].value);
    let x = this.newSteps[event.selectedIndex].value

   
    this.getCategorias(x)


    

    
  }

  stepSeleccionado(event, index) {

    console.log(event.value + "este selecciono en el estepper")

  }




  onRemoveAll() {
    this.newSteps = [];
  }

  removeStep(i){
    this.newSteps.splice(i,1);
  }

  
  ngOnInit(): void {

    this.getCategorias(this.nuevaCatego)


    this.form = this.formBuilder.group({ 
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'images': null,
      "oldPrice": null,
      "newPrice": [null, Validators.required ],
      "discount": null, 
      "description": null,
      "availibilityCount": null, 
      "color": null,
      "size": null,
      "weight": null,
      "categoryId": [null, Validators.required ]   
    }); 
    this.getCategories();
    this.sub = this.activatedRoute.params.subscribe(params => {  
      if(params['id']){
        this.id = params['id'];
        this.getProductById(); 
      }  
    }); 
  }


  



  public getCategorias(idPadre){   
    this.productoService.consultarCategoriasHija(idPadre).subscribe(data => {

      
      this.categoriasLista = data.lista; 

      //this.categories.shift();
    }); 
  }

  public getCategories(){   
    this.appService.getCategories().subscribe(data => {
      this.categories = data; 
      this.categories.shift();
    }); 
  }

  public getProductById(){
    this.appService.getProductById(this.id).subscribe((data:any)=>{ 
      this.form.patchValue(data); 
      this.selectedColors = data.color; 
      const images: any[] = [];
      data.images.forEach(item=>{
        let image = {
          link: item.medium,
          preview: item.medium
        }
        images.push(image);
      })
      this.form.controls.images.setValue(images); 
    });
  }

  public onSubmit(){
    console.log(this.form.value);
  }

  public onColorSelectionChange(event:any){  
    if(event.value){
      this.selectedColors = event.value.join();
    } 
  }  

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

}
