import { TestBed } from '@angular/core/testing';

import { NehanKatexService } from './nehan-katex.service';

describe('NehanKatexService', () => {
  let service: NehanKatexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NehanKatexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
