import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonResponse, Constants } from '../model/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'sidenav-responsive',
  templateUrl: 'sidenav-responsive.component.html',
  styleUrls: ['sidenav-responsive.component.css'],
})
export class SidenavResponsiveComponent implements OnDestroy, OnInit {
  show: boolean = false;
  login: boolean = false;
  admin: boolean = false;
  mobileQuery: MediaQueryList;
  opened: boolean = false;
  sessionUser: any = {};
  private _mobileQueryListener: () => void;
  cookieValue = this._loginService.value.asObservable();
  cookie: string = '';
  httpOptions = Constants.httpOptions;

  constructor(
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private _loginService: LoginService, private authService: SocialAuthService,
    private cookieService: CookieService, private httpClient: HttpClient, private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this._loginService.setDeviceType(this.mobileQuery.matches)
    this._loginService.getCookie();
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.sessionUser = JSON.parse(cookieValue);
        this.login = true;
        this.admin = this.sessionUser.isAdmin;
      } else {
        this.sessionUser = {};
        this.login = false;
        this.admin = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  signInWithGoogle(): void {
    this.router.navigateByUrl("/login");
  }

  ngOnInit(): void {
    if (!this.mobileQuery.matches) {
      this.opened = true;
    }
    this.show = true;
  }

  signOut(): void {
    this.authService.signOut(true);
    this.cookie = this.cookieService.get('novel-session');
    let seseion = JSON.parse(this.cookie);
    let cookieObj = {
      id: seseion.id
    };
    this.httpClient.post<CommonResponse>(
      environment.service_url + 'logout',
      cookieObj,
      this.httpOptions
    ).subscribe();
    this.cookieService.delete('novel-session');
    this._loginService.value.next('');
  }

  sideNavResponsive(): void {
    if (this.mobileQuery.matches) {
      this.opened = false;
    }
  }
}
