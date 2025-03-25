import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-card-synthese',
  standalone: true,
  imports: [MatIcon,CommonModule],
  templateUrl: './card-synthese.component.html',
  styleUrl: './card-synthese.component.css'
})
export class CardSyntheseComponent {
  @Input() customClass: string = '';
  @Input() customTitle: string = '';
  @Input() customActionIcon: string = '';
  @Input() customActionLabel: any = '';
  @Input() customTitleClass: string = '';
  @Input() route: string = '';
  @Input() hasIconActions: boolean = true;
  @Input() removeCard: boolean = false;

  
  navigateSynthese(): void {
   
  }
}
