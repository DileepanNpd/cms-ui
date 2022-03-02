import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const gtag: Function;

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
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      /** START : Code to Track Page View  */
       gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects
       })
      /** END */
    })
  }
}
