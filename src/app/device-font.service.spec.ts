import { TestBed } from '@angular/core/testing';

import { DeviceFontService } from './device-font.service';

describe('DeviceFontService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceFontService = TestBed.get(DeviceFontService);
    expect(service).toBeTruthy();
  });
});
