import { Injectable, Injector } from '@angular/core';
import {HttpInterceptor} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})

// https://www.youtube.com/watch?v=UrfhqE7I-3o --> creating a token interceptor before we send the request

export class TokeninterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) {
	  
  }

  intercept(req, next) {
	  let authService = this.injector.get(AuthenticationService);
	  
	  let tokenizedReq = req.clone({
		  setHeaders: {
			  Authorization: `Bearer ${authService.getToken()}`
			  }
	  })
	  return next.handle(tokenizedReq);
  }
}
