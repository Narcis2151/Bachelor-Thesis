import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NordigenCallbackComponent } from './nordigen-callback.component';

describe('NordigenCallbackComponent', () => {
  let component: NordigenCallbackComponent;
  let fixture: ComponentFixture<NordigenCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NordigenCallbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NordigenCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
