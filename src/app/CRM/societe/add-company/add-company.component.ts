import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';


import { MatFormFieldModule } from '@angular/material/form-field';
import { ResponsiveScalingDirective } from '../../../directives/responsive-scaling.directive';
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
import { ContactsService } from '../../../services/contacts.service';
import { ActionCrmService } from '../../../services/action-crm.service';
import { ProfileService } from '../../../services/profile.service';
import { ActionService } from '../../../services/action.service';
import dayjs from 'dayjs';
import { TypeActionsService } from '../../../services/type-actions.service';
import { BesoinsService } from '../../../services/besoins.service';





@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [CardSyntheseComponent,MatFormFieldModule,MatInputModule,MatSelectModule,ReactiveFormsModule,FormsModule, CommonModule, NgxDropzoneModule, MatIcon,ToastModule,MatBadgeModule,RouterModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css',
  providers: [MessageService]
})
export class AddCompanyComponent implements OnInit, AfterViewInit {
  
  selectControl = new FormControl(1);
  societesStatusList: any[] = [ 
    { value: 'Prospect', name: 'Prospect',                                         color: "#FFA500"    },
    { value: 'Client', name: 'Client',                                             color : "#000080"       },
    { value: 'Client_direct', name: 'Client direct',                               color: "#00FFFF"       },
    { value: 'Partenaire', name: 'Partenaire',                                     color: "#80FF00"      },
    { value: 'Piste', name: 'Piste',                                               color: "#0096AA"     },
    { value: 'Fournisseur', name: 'Fournisseur',                                   color: "#FA0000"       },
    { value: 'Archivé', name: 'Archivé',                                           color: "#FF80FF"    },
    { value: 'Intermédiaire de facturation', name: 'Intermédiaire de facturation', color: "brown"     },
    { value: 'Client via intermédiaire', name: 'Client via intermédiaire',         color: "gray"     },

  ];
  societesProvenanceList: any[] = [
    { value: 'Prospection', name: 'Prospection' },
    { value: 'Apporteur', name: 'Apporteur' },
    { value: 'Client', name: 'Client' },
    { value: 'Collégue', name: 'Collégue' },
    { value: 'Réseau', name: 'Réseau' },
    { value: 'Salon', name: 'Salon' },
    { value: "Appel d'offre", name: "Appel d'offre" },
    { value: 'Appel entrant', name: 'Appel entrant' },
    { value: 'Google', name: 'Google' },
    { value: 'Hitechpros', name: 'Hitechpros' },
    { value: 'Linkedin&RS', name: 'Linkedin&RS' },
    { value: 'Turnover', name: 'Turnover' },
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
  

  idCompany: number = 0;
  companyForm: FormGroup;
  managers:any[] = [
    { value: 'Ilyes', name: 'Ilyes' },
    { value: 'Aziz' , name: 'Aziz' },
  ];
  
 
  formData = new FormData();
  companycontacts: any;
  newContact:any;
  companyBesoins: any[] = [];
  mode: any ;
  c="company";
   // Mode par défaut (ajout)
  // Liste des contacts de la société
  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
   
    private compService: CompServiceService,
    private contactsService: ContactsService,
    private actionService: ActionService,
    private actionCrmService: ActionCrmService,
    private profileService: ProfileService,
    private typeAction: TypeActionsService,
    private besoinsService: BesoinsService,
    
   
  )
  {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      effective: [1, [Validators.pattern('^[0-9]+$')]],
      sector: [null, [Validators.required]],
      provenance : [null, [Validators.required]],
      precise : ['', [Validators.required]],
      filiales : [null, []],
      email : ['', [Validators.email, Validators.required]],
      
      
     
      agency: ['', [Validators.required]],
      phone: ['', [Validators.pattern('^[0-9]*$'),Validators.required]],
      address: ['', [Validators.required]],
      postalCode: ['', []],
      city: ['', []],
      country: ['', []],
      
      informations: ['', []],
    
      
         
     
     
      creationDate: [{value:new Date().toLocaleDateString('fr-FR')}],
      createdBy: ['', []],
      
     
      
      
      
      
      
      
      
      
      
      
      
    });
    this.actionAddForm= this.fb.group({
            description: ['', Validators.required],
            typeAction: ['', Validators.required],
            dateAction: [dayjs().toISOString()],
            createdBy: [''],
            contactId: [],
            manager:[''],
          });
          this.actionBesoinAddForm= this.fb.group({
            description: ['', Validators.required],
            typeAction: ['', Validators.required],
            dateAction: [dayjs().toISOString()],
            createdBy: [''],
            besoinId: [],
            manager:[''],
          });
              this.DetailsActionForm = this.fb.group({
        id: [Validators.required],
        description: [{value:''},Validators.required],
        typeAction: [{value:''},Validators.required],
        dateAction: ['', Validators.required],
        createdBy:'',
        besoinId: [],
        manager:[]
      });
      this.DetailsActionCrmForm = this.fb.group({
        id: [Validators.required],
        description: [{value:''},Validators.required],
        typeAction: [{value:''},Validators.required],
        dateAction: ['', Validators.required],
        createdBy:'',
        contactId: [],
        manager:[]
      });
    
  }
  isAddActionBesoinModalOpen:boolean = false;
  actionBesoinAddForm: FormGroup;
  companyActions: any[] = [];
  isActionDetailsModalOpen: boolean = false;
  isActionCrmDetailsModalOpen: boolean = false;
   DetailsActionForm: FormGroup;
  DetailsActionCrmForm: FormGroup;
  // Modifiez votre composant AddCompanyComponent pour gérer l'édition
