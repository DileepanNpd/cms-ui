import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EditStory, Constants, CommonResponse } from '../model/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Profile } from '../model/profile';
import { Author } from '../model/author';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  sessionUser: any = {};
  cookie: string = "";
  show = {
    profile: false,
    story: false,
    error: false
  };

  login: boolean = true;
  authorStories!: EditStory;
  profile!: Profile;
  author: Author = {} as Author;
  httpOptions = Constants.httpOptions;

  constructor(private activatedRoute: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      let authorId = params['authorId'];
      this.httpClient.get<CommonResponse>(
        environment.service_url + 'profile_author/' + authorId,
        this.httpOptions
      ).subscribe(
        (data) => {
          if (data.response == null || (data.response.code != 500 && data.response.code != 404)) {
            this.show.error = false;
            this.profile = data.profile;
            this.author.id = this.profile.id;
            this.author.name = this.profile.name;
            this.author.image = this.profile.image;
            this.show.profile = true;
            this.httpClient.get<EditStory>(
              environment.service_url + 'stories/author/' + this.profile.login_id,
              this.httpOptions
            ).subscribe(
              (data) => {
                this.authorStories = data;
                this.show.story = true;
              },
              (err) => {
                console.log(err);
              }
            );
          } else {
            this.show.error = true;
            this.show.story = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    });

  }



}
