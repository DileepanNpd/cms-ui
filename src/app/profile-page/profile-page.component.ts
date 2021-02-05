import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EditStory, Constants, CommonResponse } from '../model/common';
import { SocialUser, SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { Profile } from '../model/profile';
import { Author } from '../model/author';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  sessionUser: any = {};
  cookie: string = "";
  show = {
    profile: false,
    story: false,
    imageError: false
  };
  selectedFile!: any;
  login: boolean = false;
  user!: SocialUser;
  authorStories!: EditStory;
  profile!: Profile;
  author: Author = {} as Author;
  closeResult!: string;
  profileForm!: FormGroup;
  httpOptions = Constants.httpOptions;

  constructor(
    private authService: SocialAuthService,
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private _loginService: LoginService,
    private _snackBar: MatSnackBar
  ) {
    this._loginService.cookieValue.subscribe((cookieValue) => {
      if (cookieValue != '') {
        this.login = true;
        this.sessionUser = JSON.parse(cookieValue);
        this.onLogin();
      } else {
        this.login = false;
        this.sessionUser = {};
      }
    });
  }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      name: new FormControl(),
      description: new FormControl(),
      storyImage: new FormControl()
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((response) => {
    }).catch(e => {
      alert('Please enable cookies & refresh the page, you will be signed in with google');
    });
  }

  onLogin() {
    if (this.login) {
      this.httpClient.get<CommonResponse>(
        environment.service_url + 'profile/' + this.sessionUser.id,
        this.httpOptions
      ).subscribe(
        (data) => {
          this.profile = data.profile;
          this.author.id = this.profile.id;
          this.author.name = this.profile.name;
          this.author.image = this.profile.image;
          this.profileForm.patchValue({ name: this.profile.poetic_name });
          this.profileForm.patchValue({ description: this.profile.description });
          this.show.profile = true;
          this.httpClient.get<EditStory>(
            environment.service_url + 'stories/author/' + this.sessionUser.id,
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
        },
        (err) => {
          console.log(err);
        }
      );
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

  updateProfile() {

    let story = {
      id: this.sessionUser.id,
      name: this.profileForm.value.name,
      description: this.profileForm.value.description,
      image: this.selectedFile
    };

    this.httpClient
      .put<CommonResponse>(environment.service_url + 'update_profile', story, this.httpOptions)
      .subscribe((data) => {
        this._snackBar.open('updated successfully', '', {
          duration: 2000,
        });
        this.profile.poetic_name = data.profile.poetic_name;
        this.profile.description = data.profile.description;
        this.profile.image = data.profile.image
      });

  }

  onFileSelected(event: any) {
    let file = <File>event.target.files[0];
    if (file.size > 100000) {
      this.show.imageError = true;
      return;
    } else {
      this.show.imageError = false;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedFile = reader.result;
      };
    }
  }

  copyLink(category: any, author: any, id: any, name: any) {
    let text = environment.domain_url + category + "/கதை/" + author + "/" + id + "/" + name + "/";
    return text;
  }
}
