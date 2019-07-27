import { TestBed } from '@angular/core/testing';

import { NovelDataService } from './novel-data.service';

describe('NovelDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NovelDataService = TestBed.get(NovelDataService);
    expect(service).toBeTruthy();
  });
});
