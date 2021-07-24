import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../models/auth/register.model";
import { LoginModel } from "../models/auth/login.model";

import { CookieService } from "ngx-cookie-service";
import * as jwt_decode from "jwt-decode";
import { AuthModel } from "../models/auth/auth.model";
import { environment } from "src/environments/environment";
import { Observable, Subject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

const loginUrl = environment.baseUrl + "/api/account/login";
const updateUserPasswordUrl = environment.baseUrl + "/api/account/UpdateUserPassword";
const registerUrl = environment.baseUrl + "/api/account/register";


@Injectable({ providedIn: 'root' })
export class AuthService {
  initialAuth = new AuthModel("", "", "", "", false, false, false, false)
  authData = this.initialAuth
  authDataSubject = new Subject<AuthModel>();
  authData$ = this.authDataSubject.asObservable();

  public isLoggedIn: boolean;
  public isAdmin: boolean;
  public isManager: boolean;

  public userId: string;
  public userName: string;
  public email: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService, public snackBar: MatSnackBar
  ) {
    this.authData$.subscribe((authData) => {
      this.isLoggedIn = authData.isLoggedIn
      this.isAdmin = authData.isAdmin
      this.isManager = authData.isManager

      this.userId = authData.userId
      this.userName = authData.userName
      this.email = authData.email
    })


    const cookie = this.cookieService.check("token");
    if (cookie) {
      const token = this.cookieService.get("token");
      try {
        const decodedToken = jwt_decode(token);
        const data = new AuthModel(
          token,
          decodedToken.userId,
          decodedToken.unique_name,
          decodedToken.email,
          true,
          decodedToken.isAdmin,
          decodedToken.isManager,
          decodedToken.isActive,
        );
        this.authData = data
        this.authDataSubject.next(data)
      } catch (err) {
        this.snackBar.open("Invalid Token", 'Warning', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-accent'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    }
  }

  updateUserPassword(body: User): Observable<any> {
    return this.http.put(updateUserPasswordUrl, body);
  }

  register(body: User): Observable<any> {
    return this.http.post(registerUrl, body);
  }

  login(body: LoginModel): Observable<any> {
    return this.http.post(loginUrl, body);
  }

  logout() {
    this.cookieService.delete("token");
    this.authData = this.initialAuth
    this.authDataSubject.next(this.authData)

    this.snackBar.open("Logout successful!", '', {
      duration: 3000,
      panelClass: ['mat-toolbar', 'mat-primary'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    this.router.navigate(["/home"]);
  }
}
