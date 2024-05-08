import { TestBed } from '@angular/core/testing';

import { CashTransactionsService } from './cash-transactions.service';

describe('CashTransactionsService', () => {
  let service: CashTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
