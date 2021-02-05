import { Category } from './category';

export interface Story {
  id: number;
  author_id: number;
  name: string;
  image: string;
  description: string;
  lastModified: string;
  category_id: number;
  category: string;
  episode: string[];
  stories: string[];
  status: number;
  featured: boolean;
  featuredSelect: string;
  carouselSelect: string;
  selected: string;
  related: number[];
  carousel: boolean;
  like: number;
  dislike: number;
  rating: number;
  views: number;
}

export interface StoryEdit {
  story: Story;
  category: Category;
}
