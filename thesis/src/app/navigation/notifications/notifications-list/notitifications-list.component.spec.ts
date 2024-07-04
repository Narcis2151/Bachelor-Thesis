import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotitificationsListComponent } from './notitifications-list.component';

describe('NotitificationsListComponent', () => {
  let component: NotitificationsListComponent;
  let fixture: ComponentFixture<NotitificationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotitificationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotitificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
