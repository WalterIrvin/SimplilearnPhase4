import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from './web-request.service';
import {shareReplay, tap} from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private webService: WebRequestService, private router: Router) { }
  register(email: string, password: string){
    return this.webService.register(email, password);
  }
  elevated_login(email: string, password: string){
    
  }
  login(email: string, password: string){
     return this.webService.login(email, password).pipe(
       shareReplay(),
       tap((res: HttpResponse<any>) => {
          // the auth tokens will be in the header of this response
          this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
          console.log("logged in");
          console.log(res);
       }
     ));
  }

  logout(){
    this.removeSession();
  }

  getAccessToken(){
    return localStorage.getItem('x-access-token');
  }

  setAccessToken(accessToken: string){
    localStorage.setItem('x-access-token', accessToken);
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token')
  }

  private setSession(userId: string, accessToken: string, refreshToken: string){
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private removeSession(){
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refreshToken');
  }
  getUserId() {
    return localStorage.getItem('user-id');
  }

  getNewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    )
  }
}
