import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAvatars } from './user-avatars';

describe('UserAvatars', () => {
  let component: UserAvatars;
  let fixture: ComponentFixture<UserAvatars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAvatars]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAvatars);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
