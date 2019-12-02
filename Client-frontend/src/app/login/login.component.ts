import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../authentication.service';
import { ApiService } from './../api.service';
import { IUser } from './../user';
import { IResponse } from './../response';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private error: string;
  private user: IUser;
  private response: IResponse;
  private errorMessage: string;
  private successMessage: string;

  constructor(private authService: AuthenticationService, public apiService: ApiService, private router: Router) { }

  loginGoogle() {

    this.authService.loginGoogle().then(result => {
      // Get Google Access Token in case need to access the API
      var token = result.credential.accessToken;

      // The signed-in user info
      var user = result.user;

      this.apiService.getUsers(user.email).subscribe(response => {
        if (response.user.length > 0) {

          let user = response.user[0];

          // Google doesn't provide password for security purpose so we set it to null and skip verification
          let credential = { email: user.loginid, password: null, verifyPassword: 'N' };
          this.login(credential, user.role, user.status);

        }
        else {
          let newUser = { loginid: user.email, password: null, role: 'user', status: 'A' };

          this.apiService.createUser(newUser).subscribe(response => {
            // Google doesn't provide password for security purpose so we set it to null and skip verification						
            let credential = { email: response.user.loginid, password: null, verifyPassword: 'N' };
            this.login(credential, response.user.role, response.user.status);
          },
            error => { }

          )
        }
      },
        error => { }
      )
    })
  }

  login(credential, role, status) {
    this.authService.login(credential).subscribe(response => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userid', credential.email);
      localStorage.setItem('userrole', role);
      localStorage.setItem('userstatus', status);

      if (role == 'admin') {
        this.router.navigateByUrl('/user');
      }
      else {
        if (status !== 'A') {
          this.errorMessage = 'Your account is deactivated, please contact site administrator';
        }
        else {
          this.router.navigateByUrl('/song');
        }
      }

    }, error => { })
  }


  ngOnInit() {
  }

}
