import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWithdraw } from './request-withdraw';

describe('RequestWithdraw', () => {
  let component: RequestWithdraw;
  let fixture: ComponentFixture<RequestWithdraw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestWithdraw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestWithdraw);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
