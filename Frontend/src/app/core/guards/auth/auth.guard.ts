import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (route && route.data && route.data.allowGuestAccess) {
      return true
    }

    // check if roles are required
    if (route && route.data && route.data.allowedRoles && route.data.allowedRoles.length > 0) {
      const allowedRoles = route.data.allowedRoles;
      if (
        (this.authService.isAdmin && allowedRoles.includes("admin")) ||
        (this.authService.isManager && allowedRoles.includes("manager")) ||
        (this.authService.isLoggedIn && !this.authService.isAdmin && !this.authService.isManager && allowedRoles.includes("normal"))) {
        return true
      }
    }

    // not logged so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
