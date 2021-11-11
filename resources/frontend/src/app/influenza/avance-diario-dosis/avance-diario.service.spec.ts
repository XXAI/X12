import { TestBed } from '@angular/core/testing';

import { AvanceDiarioService } from './avance-diario.service';

describe('AvanceDiarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AvanceDiarioService = TestBed.get(AvanceDiarioService);
    expect(service).toBeTruthy();
  });
});
