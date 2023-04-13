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

}
