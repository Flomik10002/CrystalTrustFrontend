import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDeposit } from './request-deposit';

describe('RequestDeposit', () => {
  let component: RequestDeposit;
  let fixture: ComponentFixture<RequestDeposit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDeposit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDeposit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
