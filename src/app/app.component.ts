import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import { LocalstorageService } from './services/localstorage.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [],
})
export class AppComponent implements OnInit {
  title = 'Diyalakshmi Tamil Novels';
  static isBrowser = new BehaviorSubject<boolean>(null);
  ngOnInit(): void {
    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'read,write,novels,book,tamil,story,Diyalakshmitamilnovels,Diyalakshmi,siddharth,online',
      },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Diyalakshmi' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'UTF-8' },
    ]);

  }
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: any, 
  private tmpStore : LocalstorageService,private metaTagService: Meta) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
    tmpStore.setItem("recentPostsFlag", "false");
    tmpStore.setItem("carouselStoriesFlag", "false");
    tmpStore.setItem("featurePostsFlag", "false");
  }
}
