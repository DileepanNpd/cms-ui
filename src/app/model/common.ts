import { Category } from './category';
import { Author } from './author';
import { Story, StoryEdit } from './story';
import { Comment } from './comment';
import { HttpHeaders } from '@angular/common/http';
import { Profile } from './profile';

export interface Tile {
  story: Story;
  author: Author;
  category: Category;
}

export interface FeaturePostList {
  stories: Tile[];
}

export interface RecentPostList {
  stories: Tile[];
}

export interface Categories {
  categories: Category[];
}

export interface hcCategories {
  0: Categories;
  2: Categories;
}

export interface ViewStory {
  story: Story;
  author: Author;
  category: Category;
  relatedStories: Tile[];
}

export interface EditStory {
  stories: StoryEdit[];
  author: Author;
}

export interface CategoryWiseStory {
  category: Category;
  stories: Tile[];
}

export interface Comments {
  story: Story;
  comments: Comment[];
}

export interface ProfileUpdateData {
  name: string;
  description: string;
}
export interface Error {
  code: number;
  message: string;
}

export interface CommonResponse {
  profile: Profile;
  comment: Comment;
  response: Error;
}

export interface Rating {
  id: number,
  author: Author,
  description: string,
  rating: number,
  commentedOn: string
}

export interface RatingCount {
  star_5: number,
  star_4: number,
  star_3: number,
  star_2: number,
  star_1: number,
  total_reviews: number
}

export interface RatingsList {
  story: Story;
  rating: Rating[],
  ratingCount: RatingCount
}

export const Constants = {
  tools: {
    items: [
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      '|',
      'FontName',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      '|',
      'LowerCase',
      'UpperCase',
      '|',
      'Undo',
      'Redo',
      '|',
      'Formats',
      'Alignments',
      '|',
      'OrderedList',
      'UnorderedList',
      '|',
      'Indent',
      'Outdent',
      '|',
      'CreateLink',
      'SubScript',
      'SuperScript',
      'Image',
      'ClearFormat',
      'FullScreen',
      'SourceCode'
    ],
  },
  httpOptions: {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Accept: 'appplication/json',
      userid: '1',
    }),
  }
}