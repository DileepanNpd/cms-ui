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
  { path: ':category/கதை/:author/:storyId/:storyName', component: StoryComponent },
  { path: ':category/கதை/:author/:storyId/:storyName/:episode', component: StoryComponent },
  { path: 'story/:storyId', component: StoryComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'create-story', component: CreateStoryComponent, canActivate: [AuthGuard] },
  { path: 'edit-story/:storyId', component: EditStoryComponent, canActivate: [AuthGuard] },
  { path: 'add-episode/:storyId', component: AddEpisodeComponent, canActivate: [AuthGuard] },
  { path: 'author/:authorId', component: AuthorComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
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
