import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwt_token');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      // Token valid
      return true;
    }

    // Token tidak ada atau sudah kadaluarsa
    this.router.navigate(['/login']);
    return false;
  }
}
