import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanDeactivate<any> {

  constructor(private router: Router) { }

  canDeactivate(): boolean {
    localStorage.removeItem('authTokenExpiration');
    localStorage.removeItem('access_token');
    localStorage.removeItem('cliente');
    return true;
  }
}
