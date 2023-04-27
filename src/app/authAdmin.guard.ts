import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionAdminStorageService } from './_services/session-storage.service';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {
  constructor(private router: Router,
    private sessionService:SessionAdminStorageService){}

    canActivate(): Observable<boolean> {
      const token = localStorage.getItem('access_token');
      return this.sessionService.getUser().pipe(
        switchMap(usuario => {
          console.log("usuario", usuario)
          if (token && usuario?.estatus == 1) {
            console.log('AuthGuard canActivate called.');
            return of(true);
          } else {
            this.router.navigate(['/login-admin']);
            console.log('AuthGuard canActivate called.');
            return of(false);
          }
        })
      );
    }
}
