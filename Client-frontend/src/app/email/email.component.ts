import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './../api.service';
import { IUser } from './../user';
import { IResponse } from './../response';
import { AuthenticationService } from './../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  @ViewChild('emailInput', { static: false }) emailInput: ElementRef;

  private errorMessage: string;
  private successMessage: string;
  emailForm: FormGroup;
  private user: IUser;
  private response: IResponse;
  private token: string;

  constructor(public authService: AuthenticationService, private apiService: ApiService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    }
    );
  }

  ngAfterViewInit() {
    this.emailInput.nativeElement.focus();
  }

  loginEmail(formUser) {

    this.errorMessage = "";

    if (!this.validateEmail(formUser.email)) {
      this.errorMessage = "Email is missing or format is invalid!";
      return;
    }

    if (!formUser.password) {
      this.errorMessage = "password is required";
      return;
    }

    formUser.email = this.sanitize(formUser.email);
    formUser.password = this.sanitize(formUser.password);

    let user = { email: formUser.email, password: formUser.password, verifyPassword: 'Y' };

    this.authService.login(user).subscribe(
      response => {
        this.response = response;

        this.token = response.token;

        localStorage.setItem('token', this.token);

        this.apiService.getUsers(user.email).subscribe(response => {

          let user = response.user[0];


          localStorage.setItem('userid', user.loginid);
          localStorage.setItem('userrole', user.role);
          localStorage.setItem('userstatus', user.status);

          this.user = user;
          this.authService.setUser(this.user);

          if (this.user.role == 'admin') {
            this.router.navigateByUrl('/user');
          }
          else {
            if (user.status !== 'A') {
              this.errorMessage = 'Your account is deactivated, please contact administrator!';
            }
            else {
              this.router.navigateByUrl('/song');
            }
          }
        })
      }, error => {
        this.errorMessage = error.error;
        console.log('Error: ' + error);
      }
    );
  }

  validateEmail(email) {
    if (!email) {
      return false;
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return (true)
    }

    return (false)
  }

  // Sanitize data to prevent injection attacks
  sanitize(data: any) {
    return data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

}
