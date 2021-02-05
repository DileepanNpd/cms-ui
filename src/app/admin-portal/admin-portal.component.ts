import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RecentPostList, Constants, Tile } from '../model/common';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonResponse } from '../model/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {
  toppings = new FormControl();
  toppingList: number[] = [];
  login: boolean = false;
  sessionUser: any = {};
  allStories: Tile[] = [];
  pendingReviewStories: Tile[] = [];
  publishedStories: Tile[] = [];
  rejectedApprovalStories: Tile[] = [];
  carouselStories: Tile[] = [];
  show = {
    review_flag: false,
    publish_flag: false,
    reject_flag: false,
    carousel_flag: false,
    page: false
  }
  httpOptions = Constants.httpOptions;

  constructor(private httpClient: HttpClient, private _loginService: LoginService, private router: Router, private _snackBar: MatSnackBar) {
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.login = true;
        this.sessionUser = JSON.parse(cookieValue);
      } else {
        this.login = false;
        this.sessionUser = {};
        this.router.navigate(['/login']);
        this.show.page = false;
      }
    });
  }

  ngOnInit(): void {
    this.httpClient
      .get<RecentPostList>(
        environment.service_url + 'all_stories',
        this.httpOptions
      ).subscribe((data) => {
        this.allStories = data.stories;
        this.splitStories(this.allStories);
      });
  }

  splitStories(allStories: Tile[]) {
    allStories.forEach((story) => {
      if (story.story.status == 1) {
        story.story.selected = "1";
        story.story.featuredSelect = story.story.featured ? "1" : "0";
        story.story.carouselSelect = story.story.carousel ? "1" : "0";
        this.toppingList.push(story.story.id);
        this.publishedStories.push(story);
      } else if (story.story.status == 0) {
        story.story.selected = "0";
        this.pendingReviewStories.push(story);
      } else if (story.story.status == 2) {
        story.story.selected = "2";
        this.rejectedApprovalStories.push(story);
      }
    });
    if (this.pendingReviewStories.length > 0) {
      this.show.review_flag = true;
    }
    if (this.publishedStories.length > 0) {
      this.setCarouselStories(this.publishedStories);
      this.show.publish_flag = true;
    }
    if (this.rejectedApprovalStories.length > 0) {
      this.show.reject_flag = true;
    }

    this.show.page = true;
  }

  setCarouselStories(publishedStories: Tile[]) {
    publishedStories.sort(function (x, y) {
      return (x.story.carousel === y.story.carousel) ? 0 : x ? -1 : 1;
    });
    this.carouselStories = publishedStories;
    this.show.carousel_flag = true;
  }

  updatestatus(id: number, status: string) {
    let request = {
      id: this.sessionUser.id,
      story_id: id,
      status: status
    };
    this.httpClient
      .put<CommonResponse>(environment.service_url + 'update_story_status', request, this.httpOptions)
      .subscribe(
        (data) => {
          this._snackBar.open(data.response.message, '', {
            duration: 2000,
          });
        },
        (err) => {
          console.log(err);
        });
  }

  updateRelatedStories(id: number, related_value: number[]) {
    let request = {
      id: this.sessionUser.id,
      related: related_value,
      story_id: id
    };
    this.httpClient
      .put<CommonResponse>(environment.service_url + 'update_related_stories', request, this.httpOptions)
      .subscribe(
        (data) => {
          this._snackBar.open(data.response.message, '', {
            duration: 2000,
          });
        },
        (err) => {
          console.log(err);
        });
  }

  updateFeatureStories(id: number, feature: string) {
    let request = {
      id: this.sessionUser.id,
      feature: feature,
      story_id: id
    };
    this.httpClient
      .put<CommonResponse>(environment.service_url + 'update_featured_stories', request, this.httpOptions)
      .subscribe(
        (data) => {
          this._snackBar.open(data.response.message, '', {
            duration: 2000,
          });
        },
        (err) => {
          console.log(err);
        });
  }

  updateCarouselStories(id: number, carousel: string) {
    let request = {
      id: this.sessionUser.id,
      carousel: carousel,
      story_id: id
    };
    this.httpClient
      .put<CommonResponse>(environment.service_url + 'update_carousel_stories', request, this.httpOptions)
      .subscribe(
        (data) => {
          this._snackBar.open(data.response.message, '', {
            duration: 2000,
          });
        },
        (err) => {
          console.log(err);
        });
  }
}