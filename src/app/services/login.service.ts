import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Author } from '../model/author';
import { Profile } from '../model/profile';
import { BehaviorSubject } from 'rxjs';
import { CommonResponse, Constants } from '../model/common';

@Injectable()
export class LoginService {
    private value = new BehaviorSubject<string>('');
    cookieValue = this.value.asObservable();
    cookie: string = '';
    sessionUser!: any;
    user!: SocialUser;
    profile!: Profile;
    author: Author = {} as Author;
    isMobile: boolean = false;
    httpOptions = Constants.httpOptions;
    constructor(
        private authService: SocialAuthService,
        private httpClient: HttpClient,
        private cookieService: CookieService) {
    }
    setDeviceType(deviceType: boolean) {
        this.isMobile = deviceType;
    }

    getDeviceType() {
        return this.isMobile;
    }

    getCookie() {
        this.authService.authState.subscribe(
            (user) => {
                this.user = user;
                if (user != null) {
                    let cookieObj = {
                        id: this.user.id,
                        name: this.user.name,
                        image: this.user.photoUrl,
                        email: this.user.email,
                        author: {} as Author,
                        isAdmin: false
                    };
                    this.httpClient.post<CommonResponse>(
                        environment.service_url + 'login',
                        cookieObj,
                        this.httpOptions
                    ).subscribe(
                        (data) => {
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
                            this.value.next(this.cookie);
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
                } else {
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
                    this.value.next('');
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }
}