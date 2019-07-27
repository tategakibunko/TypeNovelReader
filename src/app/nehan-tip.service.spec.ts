import { TestBed } from '@angular/core/testing';

import { NehanTipService } from './nehan-tip.service';

describe('NehanTipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanTipService = TestBed.get(NehanTipService);
    expect(service).toBeTruthy();
  });
});
