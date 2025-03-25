import { TestBed } from '@angular/core/testing';

import { KanbanCompService } from './kanban-comp.service'; 

describe('KanbanCompService', () => {
  let service: KanbanCompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanCompService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
