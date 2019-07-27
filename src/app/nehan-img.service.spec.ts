import { TestBed } from '@angular/core/testing';

import { NehanImgService } from './nehan-img.service';

describe('NehanImgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanImgService = TestBed.get(NehanImgService);
    expect(service).toBeTruthy();
  });
});
