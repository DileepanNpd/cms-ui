import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../services/login.service';
import { RecentPostList, Constants, Tile } from '../model/common';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from '../services/localstorage.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  show: boolean = false;
  isMobile: boolean = false;
  httpOptions = Constants.httpOptions;
  carouselStories: Tile[] = [];
  tmpStore : LocalstorageService;

  constructor(config: NgbCarouselConfig, _loginService: LoginService, private httpClient: HttpClient, private storage : LocalstorageService) {
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    this.isMobile = _loginService.getDeviceType();
    this.tmpStore = storage;
  }

  ngOnInit(): void {
    let carouselStoriesFlag = this.tmpStore.getItem("carouselStoriesFlag");
    if (carouselStoriesFlag != null && carouselStoriesFlag != undefined && carouselStoriesFlag == "true") {
      this.carouselStories = JSON.parse(this.tmpStore.getItem('carouselStories'));
      this.show = true;
    } else {
      this.httpClient
        .get<RecentPostList>(
          environment.service_url + 'carousel_stories',
          this.httpOptions
        ).subscribe((data) => {
          this.carouselStories = data.stories;
          if (data != null && data.stories != null && data.stories != undefined) {
            this.tmpStore.setItem('carouselStories', JSON.stringify(data.stories));
            this.tmpStore.setItem('carouselStoriesFlag', "true");
          }
          this.show = true;
        });
    }
  }

}
