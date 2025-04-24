import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { besoinsGuard } from './besoins.guard';

describe('besoinsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => besoinsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
