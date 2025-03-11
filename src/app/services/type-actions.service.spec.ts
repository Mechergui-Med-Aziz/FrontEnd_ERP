import { TestBed } from '@angular/core/testing';

import { TypeActionsService } from './type-actions.service';

describe('TypeActionsService', () => {
  let service: TypeActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
