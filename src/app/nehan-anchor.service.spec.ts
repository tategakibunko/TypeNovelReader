import { TestBed } from '@angular/core/testing';

import { NehanAnchorService } from './nehan-anchor.service';

describe('NehanAnchorService', () => {
  let service: NehanAnchorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NehanAnchorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
