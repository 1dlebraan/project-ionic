import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Ambil token dari AuthService (async)
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        if (token) {
          // Clone request dan tambahkan header Authorization
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(authReq);
        }
        // Jika tidak ada token, lanjutkan request biasa
        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[AuthInterceptor] Error:', error);
        return throwError(() => error);
      })
    );
  }
}
