import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CategoryComponent } from './category/category.component';
import { HeroComponent } from './hero/hero.component';
import { CategoryHighlightsComponent } from './category-highlights/category-highlights.component';
import { FeaturePostComponent } from './feature-post/feature-post.component';
import { RecentPostComponent } from './recent-post/recent-post.component';
import { StayInTouchComponent } from './stay-in-touch/stay-in-touch.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavResponsiveComponent } from './sidenav-responsive/sidenav-responsive.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { StoryComponent } from './story/story.component';

import { JwPaginationModule } from 'jw-angular-pagination';
import { CommentBoxComponent } from './comment-box/comment-box.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CreateStoryComponent } from './create-story/create-story.component';
import { EditStoryComponent } from './edit-story/edit-story.component';
import { CookieService } from 'ngx-cookie-service';
import { AddEpisodeComponent } from './add-episode/add-episode.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoginService } from './services/login.service';
import { StoriesComponent } from './stories/stories.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { AuthorComponent } from './author/author.component';
import { CarouselComponent } from './carousel/carousel.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RedirectAlwaysComponent } from './redirect-always/redirect-always.component';
import { DemoMaterialModule } from './material.module';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CategoriesComponent,
    AboutComponent,
    ContactComponent,
    CategoryComponent,
    HeroComponent,
    CategoryHighlightsComponent,
    FeaturePostComponent,
    RecentPostComponent,
    StayInTouchComponent,
    LoginComponent,
    SidenavResponsiveComponent,
    StoryComponent,
    CommentBoxComponent,
    MyAccountComponent,
    ProfilePageComponent,
    CreateStoryComponent,
    EditStoryComponent,
    AddEpisodeComponent,
    StoriesComponent,
    AdminPortalComponent,
    AuthorComponent,
    CarouselComponent,
    RatingsComponent,
    RedirectAlwaysComponent
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'ng-universal-demystified'
    }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    JwPaginationModule,
    RichTextEditorAllModule,
    SocialLoginModule,
    NgbModule
    //MatNativeDateModule
  ],
  providers: [
    AuthGuard,
    CookieService,
    LoginService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '78898657335-sbi9oub9h2adh2u41btds1hpao27sob0.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);
