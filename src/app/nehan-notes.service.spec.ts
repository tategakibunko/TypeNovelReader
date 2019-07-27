import { TestBed } from '@angular/core/testing';

import { NehanNotesService } from './nehan-notes.service';

describe('NehanNotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanNotesService = TestBed.get(NehanNotesService);
    expect(service).toBeTruthy();
  });
});
