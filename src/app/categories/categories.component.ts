import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Category } from '../model/category';
import { Categories, Constants } from '../model/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  show: boolean = false;
  categories: Category[] = [];
  httpOptions = Constants.httpOptions;
  constructor(private httpClient: HttpClient,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      let categoryId = params['categoryId'];
      if(categoryId == undefined){
        categoryId = 0;
      }
      this.httpClient
        .get<Categories>(environment.service_url + 'categories/' + categoryId , this.httpOptions)
        .subscribe((data) => {
          this.categories = data.categories;
          this.show = true;
        });
    });
  }
}
