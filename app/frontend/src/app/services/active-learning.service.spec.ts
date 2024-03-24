import { TestBed } from '@angular/core/testing';

import { ActiveLearningService } from './active-learning.service';

describe('ActiveLearningService', () => {
  let service: ActiveLearningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveLearningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
