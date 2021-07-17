import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewStory, Constants, CommonResponse } from '../model/common';
import { environment } from 'src/environments/environment';
import paginate = require('jw-paginate');
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ShareService } from '../services/share.service';
import { LinkService } from '../services/link.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class StoryComponent implements OnInit, OnChanges {
  show: boolean = false;
  storyDescription: string = '';
  viewStory!: ViewStory;
  showRelatedStories: boolean = false;
  login: boolean = false;
  like: boolean = false;
  dislike: boolean = false;
  sessionUser: any = {};
  storyId!: number;
  @Input() items!: Array<any>;
  @Output() changePage = new EventEmitter<any>(true);
  @Input() initialPage = 1;
  @Input() pageSize = 1;
  @Input() maxPages = 3;
  httpOptions = Constants.httpOptions;
  pager: any = {};
  sanitizer!: DomSanitizer;
  websiteUrl: string = '';
  isMeme: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private sanitizerObj: DomSanitizer,
    private _loginService: LoginService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private shareService: ShareService,
    private linkService: LinkService
  ) {
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.login = true;
        this.sessionUser = JSON.parse(cookieValue);
        this.refreshReaction();
      } else {
        this.login = false;
        this.sessionUser = {};
        this.refreshReaction();
      }
    });
  }

  ngOnInit(): void {
    this.websiteUrl = environment.domain_url + this.router.url;
    this.sanitizer = this.sanitizerObj;
    this.websiteUrl = environment.domain_url + this.router.url;
    this.activatedRoute.params.subscribe((params) => {
      let storyId = params['storyId'];
      let category = params['category'];
      let author = params['author'];
      let storyName = params['storyName'];
      let episode = params['episode'];
      this.storyId = storyId;
      this.httpClient
        .get<ViewStory>(
          environment.service_url + 'story/' + storyId,
          this.httpOptions
        )
        .subscribe((data) => {
          this.viewStory = data;
          if (this.viewStory.category.id == 17) {
            this.isMeme = true;
          }
          this.storyDescription = this.viewStory.story.stories[0];
          this.items = this.viewStory.story.episode;
          this.addTag();
          if (this.items && this.items.length) {
            this.setPage(this.initialPage);
          }
          if (episode != undefined && episode != '') {
            this.initialPage = Number(episode);
            this.setPage(this.initialPage);
          }
          if (this.viewStory.relatedStories != null && this.viewStory.relatedStories.length > 0) {
            this.showRelatedStories = true;
          } else {
            this.showRelatedStories = false;
          }

          this.show = true;
        });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset page if items array has changed
    if (changes.items.currentValue !== changes.items.previousValue) {
      this.setPage(this.initialPage);
    }
  }

  setPageBottom(page: number) {
    this.router.navigate(['/' + this.viewStory.category.name + '/redirect/' + this.viewStory.author.name + '/' + this.viewStory.story.id + '/' + this.viewStory.story.name + '/' + page]);
  }

  setPage(page: number) {
    // get new pager object for specified page
    this.pager = paginate(
      this.items.length,
      page,
      this.pageSize,
      this.maxPages
    );

    // get new page of items from items array
    var pageOfItems = this.items.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );

    // call change page function in parent component
    this.changePage.emit(pageOfItems);
    this.storyDescription = this.viewStory.story.stories[page - 1];
  }

  setMyStyles() {
    let styles = {
      'background-image': 'url("' + this.viewStory.story.image + '")'
    };
    return styles;
  }

  setLikeStyle() {
    let styles = {
      color: this.like ? '#03658c' : '#A6A6A6',
    };
    return styles;
  }
  setDislikeStyle() {
    let styles = {
      color: this.dislike ? 'red' : '#A6A6A6',
    };
    return styles;
  }

  refreshReaction() {
    if (this.login) {
      this.httpClient
        .get<CommonResponse>(
          environment.service_url + 'profile_story/' + this.sessionUser.id + '/story/' + this.storyId,
          this.httpOptions
        )
        .subscribe((data) => {
          this.like = data.profile.like;
          this.dislike = data.profile.dislike;
          this.setLikeStyle();
          this.setDislikeStyle();
        });
    } else {
      this.like = false;
      this.dislike = false;
    }
  }

  hitLike() {
    if (!this.login) {
      this._snackBar.open('Login to add like', '', {
        duration: 5000,
      });
      return;
    } else if (!this.like) {
      this.like = true;
      this.viewStory.story.like = this.viewStory.story.like + 1;
      if (this.dislike) {
        this.dislike = false;
        this.viewStory.story.dislike = this.viewStory.story.dislike - 1;
      }
      this.updateReaction();
      this.setLikeStyle();
      this.setDislikeStyle();
    }
  }

  hitDislike() {
    if (!this.login) {
      this._snackBar.open('Login to add dislike', '', {
        duration: 5000,
      });
      return;
    } else if (!this.dislike) {
      this.dislike = true;
      this.viewStory.story.dislike = this.viewStory.story.dislike + 1;
      if (this.like) {
        this.like = false;
        this.viewStory.story.like = this.viewStory.story.like - 1;
      }
      this.updateReaction();
      this.setLikeStyle();
      this.setDislikeStyle();
    }
  }

  updateReaction() {
    let updateReaction = {
      id: this.sessionUser.id,
      story_id: this.storyId,
      like: this.like
    };
    this.httpClient
      .post<CommonResponse>(environment.service_url + 'update_story_reaction', updateReaction, this.httpOptions)
      .subscribe((data) => {
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      try {
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
      } catch (e) { }
    }, 500);
  }

  addTag() {
    this.shareService.setFacebookTags(
      this.websiteUrl,
      this.viewStory.story.name,
      'Heart winning tamil novels - Great place to read novels',
      this.viewStory.story.image);
    this.linkService.createCanonicalURL(this.websiteUrl);
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
