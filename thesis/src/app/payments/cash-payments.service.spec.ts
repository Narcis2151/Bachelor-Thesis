import { TestBed } from '@angular/core/testing';

import { CashPaymentsService } from './cash-payments.service';

describe('PaymentsService', () => {
  let service: CashPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
