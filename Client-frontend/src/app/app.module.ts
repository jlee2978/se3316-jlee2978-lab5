import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SongComponent } from './song/song.component';
import { UserComponent } from './user/user.component';
import { MaterialModule } from './material.module';
import { ApiService } from './api.service';
import { AuthenticationService } from './authentication.service';
import { AdminGuard } from './admin.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokeninterceptorService } from './tokeninterceptor.service';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from './../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { EmailComponent } from './email/email.component';
import {routes} from './app.routes';
import { ReviewdialogComponent } from './reviewdialog/reviewdialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AboutComponent,
    HomeComponent,
    PagenotfoundComponent,
    SongComponent,
    UserComponent,
    EmailComponent,
    ReviewdialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    routes
  ],
  entryComponents: [
    ReviewdialogComponent
  ],
  providers: [
    ApiService,
    AuthenticationService,
    AdminGuard,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },    // https://material.angular.io/components/dialog/overview (specifying global configuration defaults)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokeninterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
