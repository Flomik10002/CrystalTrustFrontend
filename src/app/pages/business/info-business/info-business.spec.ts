import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBusiness } from './info-business';

describe('InfoBusiness', () => {
  let component: InfoBusiness;
  let fixture: ComponentFixture<InfoBusiness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBusiness]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoBusiness);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
