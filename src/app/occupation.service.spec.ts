import { TestBed, inject } from '@angular/core/testing';

import { OccupationService } from './occupation.service';

describe('OccupationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OccupationService]
    });
  });

  it('should be created', inject([OccupationService], (service: OccupationService) => {
    expect(service).toBeTruthy();
  }));
});
