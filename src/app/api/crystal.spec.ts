import { TestBed } from '@angular/core/testing';

import { Crystal } from './crystal';

describe('Crystal', () => {
  let service: Crystal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Crystal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
