import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/auth/login';
  private registerUrl = 'http://localhost:3000/auth/register';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password });
  }

  register(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.http.post(this.registerUrl, {
      username,
      email,
      password,
      confirmPassword,
    });
  }
}
