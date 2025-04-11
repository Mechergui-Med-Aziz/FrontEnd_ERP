import { Component, OnInit } from '@angular/core';


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
import { MessageService } from 'primeng/api';
import { CardSyntheseComponent } from '../card-synthese/card-synthese.component';
import { CompServiceService } from '../../../services/comp-service.service';
import { AuthService } from '../../../services/auth.service';
import countries from 'world-countries';





@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [CardSyntheseComponent,MatFormFieldModule,MatInputModule,MatSelectModule,ReactiveFormsModule,FormsModule, CommonModule, NgxDropzoneModule, MatIcon,ToastModule,MatBadgeModule,RouterModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css',
  providers: [MessageService]
})
export class AddCompanyComponent implements OnInit {
  
  selectControl = new FormControl(1);
  societesStatusList: any[] = [
    { value: 'Prospect', name: 'Prospect', color: 'green' },
    { value: 'Client', name: 'Client', color: 'red' },
    { value: 'Client direct', name: 'Client direct', color: 'blue' },
    { value: 'Partenaire', name: 'Partenaire', color: 'orange' },
    { value: 'Piste', name: 'Piste', color: 'purple' },
    { value: 'Fournisseur', name: 'Fournisseur', color: 'yellow' },
    { value: 'Archivé', name: 'Archivé', color: 'grey' },
    { value: 'Intermédiaire de facturation', name: 'Intermédiaire de facturation', color: 'pink'},
    { value: 'Client via intermédiaire', name: 'Client via intermédiaire', color: 'brown' },

  ];
  societesAgenceList: any[] = [];


  societesPoleList: any[] = [
    { id: 1, value: 'CONSEIL', name: 'Conseil', color: '#FEA500' },
    { id: 2, value: 'DEVELOPMENT', name: 'Développement', color: '#43A047' },
  ];
  societesPaysList: { value: string; name: string }[] = [];


  societesSecteurList: any [] = [
    { value: 'Aéronautique', name: 'Aéronautique' },
    { value: 'Aérospatial', name: 'Aérospatial' },
    { value: 'Agriculture', name: 'Agriculture' },
    { value: 'Agroalimentaire', name: 'Agroalimentaire' },
    { value: 'Assurance', name: 'Assurance' },
    { value: 'Automobile', name: 'Automobile' },
    { value: 'Banque', name: 'Banque' },
    { value: 'Biens de consommation', name: 'Biens de consommation' },
    { value: 'Biotechnologie', name: 'Biotechnologie' },
    { value: 'BTP', name: 'BTP' },
    { value: 'Chimie', name: 'Chimie' },
    { value: 'Commerce', name: 'Commerce' },
    { value: 'Communication', name: 'Communication' },
    { value: 'Construction', name: 'Construction' },
    { value: 'Culture', name: 'Culture' },
    { value: 'Défense', name: 'Défense' },
    { value: 'Distribution', name: 'Distribution' },
    { value: 'Energie', name: 'Energie' },
    { value: 'Enseignement', name: 'Enseignement' },
    { value: 'Environnement', name: 'Environnement' },
    { value: 'Equipement', name: 'Equipement' },
    { value: 'Finance', name: 'Finance' },
    { value: 'Formation', name: 'Formation' },
    { value: 'Hôtellerie', name: 'Hôtellerie' },
    { value: 'Immobilier', name: 'Immobilier' },
    { value: 'Industrie', name: 'Industrie' },
    { value: 'Informatique', name: 'Informatique' },
    { value: 'Ingénierie', name: 'Ingénierie' },
    { value: 'Internet', name: 'Internet' },
    { value: 'Juridique', name: 'Juridique' },
    { value: 'Logistique', name: 'Logistique' },
    { value: 'Luxe', name: 'Luxe' },
    { value: 'Média', name: 'Média' },
    { value: 'Métallurgie', name: 'Métallurgie' },
    { value: 'Pharmaceutique', name: 'Pharmaceutique' },
    { value: 'Publicité', name: 'Publicité' },
    { value: 'Restauration', name: 'Restauration' },
  ]
  agenceList: any [] = [
    { value: 'BU Conseil Tunisie', name: 'BU-Conseil-Tunisie' },
    { value: 'BU Conseil France', name: 'BU-Conseil-France' },
    { value: 'BU SP-BP', name: 'BU-SP-BP' },
    { value: 'BU Solution France', name: 'BU-Solution-France' },
    { value: 'BU Expertise France', name: 'BU-Expertise-France' },
    { value: 'BU Solution Tunisie', name: 'BU-Solution-Tunisie' },
    { value: 'BU Expertise Tunisie', name: 'BU-Expertise-Tunisie' },
    
  ]
  societesProvenanceList:any [] = [
    { value: 'Prospection', name: 'Prospection' },
    { value: 'Apporteur', name: 'Apporteur' },
    { value: 'client', name: 'Client' },
    { value: 'Collègue', name: 'Collègue' },
    { value: 'Réseau', name: 'Réseau' },
    { value: 'Salon', name: 'Salon' },
    { value: 'Appel d\'offre', name: 'Appel d\'offre' },
    { value: 'Appel entrant', name: 'Appel entrant' },
    { value: 'Google', name: 'Google' },
    { value: 'Hitechpros', name: 'Hitechpros' },
    { value: 'linkedin', name: 'Linkedin' },
    { value: 'Turnover', name: 'Turnover' },
  ];

