import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransactionsListComponent } from './cash-transactions-list.component';

describe('CashTransactionsListComponent', () => {
  let component: CashTransactionsListComponent;
  let fixture: ComponentFixture<CashTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashTransactionsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
