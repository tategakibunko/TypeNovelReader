import { TestBed } from '@angular/core/testing';

import { NehanOthersService } from './nehan-others.service';

describe('NehanOthersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanOthersService = TestBed.get(NehanOthersService);
    expect(service).toBeTruthy();
  });
});
