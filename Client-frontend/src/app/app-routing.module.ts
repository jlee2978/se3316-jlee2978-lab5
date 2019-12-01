import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './about/about.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {UserComponent} from './user/user.component';
import {PagenotfoundComponent} from './pagenotfound/pagenotfound.component';
import {SignupComponent} from './signup/signup.component';
import {SongComponent} from './song/song.component';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Home', component: HomeComponent },
  { path: 'About', component: AboutComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'User', component: UserComponent, canActivate: [AdminGuard] },
  { path: 'Song', component: SongComponent },
  { path: 'Pagenotfound', component: PagenotfoundComponent },
  { path: 'Signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
