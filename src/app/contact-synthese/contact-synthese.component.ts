import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-contact-synthese',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './contact-synthese.component.html',
  styleUrl: './contact-synthese.component.css'
})
export class ContactSyntheseComponent implements OnInit {
  idContact: any;
constructor(
      
          
    private activatedRoute: ActivatedRoute,
          private router: Router,

    ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      
      this.idContact = params['idContact'];
      // Debugging line
      console.log('ID du contact :', this.idContact); // Debugging line
      
      }
    );
}
}