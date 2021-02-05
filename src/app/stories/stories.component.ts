import { Component, OnInit } from '@angular/core';
import { RecentPostList, Tile, Constants } from '../model/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Author } from '../model/author';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  allPosts!: Tile[];
  allStories: Tile[] = [];
  authors: Author[] = [];
  show: boolean = false;
  display: boolean = true;
  httpOptions = Constants.httpOptions;
  nameControl!: FormControl;
  authorControl!: FormControl;
  searchForm!: FormGroup;
  filteredStories!: Observable<Tile[]>;
  filteredAuthors!: Observable<Author[]>;

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) {
    this.nameControl = new FormControl();
    this.authorControl = new FormControl();
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      name: this.nameControl,
      author: this.authorControl
    });
    this.httpClient
      .get<RecentPostList>(
        environment.service_url + 'stories',
        this.httpOptions
      ).subscribe((data) => {
        this.allPosts = data.stories;
        if (data.stories.length > 0) {
          this.show = true;
        } else {
          this.display = false;
        }
        this.allPosts.forEach((storyObj) => {
          this.allStories.push(storyObj);
          if (this.authors.findIndex(author => author.id === storyObj.author.id) == -1) {
            this.authors.push(storyObj.author);
          }
        });

        this.filteredStories = this.nameControl.valueChanges.pipe(
          startWith(''),
          map((value) => (value ? this._filterStory(value) : this.allStories))
        );
        this.filteredAuthors = this.authorControl.valueChanges.pipe(
          startWith(''),
          map((value) => (value ? this._filterAuthor(value) : this.authors))
        );
      });
  }

  private _filterStory(value: string): Tile[] {
    const filterValue = value.toLowerCase();
    return this.allStories.filter(
      (tile) => tile.story.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterAuthor(value: string): Author[] {
    const filterValue = value.toLowerCase();
    return this.authors.filter(
      (author) => author.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  searchStories() {
    this.allStories = this.allPosts;
    let storyname = this.searchForm.value.name;
    let authorname = this.searchForm.value.author;
    if (storyname != null && storyname != '' && authorname != null && authorname != '') {
      this.allStories = this.searchByStory(storyname, this.allStories);
      this.allStories = this.searchByAuthor(authorname, this.allStories);
    } else if (storyname != null && storyname != '') {
      this.allStories = this.searchByStory(storyname, this.allStories);
    } else if (authorname != null && authorname != '') {
      this.allStories = this.searchByAuthor(authorname, this.allStories);
    } else {
      this.allStories;
    }
  }
  clearSearch() {
    this.allStories = this.allPosts;
    this.searchForm.reset();
  }

  private searchByStory(storyname: String, stories: Tile[]) {
    let searchStories: Tile[] = [];
    stories.forEach((story) => {
      if (story.story.name == storyname) {
        searchStories.push(story);
      }
    })
    return searchStories;
  }

  private searchByAuthor(authorname: String, stories: Tile[]) {
    let searchStories: Tile[] = [];
    stories.forEach((story) => {
      if (story.author.name == authorname) {
        searchStories.push(story);
      }
    })
    return searchStories;
  }
}
