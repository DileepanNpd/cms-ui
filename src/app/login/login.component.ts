import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../services/login.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Author } from '../model/author';
import { Profile } from '../model/profile';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Constants, CommonResponse } from '../model/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  registerForm;
  loginForm;
  sessionUser: any = {};
  login: boolean = false;
  signup: boolean = false;
  returnUrl: string;
  profile!: Profile;
  httpOptions = Constants.httpOptions;
  author: Author = {} as Author;
  cookie: string = '';

  sign = {
    user: '',
    email: '',
    password: ''
  };
  constructor(
    private authService: SocialAuthService,
    private cookieService: CookieService,
    private _loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private loginService: LoginService
  ) {
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.login = true;
        this.sessionUser = JSON.parse(cookieValue);
        console.log(this.sessionUser);
        // this.router.navigateByUrl(this.returnUrl);
      } else {
        this.login = false;
        this.sessionUser = {};
      }
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((response) => {
      console.log(response);
      this.refreshToken();
    }).catch(e => {
      alert('Please enable cookies & refresh the page, you will be signed in with google');
    });
  }

  signOut(): void {
    this.cookieService.delete('novel-session');
    this.authService.signOut(true);
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      user: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  loginClick() {
    if (this.loginForm.value.email != '' && this.loginForm.value.password != '') {
      let email = this.loginForm.value.email;
      let userId = '';
      for (var i = 0; i < email.length; i++) {
        userId = userId + email.charCodeAt(i);
      }
      let cookieObj = {
        id: userId,
        email: this.loginForm.value.email,
        password: btoa(this.loginForm.value.password),
        author: {} as Author,
        isAdmin: false
      };
      this.httpClient.post<CommonResponse>(
        environment.service_url + 'login',
        cookieObj,
        this.httpOptions
      ).subscribe(
        (data) => {
          if (data != null && data.response != null &&
            data.response.code != null && data.response.code == 500) {
            alert("Unable to Login now, Reach us - writerudhi@gmail.com");
          } else {
            this.profile = data.profile;
            this.author.id = this.profile.id;
            if (this.profile.poetic_name !== '') {
              console.log("poetic");
              this.author.name = this.profile.poetic_name;
            } else {
              console.log("normal");
              console.log(this.profile.name);
              this.author.name = this.profile.name;
            }
            this.author.image = this.profile.image;
            cookieObj.author = this.author;
            cookieObj.isAdmin = this.profile.isAdmin;
            this.cookieService.set('novel-session', JSON.stringify(cookieObj));
            this.cookie = this.cookieService.get('novel-session');
            this.loginService.value.next(this.cookie);
            this.login = true;
            this.sessionUser = JSON.parse(this.cookie);
            this.router.navigateByUrl(this.returnUrl);
          }
        },
        (err) => {
          alert("Unable to login, Reach us - writerudhi@gmail.com");
          console.log(err);
        }
      );
    } else {
      alert('Enter all the details to login');
    }
  }
  register() {
    console.log("click register");
    if (this.registerForm.value.user != '' && this.registerForm.value.email != ''
      && this.registerForm.value.password != ''
      && this.registerForm.value.password2 != '') {
      if (this.registerForm.value.password != this.registerForm.value.password2) {
        alert("Password doesn't match");
      } else {

        let email = this.registerForm.value.email;
        let userId = '';
        for (var i = 0; i < email.length; i++) {
          userId = userId + email.charCodeAt(i);
        }
        let cookieObj = {
          id: userId,
          name: this.registerForm.value.user,
          image: '',
          email: this.registerForm.value.email,
          password: btoa(this.registerForm.value.password),
          author: {} as Author,
          isAdmin: false
        };
        this.httpClient.post<CommonResponse>(
          environment.service_url + 'login',
          cookieObj,
          this.httpOptions
        ).subscribe(
          (data) => {
            if (data != null && data.response != null &&
              data.response.code != null && data.response.code == 500) {
              alert("Unable to Register now, Reach us - writerudhi@gmail.com");
            } else {
              this.profile = data.profile;
              this.author.id = this.profile.id;
              if (this.profile.poetic_name !== '') {
                this.author.name = this.profile.poetic_name;
              } else {
                this.author.name = this.profile.name;
              }
              this.author.image = this.profile.image;
              cookieObj.author = this.author;
              cookieObj.isAdmin = this.profile.isAdmin;
              this.cookieService.set('novel-session', JSON.stringify(cookieObj));
              this.cookie = this.cookieService.get('novel-session');
              this.loginService.value.next(this.cookie);
              this.signup = false;
              this.login = true;
              this.sessionUser = JSON.parse(this.cookie);
              // this.router.navigateByUrl(this.returnUrl);
            }
          },
          (err) => {
            alert("Unable to sign-up, Reach us - writerudhi@gmail.com");
            console.log(err);
          }
        );
      }
    } else {
      alert('Enter all the details to signup');
    }
  }

  registerHere() {
    this.signup = true;
  }

  LoginHere() {
    this.signup = false;
  }
}

