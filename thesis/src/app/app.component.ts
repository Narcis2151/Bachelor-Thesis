import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'thesis';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    initFlowbite();
    this.authService.handleOAuthCallback();
  }
}
