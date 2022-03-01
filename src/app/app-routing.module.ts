import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AddEpisodeComponent } from './add-episode/add-episode.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { AuthorComponent } from './author/author.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { ContactComponent } from './contact/contact.component';
import { CreateStoryComponent } from './create-story/create-story.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditStoryComponent } from './edit-story/edit-story.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { MemeCompComponent } from './meme-comp/meme-comp.component';
import { PollComponent } from './poll/poll.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RedirectAlwaysComponent } from './redirect-always/redirect-always.component';
import { StoriesComponent } from './stories/stories.component';
import { StoryComponent } from './story/story.component';

const routes: Routes = [
  // { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'categories/:categoryId', component: CategoriesComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'rating/:storyId', component: RatingsComponent },
  { path: ':category/redirect/:author/:storyId/:storyName/:episode', component: RedirectAlwaysComponent },
  { path: ':category/redirect/:author/:storyId/:storyName', component: RedirectAlwaysComponent },
  { path: 'stories', component: StoriesComponent },
  { path: 'admin-portal', component: AdminPortalComponent },
  { path: 'category/:categoryId', component: CategoryComponent },
  { path: 'story/:storyId', component: StoryComponent },
  { path: 'story/:storyId/:storyName/episode/:episode', component: StoryComponent },
  { path: 'story/:storyId/:storyName', component: StoryComponent },
  { path: 'story/:storyId/episode/:episode', component: StoryComponent },
  { path: 'author/:authorId', component: AuthorComponent },
  { path: ':storyName/:storyId', component: StoryComponent },
  { path: ':storyName/:storyId/:episode', component: StoryComponent },
  { path: ':category/கதை/:author/:storyId/:storyName', component: RedirectAlwaysComponent },
  { path: ':category/கதை/:author/:storyId/:storyName/:episode', component: RedirectAlwaysComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'create-story', component: CreateStoryComponent, canActivate: [AuthGuard] },
  { path: 'create-meme', component: MemeCompComponent, canActivate: [AuthGuard] },
  { path: 'கதை/கதை/edit-story/:storyId', component: EditStoryComponent, canActivate: [AuthGuard] },
  { path: 'கதை/கதை/add-episode/:storyId', component: AddEpisodeComponent, canActivate: [AuthGuard] },
  { path: 'poll', component: PollComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'privacy', component: PrivacyComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'top',
      useHash: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
