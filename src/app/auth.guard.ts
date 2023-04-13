import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router){}

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('AuthGuard canActivate called.');
      return true;
    } else {
      this.router.navigate(['/sign-in']);
      console.log('AuthGuard canActivate called.');
      return false;
    }
  }

}
