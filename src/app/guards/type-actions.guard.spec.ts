import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { typeActionsGuard } from './type-actions.guard';

describe('typeActionsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => typeActionsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
