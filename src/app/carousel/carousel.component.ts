import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../services/login.service';
import { RecentPostList, Constants, Tile } from '../model/common';
import { environment } from 'src/environments/environment';

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

  constructor(config: NgbCarouselConfig, _loginService: LoginService, private httpClient: HttpClient) {
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    this.isMobile = _loginService.getDeviceType();
  }

  ngOnInit(): void {
    this.httpClient
      .get<RecentPostList>(
        environment.service_url + 'carousel_stories',
        this.httpOptions
      ).subscribe((data) => {
        this.carouselStories = data.stories;
        this.show = true;
      });
  }

}
