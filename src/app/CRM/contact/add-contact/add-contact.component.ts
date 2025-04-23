import { Component ,OnInit } from '@angular/core';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatIcon } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { MatBadgeModule } from '@angular/material/badge';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import countries from 'world-countries';
import { ContactsService } from '../../../services/contacts.service';
import { CardSyntheseComponent } from '../../societe/card-synthese/card-synthese.component';
import { CompServiceService } from '../../../services/comp-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CardSyntheseComponent,MatAutocompleteModule, MultiSelectModule, AutoCompleteModule,MatFormFieldModule,MatInputModule,MatSelectModule,ReactiveFormsModule,FormsModule, CommonModule, NgxDropzoneModule, MatIcon,ToastModule,MatBadgeModule,RouterModule],
    
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.css',
  providers: [MessageService],  
})
export class AddContactComponent implements OnInit{
  
  companies: any[] = [];
  
  managers: any[] = ["ilyes","aziz","khaled"];
  typesDomaines: any[] = [];
  company: any;
  filteredCompany: any[] | undefined;
  societesPaysList: any[] = [];
  
  
 

  selectControl = new FormControl(1);
  idCompany: any = null;
  idContact: any = null;
  lock: boolean = true;
  myControl = new FormControl('');
  val: any;
  email: string = "";
  tel: string = "";
  social: string = "";
  contact:FormGroup;
  domainesGroup: SelectItemGroup[] = [];
  domaines: any[] = ["conception", "développement", "intégration", "déploiement", "maintenance","webdesign","webmarketing","devops","cloud","bigdata","ia"];
  
  tools: any[] = ["PHP","JAVA","PYTHON","C++","C#","HTML","CSS","JAVASCRIPT","REACTJS","ANGULARJS","NODEJS","SPRING","DJANGO","FLASK","LARAVEL","SYMFONY"];

  services: any[] = [
    { name: "Direction", value: "Direction" },
    { name: "Marketing", value: "Marketing" },
    { name: "Finance", value: "Finance" },
    { name: "IT", value: "IT" },
    { name:"RH", value:"RH"},

  ];
  
  listeTypes: any[] = ["Décisionnaire", "Influenceur", "Ambassadeur", "Acheteur", "Contact secondaire", "Inactif"];
  civilities: any[] = [
    { name: "Monsieur", value: "M" },
    { name: "Madame", value: "Mme" },
    { name: "Autre", value: "Autre" }
  ];
  listeEtat: any[] = [
    { value: 'Prospect', name: 'Prospect', color: 'green' },
    { value: 'Client', name: 'Client', color: 'red' },
    { value: 'Client_direct', name: 'Client direct', color: 'blue' },
    { value: 'Partenaire', name: 'Partenaire', color: 'orange' },
    { value: 'Piste', name: 'Piste', color: 'purple' },
    { value: 'Fournisseur', name: 'Fournisseur', color: 'yellow' },
    { value: 'Archivé', name: 'Archivé', color: 'grey' },
    { value: 'Intermédiaire de facturation', name: 'Intermédiaire de facturation', color: 'pink'},
    { value: 'Client via intermédiaire', name: 'Client via intermédiaire', color: 'brown' },
    ]
    ;
  
  listeProvenance: any[] = ["Prospection", "Apporteur", "Collègue", "Réseau", "Appel d'offre", "Appel entrant", "Client", "Salon", "Google", "Hitechpros", "Linkedin & RS", "Turnover"];
  listeAgence: any[] = ["BU expertise France", "BU Solution France", "BU Conseil France", "BU expertise Tunisie", "BU Solution Tunisie", "BU Conseil Tunisie", "BU SP - BP"];
  
mode: any;
  
  domainesSelected: any[] = [];
  toolsSelected: any[] = [];

  constructor(
      private contactservice: ContactsService,
      private compService: CompServiceService,
      private activatedRoute: ActivatedRoute,
      private messageService: MessageService,
      private fb: FormBuilder,
      private router: Router,
      private location: Location,
  ) { 
    this.contact = this.fb.group({
      civility: ['', []],
      lastname: ['', []],
      firstname: ['', []],
      function: [null, []],
      service: ['', []],
      manager: ['', []],
      type: ['', []],
      status: ['', []],
      provenance: [null, []],
      precisionValue: ['', []],
      agency: ['', []],
      email: ['', []],
      phone: ['', []],
      address: ['', []],
      postalCode: ['', []],
      city: ['', []],
      country: ['', []],
      socialMedea: ['', []],
      technicalPerimetar: ['', []],
      domains: ['', []],      
      tools: ['', []],
      complementaryInformations: ['', []],
      company: [null, []],
      creationDate: [{value:new Date().toLocaleDateString('fr-FR')}],
     
      
      
      
      
      
      
      
      
      
    });
  }

  ngOnInit(): void {
    this.loadCountries();
      this.activatedRoute.params.subscribe((params) => {
      this.idCompany = params['idCompany'];
      this.idContact = params['idContact'];
      console.log('ID de la société :', this.idCompany); // Debugging line
      console.log('ID du contact :', this.idContact); // Debugging line
      
      }
    );
    if (this.idCompany) {
      this.mode='add';
      this.loadCompanyData(this.idCompany);
    } 
    else {
      this.mode='edit';
      this.loadContactData(this.idContact);
      
    }

      
  }
  loadCompanyData(id: number) {
    this.compService.getCompById(id).subscribe(
      (company: any) => {
        this.company = company;
       
        });

      }
  loadContactData(id: number) {
    this.contactservice.findContactById(id).subscribe(
      (contact: any) => {
        this.contact.patchValue(contact);
        console.log('Contact company:', contact.company); // Debugging line
        this.company = contact.company;
      },
      (error: any) => {
        console.error('Error loading contact data:', error);
      }
    );
  }
  
  saveChanges() {
    if (this.idContact) {
      // Mode édition
      this.contactservice.updateContact(this.idContact, this.contact.value).subscribe(
        
        (response: any) => {
          console.log('Contact updated successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'contacte mis à jour avec succès' });
          this.location.back(); // Navigate back to the previous page
        },
        (error: any) => {
          console.error('Error updating contact:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de la mise à jour' });
        }
      );
    } else {
      let creationdate = new Date().toISOString();
      this.contact.patchValue({ creationDate: creationdate });

      console.log('Creating new contact:', this.contact.value);
      console.log('Company ID:', this.idCompany); // Debugging line
      this.contact.patchValue({ company: this.company });
      // Mode création
      this.contactservice.createContact(this.contact.value).subscribe(
        (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'contact créé avec succès' });
          this.router.navigate(['/contact']);
        },
        (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de la création' });
        }
      );
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  loadCountries() {
    // Format countries for dropdown (example: use common name + flag)
    this.societesPaysList = countries.map((country) => ({
      value: country.name.common,
      name: country.name.common, 
    }));
    this.societesPaysList.sort((a, b) => a.name.localeCompare(b.name));
  }
  getById() {}
  getDataSelect() {}
}
