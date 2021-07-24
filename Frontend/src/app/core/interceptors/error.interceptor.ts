import { catchError } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService, public snackBar: MatSnackBar) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(catchError((err: HttpErrorResponse) => {
        this.spinner.hide();

        let message = '';
        if ('string' === typeof err.error) {
          message = err.error;
        } else if (err.error && err.error.errors) {
          message = Object.keys(err.error.errors)
            .map(e => err.error.errors[e])
            .join('\n');
        } else if (err.error && err.error.message) {
          message = err.error.message;
        } else if (err.message) {
          message = err.message;
        }

        console.log(message)

        this.snackBar.open(message, 'Warning', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-accent'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return throwError(message);
      }));
  }
}
