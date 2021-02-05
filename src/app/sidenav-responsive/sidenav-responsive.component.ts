import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';
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

  constructor(
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private _loginService: LoginService, private authService: SocialAuthService
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
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((response) => {
    }).catch(e => {
      alert('Please enable cookies & refresh the page, you will be signed in with google');
    });
  }

  ngOnInit(): void {
    if (!this.mobileQuery.matches) {
      this.opened = true;
    }
    this.show = true;
  }

  signOut(): void {
    this.authService.signOut(true);
  }

  sideNavResponsive(): void {
    if (this.mobileQuery.matches) {
      this.opened = false;
    }
  }
}
