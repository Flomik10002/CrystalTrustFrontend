import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferByUsername } from './transfer-by-username';

describe('TransferByUsername', () => {
  let component: TransferByUsername;
  let fixture: ComponentFixture<TransferByUsername>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferByUsername]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferByUsername);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
