import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferByAccount } from './transfer-by-account';

describe('TransferByAccount', () => {
  let component: TransferByAccount;
  let fixture: ComponentFixture<TransferByAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferByAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferByAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
