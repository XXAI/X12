import { TestBed } from '@angular/core/testing';

import { CasosSospechososService } from './casos-sospechosos.service';

describe('CasosSospechososService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CasosSospechososService = TestBed.get(CasosSospechososService);
    expect(service).toBeTruthy();
  });
});
