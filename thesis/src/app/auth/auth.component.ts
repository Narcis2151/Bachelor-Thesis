import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  loginMode = true;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;

    if (!this.loginMode) {
      const username = authForm.value.username;
      const confirmPassword = authForm.value.confirmPassword;
      this.authService.signup(username, email, password, confirmPassword);
    } else {
      this.authService.login(email, password);
    }

    authForm.reset();
  }
}
