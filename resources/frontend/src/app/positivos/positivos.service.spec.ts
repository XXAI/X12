import { TestBed } from '@angular/core/testing';

import { PositivosService } from './positivos.service';

describe('PositivosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PositivosService = TestBed.get(PositivosService);
    expect(service).toBeTruthy();
  });
});
