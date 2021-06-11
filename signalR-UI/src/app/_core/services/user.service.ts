import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { OperationResult } from '../utilities/operation-result';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.baseUrl + 'api/';
  token: string;
  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post<OperationResult>(this.url + 'Account/create/', user);
  }
}
