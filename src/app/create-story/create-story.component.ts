import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, } from '@syncfusion/ej2-angular-richtexteditor';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category';
import { Categories, CommonResponse, Constants } from '../model/common';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-story',
  templateUrl: './create-story.component.html',
  styleUrls: ['./create-story.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService],
})
export class CreateStoryComponent implements OnInit {
  show: boolean = false;
  alert: boolean = false;
  login: boolean = false;
  sessionUser: any = {};
  selectedFile!: any;
  categories: Category[] = [];
  httpOptions = Constants.httpOptions;
  tools = Constants.tools;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private _loginService: LoginService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.login = true;
        this.sessionUser = JSON.parse(cookieValue);
      } else {
        this.login = false;
        this.router.navigate(['/login']);
        this.sessionUser = {};
      }
    });
  }

  ngOnInit(): void {
    this.httpClient
      .get<Categories>('assets/api/categories_all.json', this.httpOptions)
      .subscribe((data) => {
        this.categories = data.categories;
        this.show = true;
      });
  }

  createStory = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    episode: [''],
    story: [''],
    storyImage: [''],
  });

  writeStory() {
    if (this.createStory.invalid) {
      this._snackBar.open('Story details missing', '', {
        duration: 5000,
      });
      return;
    } else {
      let story = {
        id: this.sessionUser.id,
        name: this.createStory.value.name,
        image: this.selectedFile,
        description: this.createStory.value.description,
        category_id: this.createStory.value.category,
        story: this.createStory.value.story,
      };

      this.httpClient
        .post<CommonResponse>(environment.service_url + 'create_story', story, this.httpOptions)
        .subscribe((data) => {
          if(data.response.code == 200) {
            this.alert = true;
            this._snackBar.open(data.response.message, '', {
              duration: 2000,
            });
            this.createStory.reset();
          } else {
            this._snackBar.open(data.response.message, '', {
              duration: 5000,
            });
          }
          
        });
    }
  }

  onFileSelected(event: any) {
    let file = <File>event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedFile = reader.result;
    };
  }

  closeAlert() {
    this.alert = false;
  }
}
