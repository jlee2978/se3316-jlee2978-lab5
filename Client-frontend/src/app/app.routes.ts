import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { SongComponent } from './song/song.component';
import { UserComponent } from './user/user.component';
// import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

import { AdminGuard } from './admin.guard';

export const router: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login-email', component: EmailComponent },
    { path: 'song', component: SongComponent },
    { path: 'about', component: AboutComponent },
    { path: 'user', component: UserComponent, canActivate: [AdminGuard] },
    // { path: '**', component: PageNotFoundComponent }

]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);