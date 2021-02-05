import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RatingsList, Constants, CommonResponse } from '../model/common';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
  sessionUser: any = {};
  login: boolean = false;
  httpOptions = Constants.httpOptions;
  ratingList!: RatingsList;
  show: boolean = false;
  closeResult!: string;
  ctrl = new FormControl(null, Validators.required);
  reviewForm!: FormGroup;
  storyId!: number;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute, private _loginService: LoginService, private _snackBar: MatSnackBar) {
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.login = true;
        this.sessionUser = JSON.parse(cookieValue);
      } else {
        this.login = false;
        this.sessionUser = {};
      }
    });
  }

  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      star: this.ctrl,
      description: new FormControl()
    });
    this.getRatings();
  }

  getRatings() {
    this.activatedRoute.params.subscribe((params) => {
      this.storyId = params['storyId'];
      this.httpClient.get<RatingsList>
        (
          environment.service_url + 'review_story/' + this.storyId,
          this.httpOptions
        ).subscribe(data => {
          this.ratingList = data;
          this.show = true;
        });
    });
  }

  setMyStyles(id: number) {
    let width = 0;
    if (id == 5) {
      width = (this.ratingList.ratingCount.star_5 / this.ratingList.ratingCount.total_reviews) * 100;
    } else if (id == 4) {
      width = (this.ratingList.ratingCount.star_4 / this.ratingList.ratingCount.total_reviews) * 100;
    } else if (id == 3) {
      width = (this.ratingList.ratingCount.star_3 / this.ratingList.ratingCount.total_reviews) * 100;
    } else if (id == 2) {
      width = (this.ratingList.ratingCount.star_2 / this.ratingList.ratingCount.total_reviews) * 100;
    } else if (id == 1) {
      width = (this.ratingList.ratingCount.star_1 / this.ratingList.ratingCount.total_reviews) * 100;
    }
    let styles = {
      width: width + "%",
    };
    return styles;
  }

  updateReview() {
    if (this.reviewForm.invalid) {
      this._snackBar.open('comments should not be empty', '', {
        duration: 2000,
      });
    } else {
      if (!this.login) {
        this._snackBar.open('Login to add review', '', {
          duration: 2000,
        });
        return;
      } else {
        let reviewStory = {
          id: this.sessionUser.id,
          story_id: this.storyId,
          star: this.reviewForm.value.star,
          description: this.reviewForm.value.description
        };
        this.httpClient
          .post<CommonResponse>(environment.service_url + 'review_story', reviewStory, this.httpOptions)
          .subscribe((data) => {
            if (data.response.code == 200) {
              this._snackBar.open(data.response.message, '', {
                duration: 2000,
              });
              this.show = false;
              this.reviewForm.reset();
              this.getRatings();
            } else {
              this._snackBar.open(data.response.message, '', {
                duration: 2000,
              });
            }
          });
      }
    }

  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
