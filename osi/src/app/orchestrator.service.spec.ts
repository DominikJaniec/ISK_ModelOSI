import { TestBed, inject } from '@angular/core/testing';

import { OrchestratorService } from './orchestrator.service';

describe('OrchestratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrchestratorService]
    });
  });

  it('should be created', inject([OrchestratorService], (service: OrchestratorService) => {
    expect(service).toBeTruthy();
  }));
});
