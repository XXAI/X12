import { TestBed } from '@angular/core/testing';

import { EstrategiasService } from './estrategias.service';

describe('EstrategiasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstrategiasService = TestBed.get(EstrategiasService);
    expect(service).toBeTruthy();
  });
});
