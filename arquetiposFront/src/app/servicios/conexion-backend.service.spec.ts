import { TestBed } from '@angular/core/testing';

import { ConexionBackendService } from './conexion-backend.service';

describe('ConexionBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConexionBackendService = TestBed.get(ConexionBackendService);
    expect(service).toBeTruthy();
  });
});
