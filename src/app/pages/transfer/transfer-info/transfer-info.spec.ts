import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferInfo } from './transfer-info';

describe('TransferInfo', () => {
  let component: TransferInfo;
  let fixture: ComponentFixture<TransferInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
