import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountInput } from './amount-input';

describe('AmountInput', () => {
  let component: AmountInput;
  let fixture: ComponentFixture<AmountInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmountInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmountInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
