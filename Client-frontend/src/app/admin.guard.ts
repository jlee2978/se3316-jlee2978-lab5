import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { IUser } from './user';
import { IResponse } from './response';
import { AuthenticationService } from './authentication.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

	private user: IUser;
	private response: IResponse;

	constructor(private authService: AuthenticationService, private apiService: ApiService, private router: Router) { }

  // canActivate is true if the user is logged in, is an admin, and their status is active; otherwise, canActivate is false and reroutes the user to login
	canActivate(): boolean {
		if (this.authService.loggedIn() && localStorage.getItem('userrole') === "admin" && localStorage.getItem('userstatus') === 'A') {
			return true;
		}
		else {
			this.router.navigate(['/login']);
			return false;
		}
	}

}
