import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    
    // Don't add token to orders/user endpoint (like React)
    const isOrdersUserEndpoint = request.url.includes('/orders/user/');
    
    if (token && !isOrdersUserEndpoint) {
      request = request.clone({
        setHeaders: {
          'token': token
        }
      });
    }
    
    console.log('AuthInterceptor - URL:', request.url);
    console.log('AuthInterceptor - Adding token:', token && !isOrdersUserEndpoint);
    
    return next.handle(request);
  }
} 