user: any ;
isAddActionModalOpen = false;
 actionAddForm: FormGroup;
userRole:any;
modeAction: string = ''; // Mode par défaut pour l'ajout d'action
userId: any;

ngOnInit(): void {
  this.BesoinActions= [];
  this.companyActions = [];

  this.profileService.findUserById(Number(localStorage.getItem('id'))).subscribe(
    (user: any) => {
      this.user = user;
      this.userRole=user.role;
      this.userId = user.id;
    });
  
  this.loadCountries();
  this.loadProductionManagers();
  
  // Récupérer l'ID de l'URL si on est en mode édition
  this.activatedRoute.params.subscribe(params => {
    if (params['id']) {
      console.log("AHAHHAHAHAHHAHHAHHAHAHAHHAAHAHAHHAHAHAHAHHAHHAAHAHAHHAHA",params['id']);
      this.idCompany = params['id'];
      console.log("idCompanyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYUUUUUUUUUUUUUUUUU",this.idCompany);
      this.loadCompanyData(this.idCompany);
      console.log("COMPANY DATAAAAAAAAAAAAAAAAAAAAAAAAAA",this.companyForm.value);
    }
  });
  if (this.idCompany) {
    this.mode='edit';
  } else {
    this.mode='add';
  }  this.activatedRoute.queryParams.subscribe(params => {
    if (params['modeS'] == 'besoin') {
      this.modeS = 'besoins';
    }
  });
}

