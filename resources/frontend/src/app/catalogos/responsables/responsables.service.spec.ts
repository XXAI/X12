import { TestBed } from '@angular/core/testing';

import { ResponsablesService } from './responsables.service';

describe('ResponsablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResponsablesService = TestBed.get(ResponsablesService);
    expect(service).toBeTruthy();
  });
});
