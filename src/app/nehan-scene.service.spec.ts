import { TestBed } from '@angular/core/testing';

import { NehanSceneService } from './nehan-scene.service';

describe('NehanSceneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanSceneService = TestBed.get(NehanSceneService);
    expect(service).toBeTruthy();
  });
});
