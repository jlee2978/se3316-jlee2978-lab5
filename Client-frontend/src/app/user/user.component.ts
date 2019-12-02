import { Component, OnInit } from '@angular/core';
import { ApiService } from './../api.service';
import { FormBuilder } from '@angular/forms';
import { IResponse } from './../response';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public users: String[] = [];
  public response: IResponse;
  public errorMessage: String;

  constructor(public apiService: ApiService, private fb: FormBuilder) { }


  ngOnInit() {
    this.getUsers('');
  }

  getUsers(loginid) {
    this.apiService.getUsers(loginid).subscribe(
      response => {
        this.response = response;
        this.users = response.users;
      }
    );
  }

  saveUser(user) {
    user.loginid = this.sanitize(user.loginid);

    if (!user.loginid) {
      this.errorMessage = 'Login ID is required';
      return;
    }

    this.apiService.saveUser(user).subscribe(
      response => {

        if (response.error.code !== 0) {
          this.errorMessage = response.error.message;
        }
      }
    );
  }

  // Sanitize data
  sanitize(data: any) {
    return data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

}
