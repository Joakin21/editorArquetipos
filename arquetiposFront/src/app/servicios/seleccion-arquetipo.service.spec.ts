import { TestBed } from '@angular/core/testing';

import { SeleccionArquetipoService } from './seleccion-arquetipo.service';

describe('SeleccionArquetipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeleccionArquetipoService = TestBed.get(SeleccionArquetipoService);
    expect(service).toBeTruthy();
  });
});
