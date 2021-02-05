import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { HttpClient } from '@angular/common/http';
import { EditStory, Categories, ViewStory, Constants, CommonResponse } from '../model/common';
import { Category } from '../model/category';
import { StoryEdit } from '../model/story';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService],
})
export class EditStoryComponent implements OnInit {
  show: boolean = false;
  login: boolean = false;
  editStory!: EditStory;
  nameControl!: FormControl;
  editStoryForm!: FormGroup;
  filteredStories!: Observable<StoryEdit[]>;
  selectedStory!: StoryEdit | null;
  stories: StoryEdit[] = [];
  categories: Category[] = [];
  viewStory!: ViewStory;
  alert: boolean = false;
  sessionUser: any = {};
  httpOptions = Constants.httpOptions;
  tools = Constants.tools;

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
        this.login = true;
        this.sessionUser = JSON.parse(cookieValue);
        this.onLogin();
      } else {
        this.login = false;
        this.router.navigate(['/login']);
        this.sessionUser = {};
      }
    });
  }

  ngOnInit(): void {
    this.httpClient
      .get<Categories>(environment.service_url + 'categories_all', this.httpOptions)
      .subscribe((data) => {
        this.categories = data.categories;
      });

    this.editStoryForm = this.formBuilder.group({
      name: this.nameControl,
      description: new FormControl(),
      category: new FormControl(),
      episode: new FormControl(),
      story: new FormControl(),
    });

  }

  onLogin() {
    if (this.login) {
      this.activatedRoute.params.subscribe((params) => {
        let storyId = params['storyId'];
        this.httpClient
          .get<EditStory>(
            environment.service_url + 'stories/author/' + this.sessionUser.id,
            this.httpOptions)
          .subscribe((data) => {
            this.editStory = data;
            if (this.editStory.stories.length == 0) {
              this.router.navigate(['/create-story']);
            }
            this.editStory.stories.forEach((storyObj) => {
              this.stories.push(storyObj);
            });
            this.filteredStories = this.nameControl.valueChanges.pipe(
              startWith(''),
              map((value) => (value ? this._filter(value) : this.stories))
            );
            this.show = true;
            this.selectStory(storyId);
          });
      });

      this.nameControl.valueChanges.subscribe((data) => {
        for (let x of this.editStory.stories) {
          if (x.story.name == data) {
            this.selectedStory = x;
            this.editStoryForm.patchValue({ description: x.story.description });
            this.editStoryForm.patchValue({
              story: '<p>Your story will be available shortly</p>',
            });
            this.editStoryForm.patchValue({ episode: 1 });
            this.editStoryForm.patchValue({ category: x.story.category_id });
            this.getFullStory(x);
            break;
          } else {
            this.selectedStory = null;
          }
        }
      });
    }
  }

  writeStory() {
    if (this.editStoryForm.invalid) {
      this._snackBar.open('Invalid data', 'Recheck form', {
        duration: 5000,
      });
      return;
    } else {
      let story = {
        id: this.sessionUser.id,
        story_id: this.viewStory.story.id,
        name: this.editStoryForm.value.name,
        image: this.editStoryForm.value.storyImage,
        description: this.editStoryForm.value.description,
        category_id: this.editStoryForm.value.category,
        story: this.editStoryForm.value.story,
        episode: this.editStoryForm.value.episode
      };

      this.httpClient
        .post<CommonResponse>(environment.service_url + 'edit_episode', story, this.httpOptions)
        .subscribe((data) => {
          if (data.response.code == 200) {
            this.alert = true;
            this.editStoryForm.reset();
            this._snackBar.open(data.response.message, '', {
              duration: 2000,
            });
            this.httpClient
              .get<EditStory>(
                environment.service_url + 'stories/author/' + this.sessionUser.id,
                this.httpOptions)
              .subscribe((data) => {
                this.editStory = data;
              });
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

  getFullStory(storyEdit: StoryEdit) {
    this.httpClient.get<ViewStory>(environment.service_url + 'story/' + storyEdit.story.id,
      this.httpOptions)
      .subscribe((data) => {
        this.viewStory = data;
        this.editStoryForm.patchValue({ story: this.viewStory.story.stories[0] });
      });
  }

  episodeChange(event: any) {
    let episodeno = event.target.value;
    this.editStoryForm.patchValue({
      story: this.viewStory.story.stories[episodeno - 1],
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  selectStory(id: string) {
    let preSelectStory!: StoryEdit;
    if (id == 'latest') {
      preSelectStory = this.editStory.stories[0];
    } else {
      for (let x of this.editStory.stories) {
        if (x.story.id == Number(id)) {
          preSelectStory = x;

        }
      }
    }
    this.selectedStory = preSelectStory;
    this.nameControl.setValue(preSelectStory.story.name);
    this.editStoryForm.patchValue({ description: preSelectStory.story.description });
    this.editStoryForm.patchValue({
      story: '<p>Your story will be available shortly</p>',
    });
    this.editStoryForm.patchValue({ episode: 1 });
    this.editStoryForm.patchValue({ category: preSelectStory.story.category_id });
    this.getFullStory(preSelectStory);
  }

  closeAlert() {
    this.alert = false;
  }
}
