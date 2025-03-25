import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompDashComponent } from './comp-dash.component';

describe('CompDashComponent', () => {
  let component: CompDashComponent;
  let fixture: ComponentFixture<CompDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
