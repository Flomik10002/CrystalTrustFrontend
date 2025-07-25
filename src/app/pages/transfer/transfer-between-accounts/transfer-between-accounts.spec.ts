import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBetweenAccounts } from './transfer-between-accounts';

describe('TransferBetweenAccounts', () => {
  let component: TransferBetweenAccounts;
  let fixture: ComponentFixture<TransferBetweenAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferBetweenAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferBetweenAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
