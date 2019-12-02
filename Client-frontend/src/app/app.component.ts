import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AdminGuard } from './admin.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'se3316-jlee2978-lab5';

  constructor(public authService: AuthenticationService, private router: Router, private adminGuard: AdminGuard) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
