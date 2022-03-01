import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Category } from '../model/category';
import { Categories, Constants, hcCategories } from '../model/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  show: boolean = false;
  categories: Category[] = [];
  httpOptions = Constants.httpOptions;
  data_ad_client: string = environment.data_ad_client;
  data_ad_slot1: string = environment.data_ad_slot1;
  constructor(private httpClient: HttpClient,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      let categoryId = params['categoryId'];
      if(categoryId == undefined){
        categoryId = 0;
      }
      this.httpClient
        .get<hcCategories>("assets/api/categories.json" , this.httpOptions)
        .subscribe((data) => {
          if(categoryId == 0) {
            this.categories = data[0].categories;
          } else {
            this.categories = data[5].categories;  
          }
          this.show = true;
        });
    });
  }
}
