import { TestBed } from '@angular/core/testing';

import { UnicornService } from './unicorn.service';

describe('UnicornService', () => {
  let service: UnicornService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnicornService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
