import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  // dropdowns: any = {};

  // constructor(private eRef: ElementRef, private router: Router) {
  //   this.router.events
  //     .pipe(filter((event) => event instanceof NavigationStart))
  //     .subscribe(() => {
  //       this.closeAllDropdowns();
  //     });
  // }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   if (!this.eRef.nativeElement.contains(event.target)) {
  //     this.closeAllDropdowns();
  //   }
  // }

  // toggleDropdown(dropdown: string) {
  //   this.dropdowns[dropdown] = !this.dropdowns[dropdown];
  // }

  // closeAllDropdowns() {
  //   for (const key in this.dropdowns) {
  //     this.dropdowns[key] = false;
  //   }
  // }

  // private isClickInsideDropdown(event: MouseEvent): boolean {
  //   const dropdownToggles =
  //     this.eRef.nativeElement.querySelectorAll('.dropdown-toggle');
  //   for (const toggle of dropdownToggles) {
  //     if (toggle.contains(event.target)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}
