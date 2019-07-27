import { TestBed } from '@angular/core/testing';

import { NehanSbTableService } from './nehan-sb-table.service';

describe('NehanSpeakTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanSbTableService = TestBed.get(NehanSbTableService);
    expect(service).toBeTruthy();
  });
});
