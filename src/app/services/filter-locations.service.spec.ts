import { TestBed } from '@angular/core/testing';

import { FilterLocationsService } from './filter-locations.service';

describe('FilterLocationsService', () => {
  let service: FilterLocationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterLocationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
