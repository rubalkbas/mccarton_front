import { Router } from '@angular/router';
import { SessionAdminStorageService } from './../../../_services/session-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public userImage = 'assets/images/others/admin.jpg';

  usuario:any=null;

  constructor(
    private sessionStorage:SessionAdminStorageService,
    public router:Router
    ) { }

  ngOnInit(): void {
    this.verificaSesion();
  }


  verificaSesion(){
    this.sessionStorage.getUser().subscribe((user) => {
      this.usuario = user;
    })
  }

  cerrarSesion(){
    this.router.navigate(['login-admin']);
    this.sessionStorage.signOut();
  }

  bytesToImageUrl(bytes: Uint8Array, tipoImagen:string): string {
    return `data:${tipoImagen};base64,${bytes}`;
}

}
