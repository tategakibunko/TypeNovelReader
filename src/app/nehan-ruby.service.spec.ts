import { TestBed } from '@angular/core/testing';

import { NehanRubyService } from './nehan-ruby.service';

describe('NehanRubyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanRubyService = TestBed.get(NehanRubyService);
    expect(service).toBeTruthy();
  });
});
