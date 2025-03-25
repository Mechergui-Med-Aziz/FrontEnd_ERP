import { Component } from '@angular/core';


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






@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [CardSyntheseComponent,MatFormFieldModule,MatInputModule,MatSelectModule,ReactiveFormsModule,FormsModule, CommonModule, NgxDropzoneModule, MatIcon,ToastModule,MatBadgeModule,RouterModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css',
  providers: [MessageService]
})
export class AddCompanyComponent {
  
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
  societesPaysList:any [] = [
    { value: 'AFRIQUE-DU-SUD', name: 'Afrique du Sud' },
    { value: 'ALGERIE', name: 'Algérie' },
    { value: 'ALLEMAGNE', name: 'Allemagne' },
    { value: 'ANGOLA', name: 'Angola' },
    { value: 'ARABIE-SAOUDITE', name: 'Arabie Saoudite' },
    { value: 'ARGENTINE', name: 'Argentine' },
    { value: 'ARMENIE', name: 'Arménie' },
    { value: 'AUSTRALIE', name: 'Australie' },
    { value: 'AUTRICHE', name: 'Autriche' },
    { value: 'AZERBAIDJAN', name: 'Azerbaïdjan' },
    { value: 'BAHAMAS', name: 'Bahamas' },
    { value: 'BANGLADESH', name: 'Bangladesh' },
    { value: 'BARBADE', name: 'Barbade' },
    { value: 'BELARUS', name: 'Bélarus' },
    { value: 'BELGIQUE', name: 'Belgique' },
    { value: 'BELIZE', name: 'Belize' },
    { value: 'BENIN', name: 'Bénin' },
    { value: 'BOLIVIE', name: 'Bolivie' },
    { value: 'BOTSWANA', name: 'Botswana' },
    { value: 'BRESIL', name: 'Brésil' },
    { value: 'BULGARIE', name: 'Bulgarie' },
    { value: 'BURKINA-FASO', name: 'Burkina Faso' },
    { value: 'BURUNDI', name: 'Burundi' },
    { value: 'CAMEROUN', name: 'Cameroun' },
    { value: 'CANADA', name: 'Canada' },
    { value: 'CAP-VERT', name: 'Cap-Vert' },
    { value: 'CHILI', name: 'Chili' },
    { value: 'CHINE', name: 'Chine' },
    { value: 'COLOMBIE', name: 'Colombie' },
    { value: 'CONGO', name: 'Congo' },
    { value: 'COREE-DU-SUD', name: 'Corée du Sud' },
    { value: 'COSTA-RICA', name: 'Costa Rica' },
    { value: 'COTE-D-IVOIRE', name: 'Côte d\'Ivoire' },
    { value: 'CROATIE', name: 'Croatie' },
    { value: 'CUBA', name: 'Cuba' },
    { value: 'DANEMARK', name: 'Danemark' },
    { value: 'DJIBOUTI', name: 'Djibouti' },
    { value: 'DOMINIQUE', name: 'Dominique' },
    { value: 'EGYPTE', name: 'Égypte' },
    { value: 'EMIRATS-ARABES-UNIS', name: 'Émirats Arabes Unis' },
    { value: 'EQUATEUR', name: 'Équateur' },
    { value: 'ERITREE', name: 'Érythrée' },
    { value: 'ESPAGNE', name: 'Espagne' },
    { value: 'ESTONIE', name: 'Estonie' },
    { value: 'ETATS-UNIS', name: 'États-Unis' },
    { value: 'ETHIOPIE', name: 'Éthiopie' },
    { value: 'FINLANDE', name: 'Finlande' },
    { value: 'FRANCE', name: 'France' },
    { value: 'GABON', name: 'Gabon' },
    { value: 'GHANA', name: 'Ghana' },
    { value: 'GRECE', name: 'Grèce' },
    { value: 'GUATEMALA', name: 'Guatemala' },
    { value: 'GUINEE', name: 'Guinée' },
    { value: 'GUINEE-BISSAU', name: 'Guinée-Bissau' },
    { value: 'GUYANA', name: 'Guyana' },
    { value: 'GUYANE', name: 'Guyane' },
    { value: 'HAITI', name: 'Haïti' },
    { value: 'HONDURAS', name: 'Honduras' },
    { value: 'HONGRIE', name: 'Hongrie' },
    { value: 'INDE', name: 'Inde' },
    { value: 'INDONESIE', name: 'Indonésie' },
    { value: 'IRAN', name: 'Iran' },
    { value: 'IRLANDE', name: 'Irlande' },
    { value: 'ISLANDE', name: 'Islande' },
    { value: 'ISRAEL', name: 'Israël' },
    { value: 'ITALIE', name: 'Italie' },
    { value: 'JAMAIQUE', name: 'Jamaïque' },
    { value: 'JAPON', name: 'Japon' },
    { value: 'KAZAKHSTAN', name: 'Kazakhstan' },
    { value: 'KENYA', name: 'Kenya' },
    { value: 'LETTONIE', name: 'Lettonie' },
    { value: 'LIBAN', name: 'Liban' },
    { value: 'LIBERIA', name: 'Libéria' },
    { value: 'LIBYE', name: 'Libye' },
    { value: 'LITUANIE', name: 'Lituanie' },
    { value: 'LUXEMBOURG', name: 'Luxembourg' },
    { value: 'MADAGASCAR', name: 'Madagascar' },
    { value: 'MALAISIE', name: 'Malaisie' },
    { value: 'MALAWI', name: 'Malawi' },
    { value: 'MALI', name: 'Mali' },
    { value: 'MAROC', name: 'Maroc' },
    { value: 'MAURICE', name: 'Maurice' },
    { value: 'MAURITANIE', name: 'Mauritanie' },
    { value: 'MEXIQUE', name: 'Mexique' },
    { value: 'MOZAMBIQUE', name: 'Mozambique' },
    { value: 'NAMIBIE', name: 'Namibie' },
    { value: 'NIGER', name: 'Niger' },
    { value: 'NIGERIA', name: 'Nigéria' },
    { value: 'NORVEGE', name: 'Norvège' },
    { value: 'NOUVELLE-ZELANDE', name: 'Nouvelle-Zélande' },
    { value: 'OUGANDA', name: 'Ouganda' },
    { value: 'PAKISTAN', name: 'Pakistan' },
    { value: 'PANAMA', name: 'Panama' },
    { value: 'PARAGUAY', name: 'Paraguay' },
    { value: 'PEROU', name: 'Pérou' },
    { value: 'PHILIPPINES', name: 'Philippines' },
    { value: 'POLOGNE', name: 'Pologne' },
    { value: 'PORTUGAL', name: 'Portugal' },
    { value: 'REPUBLIQUE-TCHEQUE', name: 'République Tchèque' },
    { value: 'ROUMANIE', name: 'Roumanie' },
    { value: 'ROYAUME-UNI', name: 'Royaume-Uni' },
    { value: 'RUSSIE', name: 'Russie' },
    { value: 'RWANDA', name: 'Rwanda' },
    { value: 'SAINTE-LUCIE', name: 'Sainte-Lucie' },
    { value: 'SAINT-KITTS-ET-NEVIS', name: 'Saint-Kitts-et-Nevis' },
    { value: 'SAINT-VINCENT-ET-LES-GRENADINES', name: 'Saint-Vincent-et-les-Grenadines' },
    { value: 'SAO-TOME-ET-PRINCIPE', name: 'Sao Tomé-et-Principe' },
    { value: 'SENEGAL', name: 'Sénégal' },
    { value: 'SERBIE', name: 'Serbie' },
    { value: 'SEYCHELLES', name: 'Seychelles' },
    { value: 'SIERRA-LEONE', name: 'Sierra Leone' },
    { value: 'SINGAPOUR', name: 'Singapour' },
    { value: 'SLOVAQUIE', name: 'Slovaquie' },
    { value: 'SOMALIE', name: 'Somalie' },
    { value: 'SOUDAN', name: 'Soudan' },
    { value: 'SOUDAN-DU-SUD', name: 'Soudan du Sud' },
    { value: 'SRI-LANKA', name: 'Sri Lanka' },
    { value: 'SUEDE', name: 'Suède' },
    { value: 'SUISSE', name: 'Suisse' },
    { value: 'SURINAME', name: 'Suriname' },
    { value: 'TANZANIE', name: 'Tanzanie' },
    { value: 'TCHAD', name: 'Tchad' },
    { value: 'THAILANDE', name: 'Thaïlande' },
    { value: 'TOGO', name: 'Togo' },
    { value: 'TRINITE-ET-TOBAGO', name: 'Trinité-et-Tobago' },
    { value: 'TUNISIE', name: 'Tunisie' },
    { value: 'TURQUIE', name: 'Turquie' },
    { value: 'UKRAINE', name: 'Ukraine' },
    { value: 'URUGUAY', name: 'Uruguay' },
    { value: 'VATICAN', name: 'Vatican' },
    { value: 'VENEZUELA', name: 'Venezuela' },
    { value: 'VIETNAM', name: 'Vietnam' },
    { value: 'ZAMBIE', name: 'Zambie' },
    { value: 'ZIMBABWE', name: 'Zimbabwe' }
]
;
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
  managers:any[] = [];
  
 
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
      responsableManager: ['ilyes', [Validators.required]],
      pole: [null, [Validators.required]],
      agence: ['conseil', [Validators.required]],
      telephone: ['', [Validators.required , Validators.pattern('^[0-9]*$')]],
      addresse: ['', []],
      postalCode: ['', []],
      ville: ['', []],
      pays: [, [Validators.required]],
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
  saveChanges() {
    const comp = this.companyForm.value;
    console.log('Company:', comp);
    this.compService.createComp(comp).subscribe({
      next: (response: any) => {
      console.log('Company created successfully:', response);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Company created successfully' });
      this.router.navigate(['/compDash']);
      },
      error: (error: any ) => {
      console.error('Error creating company:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create company' });
      }
    });
  }
  
}