  idCompany: number = 0;
  companyForm: FormGroup;
  managers:any[] = [
    { value: 'Ilyes', name: 'Ilyes' },
    { value: 'Aziz' , name: 'Aziz' },
  ];
  
 
  formData = new FormData();
  
  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
   
    private compService: CompServiceService
  )
  {
    this.companyForm = this.fb.group({
      nom: ['', [Validators.required]],
      statut: [, [Validators.required]],
      effectif: [1, [Validators.required,Validators.pattern('^[0-9]+$')]],
      secteur: [null, [Validators.required]],
      filiales: ['', []],
      provenance: [, [Validators.required]],
      precisiez: ['', []],
      responsableManager: ['', [Validators.required]],
      pole: [null, [Validators.required]],
      agence: ['', [Validators.required]],
      telephone: ['', [Validators.required , Validators.pattern('^[0-9]*$')]],
      addresse: ['', []],
      postalCode: ['', []],
      ville: ['', []],
      pays: ['', [Validators.required]],
      siteWeb: ['', []],
      informations: ['', []],
      statutJuridique: ['', []],
      tva: ['', []],
      siret: ['', []],      
      rcs: ['', []],
      codeApe: ['', []],
      numeroFournisseur: ['', []],
      
      
      
      
      
      
      
      
      
      
    });
  }
  // Modifiez votre composant AddCompanyComponent pour gérer l'édition

ngOnInit(): void {
  this.loadCountries();
  
  // Récupérer l'ID de l'URL si on est en mode édition
  this.activatedRoute.params.subscribe(params => {
    if (params['id']) {
      this.idCompany = params['id'];
      this.loadCompanyData(this.idCompany);
    }
  });
}

loadCompanyData(id: number) {
  this.compService.getCompById(id).subscribe(
    (company: any) => {
      this.companyForm.patchValue(company);
    },
    (error: any) => {
      console.error('Error loading company data:', error);
    }
  );
}

saveChanges() {
  if (this.idCompany) {
    // Mode édition
    this.compService.updateCompany(this.idCompany, this.companyForm.value).subscribe(
      
      (response: any) => {
        console.log('Company updated successfully:', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Société mise à jour avec succès' });
        this.router.navigate(['/company']);
      },
      (error: any) => {
        console.error('Error updating company:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de la mise à jour' });
      }
    );
  } else {
    // Mode création
    this.compService.createComp(this.companyForm.value).subscribe(
      (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Société créée avec succès' });
        this.router.navigate(['/company']);
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
}
