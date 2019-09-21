import { TestBed } from '@angular/core/testing';

import { CrearObjetoService } from './crear-objeto.service';

describe('CrearObjetoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrearObjetoService = TestBed.get(CrearObjetoService);
    expect(service).toBeTruthy();
  });
});
