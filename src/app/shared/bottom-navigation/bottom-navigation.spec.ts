import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomNavigation } from './bottom-navigation';

describe('BottomNavigation', () => {
  let component: BottomNavigation;
  let fixture: ComponentFixture<BottomNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNavigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
