import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  loginMode = true;

  constructor(private authService: AuthService, private router: Router) {}

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/auth/google';
  }
  
  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(authForm: NgForm) {
    if (this.loginMode) {
      const { email, password } = authForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          if (error.status === 401) {
            alert(error.error.message);
          } else {
            alert(
              error.error.message ||
                'An error occurred. Please try again later.'
            );
          }
        },
      });
    } else {
      const { username, email, password, confirmPassword } = authForm.value;
      this.authService
        .register(username, email, password, confirmPassword)
        .subscribe({
          next: (response) => {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/transactions']);
          },
          error: (error) => {
            console.error('Registration failed', error);
            if (error.status === 401) {
              alert(error.error.message);
            } else {
              alert(
                error.error.message ||
                  'An error occurred. Please try again later.'
              );
            }
          },
        });
    }

    // authForm.reset();
  }
}
