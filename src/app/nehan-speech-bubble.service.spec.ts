import { TestBed } from '@angular/core/testing';

import { NehanSpeechBubbleService } from './nehan-speech-bubble.service';

describe('NehanSpeechBubbleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NehanSpeechBubbleService = TestBed.get(NehanSpeechBubbleService);
    expect(service).toBeTruthy();
  });
});
