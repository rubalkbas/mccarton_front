import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { tap } from 'rxjs/operators';
import { Util } from "../util/util";



const USER_KEY = "auth-user";

@Injectable({
  providedIn: "root",
})
export class SessionAdminStorageService {
    private dataSubject = new BehaviorSubject<any>(null);
    private sessionTimeout: any;

  constructor(private router: Router) {
    const storedData =JSON.parse(window.localStorage.getItem(USER_KEY))
    if (storedData||storedData!=null) {
      this.dataSubject.next(storedData);
    }
  }

  public signOut(): void {
    window.localStorage.clear();
    localStorage.clear();
    this.dataSubject.next(null);
  }

  public saveUser(user): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.dataSubject.next(user);
  }

  public getUser() {
    return this.dataSubject.asObservable();
  }

  startSessionTimer() {  
    const tokenExp =parseInt(localStorage.getItem('authTokenExpiration')); 
    const now = Math.floor(Date.now() / 1000);

    const timeLeft = tokenExp - now;

    console.log("Tiempo", timeLeft)
    this.sessionTimeout = setTimeout(() => {
      const cliente=localStorage.getItem('cliente');
      console.log("cliente", cliente);
      if(cliente){
        localStorage.removeItem('cliente');
        localStorage.removeItem('access_token');
        window.location.reload();
      }else{
        this.router.navigate(['/login-admin']);
        this.signOut(); 
      }
      Util.errorMessage('Tu sesión ha expirado');
    }, timeLeft * 1000);
  }

  stopSessionTimer() {
    clearTimeout(this.sessionTimeout); 
  }

}
