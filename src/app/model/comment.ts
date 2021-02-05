import { Author } from './author';

export interface Comment {
  id: number;
  parentId: number;
  author_id: number;
  author: Author;
  commentedOn: string;
  likeCount: number;
  liked: boolean;
  addComment: boolean;
  authorComment: string;
  subComments: Comment[];
  isAuthor: boolean;
}
