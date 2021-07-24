import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import * as jwt_decode from "jwt-decode";
import { AuthModel } from "../models/auth/auth.model";
import { CookieService } from "ngx-cookie-service";
import { AuthService } from "src/app/core/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  private token: string;
  constructor(
    private authService: AuthService,
    private cookieService: CookieService, public snackBar: MatSnackBar
  ) {
    this.token = this.authService.authData.token
    this.authService.authData$.subscribe((authData) => {
      this.token = authData.token
    })
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // posts all ?
    if (
      req.url.endsWith("api/account/login") ||
      req.url.endsWith("/api/account/register") ||
      req.url.endsWith("/api/external/facebook") ||
      req.url.endsWith("api/external/gmail")
    ) {
      req = req.clone({
        setHeaders: {
          "Content-type": "application/json",
        },
      });
    } else if (req.url.endsWith("api/job/Upload")) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    }
    else {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
    }

    return next.handle(req).pipe(
      tap((res: HttpEvent<any>) => {
        if (
          res instanceof HttpResponse &&
          req.url.endsWith("/api/account/login")
        ) {
          this.saveToken(res.body);
        }

        if (
          res instanceof HttpResponse &&
          req.url.endsWith("/api/account/register")
        ) {
          this.snackBar.open("New user has been registered successfully.", '', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-primary'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      })
    );
  }

  private saveToken(res) {
    try {
      const decodedToken = jwt_decode(res.token);
      const data = new AuthModel(
        res.token,
        decodedToken.userId,
        decodedToken.unique_name,
        decodedToken.email,
        true,
        decodedToken.isAdmin,
        decodedToken.isManager,
        decodedToken.isActive,
      );
      this.authService.authData = data
      this.authService.authDataSubject.next(data)

      this.cookieService.set("token", res.token);
      if (res.message) {
        this.snackBar.open(res.message, '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-primary'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    } catch (err) {
      this.snackBar.open(err, 'Warning', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-accent'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}
