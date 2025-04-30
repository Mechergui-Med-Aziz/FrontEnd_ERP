import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { usersAccountsGuard } from './users-accounts.guard';

describe('usersAccountsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => usersAccountsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
