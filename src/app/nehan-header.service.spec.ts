import { TestBed } from '@angular/core/testing';

import { NehanHeaderService } from './nehan-header.service';

describe('NehanHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanHeaderService = TestBed.get(NehanHeaderService);
    expect(service).toBeTruthy();
  });
});
