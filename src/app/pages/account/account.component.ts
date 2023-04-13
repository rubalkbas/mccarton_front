import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen:boolean = true;
  
  public links = [
    { name: 'Dashboard', href: 'dashboard', icon: 'dashboard' },
    { name: 'Mi Informacion', href: 'information', icon: 'info' },
    { name: 'Direcciones', href: 'addresses', icon: 'location_on' },
    { name: 'Mis compras', href: 'orders', icon: 'add_shopping_cart' },    
  ];
  constructor(public router:Router) { }

  ngOnInit() {

    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { 
        if(window.innerWidth < 960){
          this.sidenav.close(); 
        }
      }                
    });
  }

  public salir(){
    localStorage.removeItem('authTokenExpiration');
    localStorage.removeItem('access_token');
    localStorage.removeItem('cliente');
    this.router.navigate(['/sign-in']);
  }

}
