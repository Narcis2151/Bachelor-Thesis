import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavbarComponent {
  dropdowns: any = {};

  constructor(private router: Router) {
    // Close all dropdowns on navigation start
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.closeAllDropdowns();
    });
  }

  toggleDropdown(dropdown: string) {
    this.dropdowns[dropdown] = !this.dropdowns[dropdown];
  }

  closeAllDropdowns() {
    for (const key in this.dropdowns) {
      this.dropdowns[key] = false;
    }
  }
}
