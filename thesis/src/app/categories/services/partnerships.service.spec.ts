import { TestBed } from '@angular/core/testing';

import { PartnershipsService } from './partnerships.service';

describe('PartnershipService', () => {
  let service: PartnershipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnershipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
