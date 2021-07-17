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
  selector: 'app-meme-comp',
  templateUrl: './meme-comp.component.html',
  styleUrls: ['./meme-comp.component.css']
})
export class MemeCompComponent implements OnInit {

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
    this.show = true;
  }

  createStory = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    category: [''],
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
        description: 'meme',
        category_id: '17',
        story: '',
      };

      this.httpClient
        .post<CommonResponse>(environment.service_url + 'create_meme', story, this.httpOptions)
        .subscribe((data) => {
          if (data.response.code == 200) {
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
