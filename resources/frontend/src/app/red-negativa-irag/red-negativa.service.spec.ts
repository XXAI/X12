import { TestBed } from '@angular/core/testing';

import { RedNegativaService } from './red-negativa.service';

describe('RedNegativaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RedNegativaService = TestBed.get(RedNegativaService);
    expect(service).toBeTruthy();
  });
});
