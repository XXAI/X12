import { TestBed } from '@angular/core/testing';

import { IndiceService } from './indice.service';

describe('IndiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndiceService = TestBed.get(IndiceService);
    expect(service).toBeTruthy();
  });
});
