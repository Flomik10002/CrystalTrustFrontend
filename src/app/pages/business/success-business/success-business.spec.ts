import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessBusiness } from './success-business';

describe('SuccessBusiness', () => {
  let component: SuccessBusiness;
  let fixture: ComponentFixture<SuccessBusiness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessBusiness]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessBusiness);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