ngAfterViewInit(): void {
  // Refresh the data if modeS was updated
  if (this.modeS == 'besoins') {
    // Small timeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.ngOnInit();
    }, 0);
  }
}
 closeDetailsActionModal() {
    this.isActionDetailsModalOpen = false;
    this.isActionCrmDetailsModalOpen = false;
    this.DetailsActionForm.reset();
    this.DetailsActionCrmForm.reset();
  }
   openDetailsActionModal(action: any,mode: string) {
    this.modeAction = mode;
    console.log("action details  GGGGGGGGGGGGGGGGGGGGGGGGGG: ",action);
    // Remplir le formulaire avec les détails de l'action
    console.log("manager HHHHHHHHHHHHHHHHHHHHHHH",this.productionManagers)

    this.selectedAction = action;
    if(this.modeAction === 'besoin') {
    this.fillActionDetailsForm(action);
    this.isActionDetailsModalOpen = true;
  }else{
    this.fillActionCrmDetailsForm(action);
    this.isActionCrmDetailsModalOpen = true;
  }
    
    
  }
   deletedAction:any;
  openDeleteModal(action: any,mode: string) {
    this.modeAction = mode; 
    this.deletedAction=action;
    this.isDeleteModalOpen = true;

  }
  
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }
  deleteAction(id: number) {
    console.log("idddddddddddddddddddddddddddddddddd",id)
    if(this.modeAction === 'besoin') {
    this.actionService.deleteAction(id).subscribe(
      (response: any) => {
        console.log('Réponse du backend :', response);
        this.isDeleteModalOpen = false;
        this.deletedAction = null;
        this.ngOnInit(); // Recharger les données de la société après la suppression
        
      },
      (error: any) => {
        console.error('Erreur lors de la suppression de l\'action :', error);
      }
    );}else{
      this.actionCrmService.deleteAction(id).subscribe(
        (response: any) => {
          console.log('Réponse du backend :', response);
          this.isDeleteModalOpen = false;
          this.deletedAction = null;
          this.ngOnInit(); // Recharger les données de la société après la suppression
    },
      (error: any) => {
        console.error('Erreur lors de la suppression de l\'action :', error);
      });
    }
  }
  isDeleteModalOpen: boolean = false;
  selectedAction!: any;
  fillActionDetailsForm(action: any) {
    this.DetailsActionForm.patchValue({
      id: action.id,
      description: action.description,
      typeAction: action.typeAction,
      dateAction: action.dateAction ? new Date(action.dateAction).toLocaleDateString('fr-FR') : '',
      createdBy: action.createdBy.firstname + ' ' + action.createdBy.lastname,
      besoinId: action.besoinId,
      manager: action.manager ? action.manager.id : null
    });
    console.log(this.DetailsActionForm.value.manager);
    (error: any) => {
    console.error('Erreur lors du chargement de l\'action:', error);
  }

}
fillActionCrmDetailsForm(action: any) {
  console.log("action details  KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK: ",action);
    this.DetailsActionCrmForm.patchValue({
      id: action.id,
      description: action.description,
      typeAction: action.typeAction,
      dateAction: action.dateAction ? new Date(action.dateAction).toLocaleDateString('fr-FR') : '',
      createdBy: action.createdBy.firstname + ' ' + action.createdBy.lastname,
      contactId: action.contactId.id,
      manager: action.manager ? action.manager.id : null
    });
    console.log(this.DetailsActionForm.value.manager);
    (error: any) => {
    console.error('Erreur lors du chargement de l\'action:', error);
  }

}

  EditAction() {
    console.log("selected actionnnnnnnnnnnnnnnnnnnnnn",this.selectedAction)
    if(this.modeAction === 'besoin') {

    if(this.selectedFiles.length >10) {
      this.message = 'Vous ne pouvez pas ajouter plus de 10 fichiers.';
      this.isModalOpen=true
      return
    }for (const file of this.selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        this.message = `Le fichier "${file.name}" dépasse la taille limite de 10 Mo.`;
        this.isModalOpen = true;
        return;
      }
    }
    console.log("eeeeeeeeeeeeeeevvvvvvvvvvvvvvvvvvv"+ this.DetailsActionForm.value.manager)

    const updatedData = this.DetailsActionForm.value;
    updatedData.besoinId = this.selectedAction.besoinId;
    updatedData.createdBy = this.selectedAction.createdBy.id;
    updatedData.dateAction = new Date(this.selectedAction.dateAction).toISOString();
    updatedData.manager=this.productionManagers.find(manager => manager.id == this.DetailsActionForm.value.manager)

    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh"+updatedData?.manager)

    this.actionService.modifyActionBesoin(updatedData, this.selectedAction.id, this.selectedFiles).subscribe(
      (response: any) => {
        //console.log(`Action ${updatedData.id} mise à jour`);
        this.message = 'Action modifiée avec succès';
        this.isActionDetailsModalOpen = false;
        this.ngOnInit(); // Recharge les actions après la modification
        this.modeS="actions" // Navigate back to the previous page
        //this.Dashboard=false;
        //this.Dashboard=true;
        
      },
      (error: any) => {
        console.error(`Erreur lors de la mise à jour de l'action ${updatedData.id}`, error);
      }
    );}else{
        if(this.selectedFiles.length >10) {
      this.message = 'Vous ne pouvez pas ajouter plus de 10 fichiers.';
      this.isModalOpen=true
      return
    }for (const file of this.selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        this.message = `Le fichier "${file.name}" dépasse la taille limite de 10 Mo.`;
        this.isModalOpen = true;
        return;
      }
    }
    console.log("eeeeeeeeeeeeeeevvvvvvvvvvvvvvvvvvv"+ this.DetailsActionForm.value.manager)

    const updatedData = this.DetailsActionCrmForm.value;
    
    updatedData.contactId = this.selectedAction.contactId.id;
    updatedData.createdBy = this.selectedAction.createdBy.id;
    updatedData.dateAction = new Date(this.selectedAction.dateAction).toISOString();
    updatedData.manager=this.productionManagers.find(manager => manager.id == this.DetailsActionCrmForm.value.manager);

    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh111111111111"+updatedData)

    this.actionCrmService.modifyActionCrm(updatedData, this.selectedAction.id, this.selectedFiles).subscribe(
      (response: any) => {
        //console.log(`Action ${updatedData.id} mise à jour`);
        this.message = 'Action modifiée avec succès';
        this.isActionCrmDetailsModalOpen = false;
        this.ngOnInit(); // Recharge les actions après la modification
        this.modeS="actions" // Navigate back to the previous page
        //this.Dashboard=false;
        //this.Dashboard=true;
        
      },
      (error: any) => {
        console.error(`Erreur lors de la mise à jour de l'action ${updatedData.id}`, error);
      }
    );
    }

  }
