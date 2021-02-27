import { TestBed } from '@angular/core/testing';

import { NehanCodeHighlightService } from './nehan-code-highlight.service';

describe('NehanCodeHighlightService', () => {
  let service: NehanCodeHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NehanCodeHighlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
