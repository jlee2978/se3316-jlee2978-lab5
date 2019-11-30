import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './about/about.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {MembersComponent} from './members/members.component';
import {PagenotfoundComponent} from './pagenotfound/pagenotfound.component';
import {SignupComponent} from './signup/signup.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'About', component: AboutComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Members', component: MembersComponent },
  { path: 'Pagenotfound', component: PagenotfoundComponent },
  { path: 'Signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
