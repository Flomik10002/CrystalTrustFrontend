import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBusiness } from './register-business';

describe('RegisterBusiness', () => {
  let component: RegisterBusiness;
  let fixture: ComponentFixture<RegisterBusiness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBusiness]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterBusiness);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
