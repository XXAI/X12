import { TestBed } from '@angular/core/testing';

import { ActividadesMetasGruposService } from './actividades-metas-grupos.service';

describe('ActividadesMetasGruposService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActividadesMetasGruposService = TestBed.get(ActividadesMetasGruposService);
    expect(service).toBeTruthy();
  });
});
