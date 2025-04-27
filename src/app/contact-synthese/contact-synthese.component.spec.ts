import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSyntheseComponent } from './contact-synthese.component';

describe('ContactSyntheseComponent', () => {
  let component: ContactSyntheseComponent;
  let fixture: ComponentFixture<ContactSyntheseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSyntheseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactSyntheseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
