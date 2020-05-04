import { TestBed } from '@angular/core/testing';

import { ActividadesMetasService } from './actividades-metas.service';

describe('ActividadesMetasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActividadesMetasService = TestBed.get(ActividadesMetasService);
    expect(service).toBeTruthy();
  });
});
