import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { IUser } from './user';
import { serverUrl } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url = serverUrl;
  public user: IUser;
  public role: string;

  constructor(public afAuth: AngularFireAuth, private router: Router, private http: HttpClient) { }

  loggedIn() {
    // if token exists, return true; return false otherwise
    return !!localStorage.getItem('token');
  }

  getLoginId() {
    return localStorage.getItem('userid');
  }

  getLoginRole() {
    return localStorage.getItem('userrole');
  }

  getLoginStatus() {
    return localStorage.getItem('userstatus');
  }

  setUser(user) {
    this.user = user;
  }

  logout() {
    firebase.auth().signOut();

    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('userrole');
    localStorage.removeItem('userstatus');

    this.router.navigate(['/song']);
  }

  getToken() {
    let token = localStorage.getItem('token');
    return token;
  }

  login(user): Observable<any> {
    return this.http.post<any>(this.url + "login", user);
  }

  // https://angular-templates.io/tutorials/about/firebase-authentication-with-angular
  // for loginFb(), loginGoogle(), and signUp(user) methods

  loginFb() {
    return new Promise<any>((resolve, reject) => {

      let provider = new firebase.auth.FacebookAuthProvider();

      this.afAuth.auth.signInWithPopup(provider)
        .then(res => {
          //this.user.loginid = res.additionalUserInfo.profile.email;
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }

  // external login via third party (Google)
  loginGoogle() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }

  signUp(user) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

}