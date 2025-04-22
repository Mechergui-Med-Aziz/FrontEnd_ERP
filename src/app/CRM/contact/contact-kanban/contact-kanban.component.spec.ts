import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactKanbanComponent } from './contact-kanban.component';

describe('ContactKanbanComponent', () => {
  let component: ContactKanbanComponent;
  let fixture: ComponentFixture<ContactKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactKanbanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
