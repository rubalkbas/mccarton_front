import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { tap } from 'rxjs/operators';



const USER_KEY = "auth-user";

@Injectable({
  providedIn: "root",
})
export class SessionAdminStorageService {
    private dataSubject = new BehaviorSubject<any>(null);

  constructor() {
    const storedData =JSON.parse(window.sessionStorage.getItem(USER_KEY))
    if (storedData||storedData!=null) {
      this.dataSubject.next(storedData);
    }
  }

  public signOut(): void {
    window.sessionStorage.clear();
    sessionStorage.clear();
    this.dataSubject.next(null);
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.dataSubject.next(user);
  }

  public getUser() {
    return this.dataSubject.asObservable();
  }

}