loadCompanyData(id: number) {
  this.companyBesoins= [];
  this.compService.getCompById(id).subscribe(
    (company: any) => {
       // Assurez-vous que contacts est un tableau
      this.companyForm.patchValue(company);
      console.log('Company data loaded:', this.companyForm.value);
      this.companycontacts = company.contacts || [];
       // Assurez-vous que contacts est un tableau
      console.log('Company contacts:', this.companycontacts);
      this.companycontacts.forEach((element: {
        lastname: string;
        firstname: string;besoins: any[]; 
}) => {
          element.besoins.forEach((besoin: any) => {
            this.actionService.findActionsByBssoinId(besoin.id).subscribe(
              (actions: any) => {
                console.log('Actions loaded DDDDDDDDDtttttttttttttttttttttt:', actions);
                actions.forEach((action: any) => {
                  this.profileService.findUserById(action.createdBy).subscribe(
                    (user: any) => {
                      action.createdBy = user;
                      
                      
                    },
                    (error :any) => {
                      console.error('Erreur lors de la récupération de l’utilisateur pour l’action besoin ', error);
                    }

                    
                  );
                  this.besoinsService.findBesoinsById(action.besoinId).subscribe(
                    (besoinDetails: any) => {
                      action.besoinId = besoinDetails;

                      this.BesoinActions.push(action);
                    },(error :any) => {
                      console.error('Erreur lors de la récupération de l’utilisateur pour l’action besoin ', error);
                    }

                  );
                
                });
                
                
                
              },
              (error: any) => {
                console.error('Error loading actions:', error);
              }
            );
            console.log('Besoin actions RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR:', this.BesoinActions);
            this.profileService.findUserById(besoin.createdBy).subscribe(
              (user: any) => {
                besoin.createdBy = user;
                
                
              },
              (error :any) => {
                console.error('Erreur lors de la récupération de l’utilisateur pour l’action', error);
              }
            );
            besoin.contact=element.firstname + ' ' + element.lastname; // Ajoutez le nom du contact au besoin




            this.companyBesoins.push(besoin); // Ajoutez le besoin chargé à la liste des besoins
          });});
          console.log('Company besoinsssssssssssssssssssssssssssSSSSSSSSSSSSSSSS4444444:', this.companyBesoins); // Debugging line
      



      this.companycontacts.forEach((element: any) => {
       // Debugging line

        this.profileService.findUserById(element.createdBy).subscribe(
          (user: any) => {
            element.createdBy = user;
            
          },
          (error :any) => {
            console.error('Erreur lors de la récupération de l’utilisateur pour l’action', error);
          }

          
        );
        this.actionCrmService.findActionsByContactId(element.id).subscribe(
          (actions: any) => {
            console.log('Contact actions loaded:', actions);
            actions.forEach((action: any) => {

             
                this.profileService.findUserById(action.createdBy).subscribe(
                  (user: any) => {
                    action.createdBy = user;
                    
                  },
                  (error :any) => {
                    console.error('Erreur lors de la récupération de l’utilisateur pour l’action', error);
                  }

                  
                );
                
                this.contactsService.findContactById(action.contactId).subscribe(
                  (contact: any) => {
                    action.contactId = contact;
                    this.companyActions.push(action);
                  },
                  (error :any) => {
                    console.error('Erreur lors de la récupération de l’utilisateur pour l’action', error);
                  }
                );
              

              
            }) // Ajoutez le contact chargé à la liste des contacts
          },
          (error: any) => {
            console.error('Error loading contact actions:', error);
          }
        );
        

      });
    },
    (error: any) => {
      console.error('Error loading company data:', error);
    }
  );
  
  console.log('Company contacts:', this.companycontacts);
  console.log('Company actionssssssssssssssssssssss:', this.companyActions); // Debugging line
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
    this.companycontacts.forEach((element: any) => {
      console.log('Contact hahah :', element);
      console.log('ID du contact:', element.id); // Debugging line
      console.log('Statut du societe:', this.companyForm.value.status); // Debugging line
      this.contactsService.updateContactStatut(element.id,this.companyForm.value.status).subscribe(
        (response: any) => {
          console.log(`contact ${element.name} mis à jour avec le statut ${this.companyForm.value.status}`);
          this.ngOnInit();
        },
        (error: any) => {
          console.error(`Erreur lors de la mise à jour du contact ${element.id}`, error);
        }
      );
     

      
    });
    } 
    else {
      
    // Mode création
    let creationdate = new Date().toISOString();
      this.companyForm.patchValue({ creationDate: creationdate ,
        createdBy: this.user.id,
      });
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

modeS: string = 'informations'; // Onglet par défaut
  selectModeS(tab: string): void {

    this.modeS = tab;

    
  
    // Si besoin, ajouter ici des actions spécifiques au changement d'onglet
  }
  gotobesoin(){
    this.router.navigate(['/besoins'], { 
  queryParams: { 
    c: 'company',
    id: this.idCompany,
  }
  
});
  }
  gotobesoinUpdate(besoin: any) {
    this.router.navigate(['/besoins'], {
  queryParams: {
    besoinId: besoin,
    companyId: this.idCompany,
  }
  
  });
  console.log('Navigating to besoin update with params::::::::::::::::::', besoin);
}
  productionManagers : any[] = [];
  typeActions : any[] = []; 
  openActionAddModal(){
    this.loadTypeActions();
    
    this.isAddActionModalOpen = true;
  }
  closeActionAddModal(){
    this.isAddActionModalOpen = false;
    this.actionAddForm.reset();
  }
  openActionBesoinAddModal(){
    this.loadTypeActions();
    
    this.isAddActionBesoinModalOpen = true;
  }
  closeActionBesoinAddModal(){
    this.isAddActionBesoinModalOpen = false;
    this.actionBesoinAddForm.reset();
  }

  loadTypeActions() {
    this.typeAction.findTypeActionsByBelongTo("CRM").subscribe(
      (typeActions: any) => {
        this.typeActions = typeActions;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des typeActions:', error);
      }
    );
  }
  loadProductionManagers(){
    this.profileService.findUSerByRole("Manager De Production").subscribe(
      (users: any) => {
        console.log('users managers de prod :', users);
        this.productionManagers = users;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des managers de production:', error);
      });
  }
  BesoinActions:any[] = [];
  selectedFiles: File[] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }
  isModalOpen = false;
  message = '';

  addActionBesoin( ): void {
console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS user"+ this.user)
    if(this.selectedFiles.length >10) {
      this.message = 'Vous ne pouvez pas ajouter plus de 10 fichiers.';
      this.isModalOpen=true
      return
    }

    for (const file of this.selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        this.message = `Le fichier "${file.name}" dépasse la taille limite de 10 Mo.`;
        this.isModalOpen = true;
        return;
      }
    }
    if(this.user.role == 'Manager De Production'){
      this.actionBesoinAddForm.patchValue({
      
      createdBy: this.userId,
      manager:this.user,
    });
    }else{
    this.actionBesoinAddForm.patchValue({
      
      createdBy: this.userId,
      
    });
    }
    if (this.actionBesoinAddForm.valid) {
      const actionData = this.actionBesoinAddForm.value;
      console.log('actionData:',actionData);
      console.log('selectedFiles:',this.selectedFiles);
      this.actionService.createActionBesoin(actionData, this.selectedFiles).subscribe(
        response => {

          this.message = 'Action enregistrée avec succès';
          this.isModalOpen=true
          //this.Dashboard=false;
          this.isAddActionBesoinModalOpen = false; // Fermer la modal d'ajout d'action
          this.ngOnInit(); // Navigate to the contact update page
          this.modeS="actions" // Navigate back to the previous page
          //console.log('Action enregistrée avec succès', response);
          // Réinitialiser le formulaire et la sélection des fichiers si besoin
          this.actionBesoinAddForm.reset();
          this.selectedFiles = [];

        },
        error => {
          console.error('Erreur lors de l\'enregistrement de l\'action', error);
        }
      );
    }
  }

 closeModal() {
      this.isModalOpen = false;
      if(this.message=='Action enregistrée avec succès')
      this.closeActionAddModal();
    this.closeActionBesoinAddModal();
      this.closeDetailsActionModal();
          
    }
  addAction( ): void {

    if(this.selectedFiles.length >10) {
      this.message = 'Vous ne pouvez pas ajouter plus de 10 fichiers.';
      this.isModalOpen=true
      return
    }

    for (const file of this.selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        this.message = `Le fichier "${file.name}" dépasse la taille limite de 10 Mo.`;
        this.isModalOpen = true;
        return;
      }
    }
    console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS user"+ this.user)
    if(this.user.role == 'Manager De Production'){
      this.actionAddForm.patchValue({
      
      createdBy: this.user.id,
      manager:this.user,
    });
    }else{
    this.actionAddForm.patchValue({
      
      createdBy: this.user.id,
       });
    }
    if (this.actionAddForm.valid) {
      const actionData = this.actionAddForm.value;
      console.log('actionData:',actionData);
      console.log('selectedFiles:',this.selectedFiles);
      this.actionCrmService.createActionCrm(actionData, this.selectedFiles).subscribe(
        response => {

          this.message = 'Action enregistrée avec succès';
          this.isModalOpen=true
          //this.Dashboard=false;
          this.isAddActionModalOpen = false; // Fermer la modal d'ajout d'action
          this.ngOnInit(); // Navigate to the contact update page
          this.modeS="actions" // Navigate back to the previous page
          //console.log('Action enregistrée avec succès', response);
          // Réinitialiser le formulaire et la sélection des fichiers si besoin
          this.actionAddForm.reset();
          this.selectedFiles = [];

        },
        error => {
          console.error('Erreur lors de l\'enregistrement de l\'action', error);
        }
      );
    }
  }
}
