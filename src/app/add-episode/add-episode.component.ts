import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { HttpClient } from '@angular/common/http';
import { EditStory, Categories, ViewStory, Constants, CommonResponse } from '../model/common';
import { Category } from '../model/category';
import { StoryEdit } from '../model/story';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-episode',
  templateUrl: './add-episode.component.html',
  styleUrls: ['./add-episode.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService],
})
export class AddEpisodeComponent implements OnInit {
  show: boolean = false;
  login: boolean = false;
  addStory!: EditStory;
  nameControl!: FormControl;
  addEpisodeForm!: FormGroup;
  filteredStories!: Observable<StoryEdit[]>;
  selectedStory!: StoryEdit | null;
  stories: StoryEdit[] = [];
  categories: Category[] = [];
  viewStory!: ViewStory;
  alert: boolean = false;
  sessionUser: any = {};
  httpOptions = Constants.httpOptions;
  tools = Constants.tools;
  public fontSize: Object = {
    default: "14pt", // to define default font-family
    items: [
      { text: "8", value: "8pt" },
      { text: "10", value: "10pt" },
      { text: "12", value: "12pt" },
      { text: "14", value: "14pt" },
      { text: "16", value: "16pt" },
      { text: "18", value: "18pt" },
      { text: "20", value: "20pt" },
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _loginService: LoginService,
    private router: Router
  ) {
    this.nameControl = new FormControl();
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.sessionUser = JSON.parse(cookieValue);
        this.login = true;
        this.onLoginIn();
      } else {
        this.sessionUser = {};
        this.router.navigate(['/login']);
        this.login = false;
      }
    });
  }

  onLoginIn() {
    if (this.login) {
      this.activatedRoute.params.subscribe((params) => {
        let storyId = params['storyId'];
        this.httpClient
          .get<EditStory>(environment.service_url + 'stories/author/' + this.sessionUser.id,
            this.httpOptions)
          .subscribe((data) => {
            this.addStory = data;
            if (this.addStory.stories.length == 0) {
              this.router.navigate(['/create-story']);
            }
            this.addStory.stories.forEach((storyObj) => {
              this.stories.push(storyObj);
            });
            this.filteredStories = this.nameControl.valueChanges.pipe(
              startWith(''),
              map((value) => (value ? this._filter(value) : this.stories))
            );
            this.selectStory(storyId);
            this.show = true;
          });
      });
      this.nameControl.valueChanges.subscribe((data) => {
        for (let x of this.stories) {
          if (x.story.name == data) {
            this.selectedStory = x;
            this.addEpisodeForm.patchValue({ description: x.story.description });
            this.addEpisodeForm.patchValue({ category: x.story.category_id });
            this.getNewEpisodeno(x);
            break;
          } else {
            this.selectedStory = null;
          }
        }
      });

      this.addEpisodeForm = this.formBuilder.group({
        name: this.nameControl,
        description: new FormControl(),
        category: new FormControl(''),
        episode: new FormControl(''),
        story: new FormControl(''),
      });
    }
  }

  ngOnInit(): void {
    this.httpClient
      .get<Categories>('assets/api/categories_all.json', this.httpOptions)
      .subscribe((data) => {
        this.categories = data.categories;
      });
  }

  writeStory() {
    if (this.addEpisodeForm.invalid) {
      this._snackBar.open('Invalid details entered', '', {
        duration: 5000,
      });
      return;
    } else {
      let story = {
        id: this.sessionUser.id,
        story_id: this.viewStory.story.id,
        name: this.addEpisodeForm.value.name,
        image: this.addEpisodeForm.value.storyImage,
        description: this.addEpisodeForm.value.description,
        category_id: this.addEpisodeForm.value.category,
        story: this.addEpisodeForm.value.story,
        episode: this.addEpisodeForm.value.episode
      };

      this.httpClient
        .post<CommonResponse>(environment.service_url + 'add_episode', story, this.httpOptions)
        .subscribe((data) => {
          if (data.response.code == 200) {
            this.alert = true;
            this._snackBar.open(data.response.message, '', {
              duration: 2000,
            });
            this.addEpisodeForm.reset();
          } else {
            this._snackBar.open(data.response.message, '', {
              duration: 5000,
            });
          }
        });
    }
  }

  private _filter(value: string): StoryEdit[] {
    const filterValue = value.toLowerCase();
    return this.stories.filter(
      (story) => story.story.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  getNewEpisodeno(storyEdit: StoryEdit) {
    this.httpClient.get<ViewStory>(
      environment.service_url + 'story/' + storyEdit.story.id, this.httpOptions)
      .subscribe((data) => {
        this.viewStory = data;
        this.addEpisodeForm.patchValue({
          episode: data.story.episode.length + 1,
        });
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  closeAlert() {
    this.alert = false;
  }

  selectStory(id: string) {
    let preSelectStory!: StoryEdit;
    if (id == 'latest') {
      preSelectStory = this.addStory.stories[0];
    } else {
      for (let x of this.addStory.stories) {
        if (x.story.id == Number(id)) {
          preSelectStory = x;
        }
      }
    }
    this.selectedStory = preSelectStory;
    this.nameControl.setValue(preSelectStory.story.name);
    this.addEpisodeForm.patchValue({ description: preSelectStory.story.description });
    this.addEpisodeForm.patchValue({ category: preSelectStory.story.category_id });
    this.getNewEpisodeno(preSelectStory);
  }

}
