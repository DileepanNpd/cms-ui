import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category';
import { Categories, Constants } from '../model/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-highlights',
  templateUrl: './category-highlights.component.html',
  styleUrls: ['./category-highlights.component.css'],
})
export class CategoryHighlightsComponent implements OnInit {
  show: boolean = false;
  categories: Category[] = [];
  httpOptions = Constants.httpOptions;
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient
      .get<Categories>(environment.service_url + 'categories', this.httpOptions)
      .subscribe((data) => {
        this.categories = data.categories;
        this.show = true;
      });
  }
}
