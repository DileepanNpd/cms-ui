import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [],
})
export class AppComponent implements OnInit {
  title = 'Diyalakshmi Tamil Novels';
  ngOnInit(): void {
    localStorage.setItem("recentPostsFlag", "false");
    localStorage.setItem("carouselStoriesFlag", "false");
    localStorage.setItem("featurePostsFlag", "false");
  }
}
