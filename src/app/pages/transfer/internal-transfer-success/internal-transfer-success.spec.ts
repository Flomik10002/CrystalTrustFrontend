import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalTransferSuccess } from './internal-transfer-success';

describe('InternalTransferSuccess', () => {
  let component: InternalTransferSuccess;
  let fixture: ComponentFixture<InternalTransferSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalTransferSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalTransferSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
