import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryWiseStory, Constants } from '../model/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  show: boolean = false;
  categoryWiseStory!: CategoryWiseStory;
  noStories: boolean = true;
  httpOptions = Constants.httpOptions;

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      let categoryId = params['categoryId'];

      this.httpClient
        .get<CategoryWiseStory>(
          environment.service_url + 'stories/category/' + categoryId,
          this.httpOptions
        )
        .subscribe((data) => {
          this.categoryWiseStory = data;
          if (this.categoryWiseStory != null && this.categoryWiseStory.stories != null
            && this.categoryWiseStory.stories.length > 0) {
            this.noStories = false;
          }
          this.show = true;
        });
    });
  }
}
