import { TestBed } from '@angular/core/testing';

import { VigilanciaClinicaService } from './vigilancia-clinica.service';

describe('VigilanciaClinicaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VigilanciaClinicaService = TestBed.get(VigilanciaClinicaService);
    expect(service).toBeTruthy();
  });
});
