import { TestBed } from '@angular/core/testing';

import { GraficasService } from './graficas.service';

describe('GraficasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraficasService = TestBed.get(GraficasService);
    expect(service).toBeTruthy();
  });
});
