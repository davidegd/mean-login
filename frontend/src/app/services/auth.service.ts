import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserIFC } from '../models/user';
import { JwtResponseIFC } from '../models/jwt-response';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  AUTH_SERVER: string = 'http://localhost:3000';
  authSubject = new BehaviorSubject(false);
  private token: string;

  constructor(private httpClient: HttpClient) { }

  register(user:UserIFC): Observable<JwtResponseIFC>{
    return this.httpClient.post<JwtResponseIFC>(`${this.AUTH_SERVER}/register`, user).pipe(tap(
      (res:JwtResponseIFC) => {
        if (res) {
          //save token
          this.saveToken(res.dataUser.accesToken, res.dataUser.expiresIn);
        }
      }
    ));
  }

  login(user:UserIFC): Observable<JwtResponseIFC>{
    return this.httpClient.post<JwtResponseIFC>(`${this.AUTH_SERVER}/login`, user).pipe(tap(
      (res:JwtResponseIFC) => {
        if (res) {
          //save token
          this.saveToken(res.dataUser.accesToken, res.dataUser.expiresIn);          
        }
      }
    ));
  }
  logout(){
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
  }

  private saveToken( token: string, expiresIn: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
    localStorage.setItem("EXPIRES_IN", expiresIn);
    this.token = token;
  }

  private getToken():string {
    if (!this.token) {
      this.token = localStorage.getItem("ACCESS_TOKEN");      
    }
    return this.token;
  }

}
