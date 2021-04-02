import { Component, OnInit } from '@angular/core';
import { Tile, RecentPostList, Constants } from '../model/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recent-post',
  templateUrl: './recent-post.component.html',
  styleUrls: ['./recent-post.component.css'],
})
export class RecentPostComponent implements OnInit {
  recentPosts!: Tile[];
  show: boolean = false;
  display: boolean = true;
  httpOptions = Constants.httpOptions;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    let carouselStoriesFlag = localStorage.getItem("recentPostsFlag");
    if (carouselStoriesFlag != null && carouselStoriesFlag != undefined && carouselStoriesFlag == "true") {
      this.recentPosts = JSON.parse(localStorage.getItem('recentPosts'));
      this.show = true;
    } else {
      this.httpClient
        .get<RecentPostList>(
          environment.service_url + 'recent_posts',
          this.httpOptions
        )
        .subscribe((data) => {
          this.recentPosts = data.stories;
          if (data.stories != undefined && data.stories.length > 0) {
            localStorage.setItem('recentPosts', JSON.stringify(data.stories));
            localStorage.setItem('recentPostsFlag', "true");
            this.show = true;
          } else {
            this.display = false;
          }
        });
    }
  }
}
