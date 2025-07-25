import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsSummary } from './operations-summary';

describe('OperationsSummary', () => {
  let component: OperationsSummary;
  let fixture: ComponentFixture<OperationsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationsSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
