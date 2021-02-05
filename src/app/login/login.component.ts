import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  sessionUser: any = {};
  login: boolean = false;
  returnUrl: string;

  constructor(
    private authService: SocialAuthService,
    private cookieService: CookieService,
    private _loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.login = true;
        this.sessionUser = JSON.parse(cookieValue);
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.login = false;
        this.sessionUser = {};
      }
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((response) => {
    }).catch(e => {
      alert('Please enable cookies & refresh the page, you will be signed in with google');
    });
  }

  signOut(): void {
    this.cookieService.delete('novel-session');
    this.authService.signOut(true);
  }

  ngOnInit() { }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
}
