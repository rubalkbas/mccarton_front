import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AdminService } from '../../_services/admins.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: UntypedFormGroup;
  preguntasFrecuentes:[];
  constructor(public formBuilder: UntypedFormBuilder,
    public adminService:AdminService) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
    this.adminService.getAllPreguntasActivas().subscribe(resp=>{
      console.log(resp.response)
      this.preguntasFrecuentes=resp.response;
    }, error=>{console.error(error)});

  }

  public onContactFormSubmit(values:Object):void {
    if (this.contactForm.valid) {
      console.log(values);
    }
  }

  // Concultar Todos Activos 
}



 



