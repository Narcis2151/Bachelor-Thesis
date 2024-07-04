import { TestBed } from '@angular/core/testing';

import { NordigenService } from './nordigen.service';

describe('BankAccountsService', () => {
  let service: NordigenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NordigenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
