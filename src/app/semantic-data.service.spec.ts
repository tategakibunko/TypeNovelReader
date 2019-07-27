import { TestBed } from '@angular/core/testing';

import { SemanticDataService } from './semantic-data.service';

describe('SemanticDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SemanticDataService = TestBed.get(SemanticDataService);
    expect(service).toBeTruthy();
  });
});
