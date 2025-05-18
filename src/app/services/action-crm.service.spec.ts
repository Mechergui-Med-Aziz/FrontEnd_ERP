import { TestBed } from '@angular/core/testing';

import { ActionCrmService } from './action-crm.service';

describe('ActionCrmService', () => {
  let service: ActionCrmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionCrmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
