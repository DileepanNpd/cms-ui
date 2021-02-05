import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  login: boolean = false;
  constructor(private router: Router, private _loginService: LoginService) {
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.login = true;
      } else {
        this.login = false;
      }
    });
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn()) {
      return true;
    }
    // navigate to login page as user is not authenticated
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

    return false;
  }

  public isLoggedIn(): boolean {
    return this.login;
  }
}
