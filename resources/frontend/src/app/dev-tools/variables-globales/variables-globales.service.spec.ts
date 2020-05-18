import { TestBed } from '@angular/core/testing';

import { VariablesGlobalesService } from './variables-globales.service';

describe('VariablesGlobalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VariablesGlobalesService = TestBed.get(VariablesGlobalesService);
    expect(service).toBeTruthy();
  });
});
