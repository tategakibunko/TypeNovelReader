import { TestBed } from '@angular/core/testing';

import { NehanIconService } from './nehan-icon.service';

describe('NehanIconService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanIconService = TestBed.get(NehanIconService);
    expect(service).toBeTruthy();
  });
});
