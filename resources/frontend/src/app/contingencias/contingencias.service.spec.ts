import { TestBed } from '@angular/core/testing';

import { ContingenciasService } from './contingencias.service';

describe('ContingenciasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContingenciasService = TestBed.get(ContingenciasService);
    expect(service).toBeTruthy();
  });
});
