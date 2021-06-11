import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "../../../environments/environment";
import { User } from '../models/user';


@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseUrl = environment.baseUrl + "api/Account/";
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  constructor(private http: HttpClient) { }
  login(model: any) {
    return this.http.post(this.baseUrl + "login", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem("token", user.token);
          localStorage.setItem("user", JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
        }
      })
    );
  }
  // || currentUser.role == undefined add later!
  loggedIn() {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser == null)
      return false;

    return !this.jwtHelper.isTokenExpired(token);
  }
}
