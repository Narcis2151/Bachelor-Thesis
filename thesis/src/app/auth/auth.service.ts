import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    return this.http.post<AuthResponseData>(
      'http://localhost:3000/api/user/signup',
      {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      }
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'http://localhost:3000/api/user/login',
      {
        email: email,
        password: password,
      }
    );
  }
}
