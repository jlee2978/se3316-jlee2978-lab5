import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from './../authentication.service';
import { Router } from '@angular/router';
import { ApiService } from './../api.service';
import { IUser } from './../user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

// modelled off of email component

export class SignupComponent implements OnInit {
  @ViewChild('emailInput', { static: false }) emailInput: ElementRef;

  private errorMessage: string;
  private successMessage: string;
  registerForm: FormGroup;
  private user: IUser;

  constructor(private apiService: ApiService, public authService: AuthenticationService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    }
    );
  }

  signUp(formUser) {
    this.errorMessage = "";

    if (!this.validateEmail(formUser.email)) {
      this.errorMessage = "email is missing or format is invalid!";
      return;
    }

    if (!formUser.password) {
      this.errorMessage = "password is required";
      return;
    }

    formUser.email = this.sanitize(formUser.email);
    formUser.password = this.sanitize(formUser.password);

    // placing user inputs into user data schema variable
    let user = { loginid: formUser.email, password: formUser.password, role: 'user', status: 'A' };

    // call .getUsers() first to see if the account already exists
    this.apiService.getUsers(user.loginid).subscribe(response => {
      if (response.user.length > 0) {
        this.errorMessage = "User already exists!";
      }
      else {  // otherwise, we create the user
        this.createUser(user);
      }
    }, error => {
      this.errorMessage = "Failed to sign up, please try again or contact site administrator";
    }
    )
  }

  createUser(user) {  // this method calls the createUser() method from api.service
    this.apiService.createUser(user).subscribe(
      response => {

        localStorage.setItem('token', response.token);
        localStorage.setItem('userid', user.loginid)
        localStorage.setItem('userrole', user.role);
        localStorage.setItem('userstatus', user.status);

        this.authService.setUser(user);
        this.router.navigateByUrl('/song');

      }, error => {
        this.errorMessage = error;
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

  // Sanitize data
  sanitize(data: any) {
    return data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

}
