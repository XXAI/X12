import { TestBed } from '@angular/core/testing';

import { AvancesActividadesService } from './avances-actividades.service';

describe('AvancesActividadesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AvancesActividadesService = TestBed.get(AvancesActividadesService);
    expect(service).toBeTruthy();
  });
});
