import { TestBed } from '@angular/core/testing';

import { ConcentradosService } from './concentrados.service';

describe('ConcentradosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConcentradosService = TestBed.get(ConcentradosService);
    expect(service).toBeTruthy();
  });
});
