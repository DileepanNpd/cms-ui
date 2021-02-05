import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Comment } from '../model/comment';
import { Comments, CommonResponse, Constants } from '../model/common';
import { Story } from '../model/story';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css'],
})
export class CommentBoxComponent implements OnInit {
  show: boolean = false;
  login: boolean = false;
  comments!: Comments;
  story!: Story;
  sessionUser: any = {};
  storyId!: string;
  alert_subhead: boolean = false;
  alert_head: boolean = false;
  createThread = this.formBuilder.group({
    usercomment: ['', Validators.required],
  });
  subThread = this.formBuilder.group({
    usercomment: ['', Validators.required],
  });
  httpOptions = Constants.httpOptions;

  isOpen = false;
  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _loginService: LoginService,
    private _snackBar: MatSnackBar
  ) {
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.login = true;
        this.sessionUser = JSON.parse(cookieValue);
        this.alert_head = false;
        this.alert_subhead = false;
        this.getComments();
      } else {
        this.login = false;
        this.sessionUser = {};
        this.getComments();
      }
    });
  }

  ngOnInit(): void {

  }

  getComments() {
    this.activatedRoute.params.subscribe((params) => {
      this.storyId = params['storyId'];
      let url = '';
      if (this.login) {
        url = environment.service_url + 'comments/story/' + this.storyId + '/author/' + this.sessionUser.id;
      } else {
        url = environment.service_url + 'comments/story/' + this.storyId;
      }
      this.httpClient
        .get<Comments>(url)
        .subscribe((data) => {
          this.comments = data;
          this.story = data.story;
          this.show = true;
        });
    });
  }

  get createThreadForm() {
    return this.createThread.controls;
  }
  get subThreadForm() {
    return this.subThread.controls;
  }

  hitLike(comment: Comment) {
    if (!this.login) {
      this._snackBar.open('Login to add comments', '', {
        duration: 5000,
      });
      return;
    } else {
      let updateReaction = {
        id: this.sessionUser.id,
        comment_id: comment.id,
        like: false
      };
      if (comment.liked) {
        comment.liked = false;
        updateReaction.like = false;
        comment.likeCount = comment.likeCount - 1;
      } else {
        comment.liked = true;
        updateReaction.like = true;
        comment.likeCount = comment.likeCount + 1;
      }
      this.httpClient
        .post<CommonResponse>(environment.service_url + 'update_reaction', updateReaction, this.httpOptions)
        .subscribe((data) => {
        });
    }

  }

  hitReply(comment: Comment) {
    comment.addComment = true;
  }

  setMyStyles(comment: Comment) {
    let styles = {
      color: comment.liked ? '#03658c' : '#A6A6A6',
    };
    return styles;
  }

  addComment(comment: Comment) {
    let addComment = {
      id: this.sessionUser.id,
      story_id: this.storyId,
      message: comment.authorComment,
      parent_id: comment.parentId
    };
    this.httpClient
      .post<CommonResponse>(environment.service_url + 'add_comment', addComment, this.httpOptions)
      .subscribe((data) => {
        comment.id = data.comment.id;
        if (data.comment.author_id === this.story.author_id) {
          comment.isAuthor = true;
        }
      });
  }

  createThreadComment() {
    if (this.createThread.invalid) {
      this._snackBar.open('comments should not be empty', '', {
        duration: 5000,
      });
      return;
    } else {
      if (!this.login) {
        this.alert_head = true;
        return;
      }
      this.alert_head = false;
      let newComment = {} as Comment;
      newComment.author = this.sessionUser.author;
      newComment.commentedOn = 'now';
      newComment.likeCount = 0;
      newComment.liked = false;
      newComment.addComment = false;
      newComment.authorComment = this.createThreadForm.usercomment.value;
      newComment.parentId = 0;
      this.addComment(newComment);
      this.comments.comments.push(newComment);
      this.createThread.reset();
    }
  }

  addSubThreadComment(comment: Comment) {
    if (this.subThread.invalid) {
      this._snackBar.open('comments should not be empty', '', {
        duration: 5000,
      });
      return;
    } else {
      if (!this.login) {
        this.alert_subhead = true;
        return;
      }
      this.alert_subhead = false;
      let newComment = {} as Comment;
      newComment.author = this.sessionUser.author;
      newComment.commentedOn = 'now';
      newComment.likeCount = 0;
      newComment.liked = false;
      newComment.addComment = false;
      newComment.authorComment = this.subThreadForm.usercomment.value;
      newComment.parentId = comment.id;
      this.addComment(newComment);
      if (comment.subComments == null) {
        comment.subComments = [];
        comment.subComments.push(newComment);
      } else {
        comment.subComments.push(newComment);
      }
      comment.addComment = false;

      this.subThread.reset();
    }
  }
}
