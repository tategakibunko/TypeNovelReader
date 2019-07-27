import { TestBed } from '@angular/core/testing';

import { NehanBodyService } from './nehan-body.service';

describe('NehanBodyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanBodyService = TestBed.get(NehanBodyService);
    expect(service).toBeTruthy();
  });
});
