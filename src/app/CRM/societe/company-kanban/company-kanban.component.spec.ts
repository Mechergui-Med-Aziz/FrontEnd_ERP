import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKanbanComponent } from './company-kanban.component';

describe('CompanyKanbanComponent', () => {
  let component: CompanyKanbanComponent;
  let fixture: ComponentFixture<CompanyKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyKanbanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
