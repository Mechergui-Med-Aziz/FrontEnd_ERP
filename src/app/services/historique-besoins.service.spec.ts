import { TestBed } from '@angular/core/testing';

import { HistoriqueBesoinsService } from './historique-besoins.service';

describe('HistoriqueBesoinsService', () => {
  let service: HistoriqueBesoinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueBesoinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
