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
    this.httpClient
      .get<RecentPostList>(
        environment.service_url + 'recent_posts',
        this.httpOptions
      )
      .subscribe((data) => {
        this.recentPosts = data.stories;
        if (data.stories.length > 0) {
          this.show = true;
        } else {
          this.display = false;
        }
      });
  }
}
