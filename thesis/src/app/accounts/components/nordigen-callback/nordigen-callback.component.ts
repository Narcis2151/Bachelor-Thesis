import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nordigen-callback',
  template: `
    <div *ngIf="isLoading">
      <hlm-spinner></hlm-spinner>
    </div>
    <div *ngIf="errorMessage" class="text-error">
      {{ errorMessage }}
    </div>
  `,
  styleUrls: ['./nordigen-callback.component.scss'],
})
export class NordigenCallbackComponent implements OnInit {
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const requisitionId = params['ref'];
      if (requisitionId) {
        this.isLoading = false;
        this.router.navigate(['/accounts'], {
          queryParams: { requisition_id: requisitionId },
        });
      } else {
        this.errorMessage = 'Requisition ID not found in the callback URL.';
        this.isLoading = false;
      }
    });
  }
}
