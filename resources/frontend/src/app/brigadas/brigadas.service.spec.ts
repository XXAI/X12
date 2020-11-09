import { TestBed } from '@angular/core/testing';

import { BrigadasService } from './brigadas.service';

describe('BrigadasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrigadasService = TestBed.get(BrigadasService);
    expect(service).toBeTruthy();
  });
});
