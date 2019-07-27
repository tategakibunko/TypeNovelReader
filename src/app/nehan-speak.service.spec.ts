import { TestBed } from '@angular/core/testing';

import { NehanSpeakService } from './nehan-speak.service';

describe('NehanSpeakService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanSpeakService = TestBed.get(NehanSpeakService);
    expect(service).toBeTruthy();
  });
});
