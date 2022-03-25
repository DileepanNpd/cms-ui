import { Component, OnInit } from '@angular/core';
import { Tile, FeaturePostList, Constants } from '../model/common';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { LocalstorageService } from '../services/localstorage.service';
@Component({
  selector: 'app-feature-post',
  templateUrl: './feature-post.component.html',
  styleUrls: ['./feature-post.component.css'],
})
export class FeaturePostComponent implements OnInit {
  featurePosts!: Tile[];
  show: boolean = false;
  display: boolean = true;
  httpOptions = Constants.httpOptions;
  tmpStore : LocalstorageService;
  constructor(private httpClient: HttpClient, private storage : LocalstorageService) {
    this.tmpStore = storage;
   }

  ngOnInit(): void {
    let carouselStoriesFlag = this.tmpStore.getItem("featurePostsFlag");
    if (carouselStoriesFlag != null && carouselStoriesFlag != undefined && carouselStoriesFlag == "true") {
      this.featurePosts = JSON.parse(this.tmpStore.getItem('featurePosts'));
      this.show = true;
    } else {
      this.httpClient
        .get<FeaturePostList>(
          environment.service_url + 'feature_posts',
          this.httpOptions
        )
        .subscribe((data) => {
          this.featurePosts = data.stories;
          if (data.stories != undefined && data.stories.length > 0) {
            this.tmpStore.setItem('featurePosts', JSON.stringify(data.stories));
            this.tmpStore.setItem('featurePostsFlag', "true");
            this.show = true;
          } else {
            this.display = false;
          }
        });
    }
  }
}
