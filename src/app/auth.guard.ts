import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router){}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('AuthGuard canActivate called.');
      return true;
    } else {
      this.router.navigate(['/login']);
      console.log('AuthGuard canActivate called.');
      return false;
    }
  }

}
