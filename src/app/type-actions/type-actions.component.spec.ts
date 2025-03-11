import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeActionsComponent } from './type-actions.component';

describe('TypeActionsComponent', () => {
  let component: TypeActionsComponent;
  let fixture: ComponentFixture<TypeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
