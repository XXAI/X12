import { TestBed } from '@angular/core/testing';

import { ArchivosGruposService } from './archivos-grupos.service';

describe('ArchivosGruposService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchivosGruposService = TestBed.get(ArchivosGruposService);
    expect(service).toBeTruthy();
  });
});
