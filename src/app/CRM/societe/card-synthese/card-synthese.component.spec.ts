import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSyntheseComponent } from './card-synthese.component';

describe('CardSyntheseComponent', () => {
  let component: CardSyntheseComponent;
  let fixture: ComponentFixture<CardSyntheseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSyntheseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardSyntheseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
