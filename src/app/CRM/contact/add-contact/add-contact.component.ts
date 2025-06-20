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
import { ActionCrmService } from '../../../services/action-crm.service';
import { ProfileService } from '../../../services/profile.service';
import dayjs from 'dayjs';
import { TypeActionsService } from '../../../services/type-actions.service';
import { BesoinsService } from '../../../services/besoins.service';
import { is } from 'cypress/types/bluebird';

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
  companyStatus: any;
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
  actionAddForm:FormGroup;
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
    { value: 'Prospect', name: 'Prospect',                                        color: "#FFA500" },
    { value: 'Client', name: 'Client',                                            color : "#000080"},
    { value: 'Client direct', name: 'Client direct',                              color: "#00FFFF" },
    { value: 'Partenaire', name: 'Partenaire',                                    color: "#80FF00" },
    { value: 'Piste', name: 'Piste',                                              color: "#0096AA" },
    { value: 'Fournisseur', name: 'Fournisseur',                                  color: "#FA0000" },
    { value: 'Archivé', name: 'Archivé',                                          color: "#FF80FF" },
    { value: 'Intermédiaire de facturation', name: 'Intermédiaire de facturation',color: "bronw" },
    { value: 'Client via intermédiaire', name: 'Client via intermédiaire',        color: "gray"   },
    ]
    ;
  
  listeProvenance: any[] = ["Prospection", "Apporteur", "Collègue", "Réseau", "Appel d'offre", "Appel entrant", "Client", "Salon", "Google", "Hitechpros", "Linkedin & RS", "Turnover"];
  listeAgence: any[] = ["BU expertise France", "BU Solution France", "BU Conseil France", "BU expertise Tunisie", "BU Solution Tunisie", "BU Conseil Tunisie", "BU SP - BP"];
  
mode: any;
  
  domainesSelected: any[] = [];
  toolsSelected: any[] = [];
  modeS: any;
  contactActions: any[] = [];
  isAddActionModalOpen: boolean = false;
  
  typeActions: any[] = [];
  user!: any;
  productionManagers: any[] = [];
  selectedFiles: File[] = [];
  isModalOpen: boolean = false;
  message: string = '';
  isDeleteModalOpen: boolean = false;
  isActionDetailsModalOpen: boolean = false;
  DetailsActionForm: FormGroup;
  selectedAction!: any;
  contactBesoins: any[] = [];
  userRole: any;
  DisactivationContact:any;
  otherContacts:any[] = [];
disactivationForm:FormGroup;
  constructor(
      private profileService: ProfileService,
      private actionService: ActionCrmService,
      private contactservice: ContactsService,
      private compService: CompServiceService,
      private activatedRoute: ActivatedRoute,
      private messageService: MessageService,
      private fb: FormBuilder,
      private router: Router,
      private location: Location,
      private typeAction: TypeActionsService,
      private besoinservice: BesoinsService,
  ) { 
    this.contact = this.fb.group({
      civility: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      function: [null, []],
      service: ['', [Validators.required]],
      createdBy: ['', []],
      type: ['', [Validators.required]],
      active: [true, []],
      
      provenance: [null, [Validators.required]],
    
      agency: ['', [Validators.required]],
      email: ['', [Validators.required , Validators.email]],
      phone: ['', [Validators.required , Validators.pattern('^[0-9]{8}$') ]], // tunisian phone number format
      address: ['', [Validators.required]],
      postalCode: ['', []],
      city: ['', []],
      
      
      country: ['', []],
      
      
      domains: ['', []],      
      tools: ['', []],
      
      company: [null, []],
      creationDate: [{value:new Date().toLocaleDateString('fr-FR')}],
     
    });
    this.disactivationForm = this.fb.group({
      DisactivationContact: ['', Validators.required],
    });
    
      this.actionAddForm= this.fb.group({
        description: ['', Validators.required],
        typeAction: ['', Validators.required],
        dateAction: [dayjs().toISOString()],
        createdBy: [''],
        contactId: [],
        manager:[''],
      });
      this.DetailsActionForm = this.fb.group({
        id: [Validators.required],
        description: [{value:''},Validators.required],
        typeAction: [{value:''},Validators.required],
        dateAction: ['', Validators.required],
        createdBy:'',
        contactId: [],
        manager:[]
      });
  }
  contactsExistants: any[] = [];
isDesactiverModalOpen: boolean = false;
  ngOnInit(): void {
    this.contactservice.findAllContacts().subscribe(
      (contacts: any[]) => {
        this.contactsExistants = contacts;
        //console.log('Contacts existants:', this.contactsExistants); // Debugging line
      }

    )
    this.profileService.findUserById(Number(localStorage.getItem('id'))).subscribe(
      (user: any) => {
        this.user = user;
        this.userRole = user.role;
      });
    
    this.modeS="informations"
    this.loadCountries();
    this.activatedRoute.params.subscribe((params) => {
      this.idCompany = params['idCompany'];
      this.idContact = params['idContact'];
      
      //console.log('ID de la société  :', this.idCompany); // Debugging line
      //console.log('ID du contact hhhh:', this.idContact); // Debugging line
      //console.log('where from:', this.wherefrom); // Debugging line
      
      }
    );
    this.activatedRoute.queryParams.subscribe((params) => {
      this.wherefrom = params['c'];
      //console.log('where fromMMMMMMMMMMMMMMMMMMMM:', this.wherefrom);
    });
    if (this.idCompany) {
      this.mode='add';
      this.loadCompanyData(this.idCompany);
    } 
    else {
      this.mode='edit';
      this.loadActions(this.idContact);
      this.loadContactData(this.idContact);
      

      this.loadProductionManagers();
    }
     this.activatedRoute.queryParams.subscribe(params => {
    if (params['modeS'] == 'besoin') {
      this.modeS = 'besoins';
    }
  });

  this.loadTypeActions();
  }
wherefrom:any;

   gotobesoin(){
    this.router.navigate(['/besoins'], { 
  queryParams: { 
    c: 'contact',
    idC: this.idContact,
  }
  
});
  }
  openDesactiverModal() {
    if(this.contactBesoins.length > 0){
    
    this.compService.getCompById(this.idCompany).subscribe(
      (company: any) => {
         console.log('Other contactsSSSSSSSSSSSS:', company.contacts); // Debugging line
        //console.log('contact id', this.idContact); // Debugging line
        //console.log('company contacts:', company.contacts);
        this.otherContacts = company.contacts.filter((contact: any) => contact.id != this.idContact && contact.active == true);
        console.log('Other contactsSSSSSSSSSSSS 222:', this.otherContacts.length);
        if(this.otherContacts.length==0){
    this.globalErrorMessage = 'Aucun autre contact actif disponible pour la désactivation.Veuillez créer un nouveau contact avant de désactiver celui-ci.';
    
    
    this.closeDesactiverModal();
    this.isErrorModalOpen = true;
    return;
  }else {
      this.desactiver();
    }
         // Debugging line
        //console.log('Other contactsSSSSSSSS:', this.otherContacts); // Debugging line
      }
      

    );
  this.isDesactiverModalOpen = true;
 console.log('Other contactsSSSSSSSSSSSS 33:', this.otherContacts.length);
  
 }else {
      this.desactiver();
    }
  } 
  
  
  
  closeDesactiverModal() {
    this.isDesactiverModalOpen = false;
    this.disactivationForm.reset();
  }


  loadCompanyData(id: number) {
    this.compService.getCompById(id).subscribe(
      (company: any) => {
        this.company = company;
        this.companyStatus = company.status;
       
        });

      }
      contactName: string = '';
      contactStatus: string = '';
  loadContactData(id: number) {
    this.contactservice.findContactById(id).subscribe(
      (contact: any) => {
        this.companyStatus = contact.company.status;
        this.contact.patchValue(contact);
        this.contactName = contact.firstname + ' ' + contact.lastname;
        this.contactStatus = contact.company.status;
        this.idCompany = contact.company.id;
        //console.log('le contact:', contact); 
        //console.log('Contact company:', contact.company); // Debugging line
        this.company = contact.company;
        this.contactBesoins = contact.besoins;
        //console.log('contact besoinssssssssssssssssssssssss:', this.contactBesoins);
      },
      (error: any) => {
        console.error('Error loading contact data:', error);
      }
    );
  }
  
  saveChanges() {
   
    if (this.idContact) {
      // Mode édition
      //console.log('Updating contact with ID:', this.contact.value); // Debugging line
      this.contactservice.updateContact(this.idContact, this.contact.value).subscribe(
        
        (response: any) => {
          //console.log('Contact updated successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'contacte mis à jour avec succès' });
         if(this.wherefrom == 'company'){
                  this.router.navigate(['/addcomp/'+this.idCompany], { queryParams: { modeS: 'contacts' } });}
                  else{this.location.back(); }
        },
        (error: any) => {
          console.error('Error updating contact:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de la mise à jour' });
        }
      );
    } else {
      this.contactsExistants = this.contactsExistants.filter(contact => contact.email == this.contact.value.email && contact.active == true);
   if(this.contactsExistants.length > 0){
    this.globalErrorMessage = 'Un contact actif avec le même email existe déjà.';
    this.isErrorModalOpen = true;
   }else{
      let creationdate = new Date().toISOString();
      this.contact.patchValue({ creationDate: creationdate ,
        createdBy: this.user.id,
      });

      //console.log('Creating new contact:', this.contact.value);
      //console.log('Company ID:', this.idCompany); // Debugging line
      this.contact.patchValue({ company: this.company });
      // Mode création
      this.contactservice.createContact(this.contact.value).subscribe(
        (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'contact créé avec succès' });
          //console.log('where EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', this.wherefrom);
           if(this.wherefrom == 'company'){
                  this.router.navigate(['/addcomp/'+this.idCompany], { queryParams: { modeS: 'contacts' } });}
                  else{this.location.back(); }
        },
        (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de la création' });
        }
      );
    }
    }
  }  
  desactiver(){
    if(this.contactBesoins.length > 0){
      const selectedContact = this.disactivationForm.value.DisactivationContact;
      
      //console.log('Desactivating contact with ID:', this.idContact); 
      //console.log('Selected new contact for besoinsSSSSSSSSSSSSS:', selectedContact);
      
      this.contactBesoins.forEach((besoin: any) => {
        //console.log("besoin naciennnnnnnnnn", besoin);
        //console.log("contact",selectedContact)
        besoin.contact = selectedContact;
        //console.log('besoin nouvellllLLLLLLLL',besoin)
       
        this.besoinservice.updateBesoin(besoin.id, besoin).subscribe(
          (response: any) => {
            //console.log('Besoin mis à jour avec succès:', response);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'besoin mis à jour avec succès' });
            
            // Deactivate the contact after updating besoins
            this.contact.patchValue({ active: false });
            //console.log('Contact form value for update:', this.contact.value);
            
            this.contactservice.updateContact(this.idContact, this.contact.value).subscribe(
              (response: any) => {
                //console.log('Contact desactivé avec succès:', response);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'contact désactivé avec succès' });
                this.closeDesactiverModal();
                this.ngOnInit(); // Reload the contact data
              }
            );
          }
        );
      });
    } else {
      this.contact.patchValue({ active: false });
      this.contactservice.updateContact(this.idContact, this.contact.value).subscribe(
        (response: any) => {
          //console.log('Contact desactivé avec succès:', response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'contact désactivé avec succès' });
        }
      );
    }
  }
  activerContact() {
    this.contact.patchValue({ active: true });
    //console.log('Activating contact with ID:', this.contact.value);
    this.contactservice.updateContact(this.idContact, this.contact.value).subscribe(
      (response: any) => {
        //console.log('Contact activé avec succès:', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'contact activé avec succès' });
       
        this.ngOnInit();
      })
  }
    
  
  
  loadCountries() {
    this.societesPaysList = countries.map((country) => ({
      value: country.name.common,
      name: country.name.common, 
    }));
    this.societesPaysList.sort((a, b) => a.name.localeCompare(b.name));
  }
  getById() {}
  getDataSelect() {}

  loadActions(contact: any) {
    this.actionService.findActionsByContactId(contact).subscribe(
      (actions: any) => {
        //console.log(actions)
        this.contactActions = actions.sort(
          (a:any, b:any) => new Date(b.dateAction).getTime() - new Date(a.dateAction).getTime()
        );
  
        this.contactActions.forEach(element => {
          this.profileService.findUserById(element.createdBy).subscribe(
            (user: any) => {
              element.createdBy = user;
            },
            (error :any) => {
              console.error('Erreur lors de la récupération de l’utilisateur pour l’action', error);
            }
          );
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des actions', error);
      }
    );
  }
  selectModeS(tab: string): void {
    this.modeS = tab;
  
  }
  openActionAddModal(){
    this.loadTypeActions();
    this.actionAddForm.reset();
    
    this.isAddActionModalOpen = true;
  }
  closeActionAddModal(){
    this.isAddActionModalOpen = false;
    this.actionAddForm.reset();
  }
  loadTypeActions() {
    this.typeAction.findTypeActionsByBelongTo("CRM").subscribe(
      (typeActions: any) => {
        this.typeActions = typeActions;
        console.log('Type actions:', this.typeActions);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des typeActions:', error);
      }
    );
  }
  loadProductionManagers(){
    this.profileService.findUSerByRole("Manager De Production").subscribe(
      (users: any) => {
        //console.log('users managers de prod :', users);
        this.productionManagers = users;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des managers de production:', error);
      });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  addAction(): void {

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
      this.actionAddForm.patchValue({
      contactId: this.idContact,
      createdBy: this.user.id,
      manager:this.user,
    });
    }else{
    this.actionAddForm.patchValue({
      contactId: this.idContact,
      createdBy: this.user.id,
      manager:this.productionManagers.find(manager => manager.id == this.actionAddForm.value.manager)
    });
    }
    if (this.actionAddForm.valid) {
      const actionData = this.actionAddForm.value;
      //console.log('actionData:',actionData);
      //console.log('selectedFiles:',this.selectedFiles);
      this.actionService.createActionCrm(actionData, this.selectedFiles).subscribe(
        response => {

          this.message = 'Action enregistrée avec succès';
          
          //this.Dashboard=false;
          this.isAddActionModalOpen = false; 
          this.isModalOpen=true
          this.ngOnInit(); 
          this.modeS="actions" 
          //console.log('Action enregistrée avec succès', response);
          this.actionAddForm.reset();
          this.selectedFiles = [];

        },
        error => {
          console.error('Erreur lors de l\'enregistrement de l\'action', error);
        }
      );
    }
  }
  deletedAction:any;
  openDeleteModal(action: any) {
    this.deletedAction=action;
    this.isDeleteModalOpen = true;
  }
  
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }
  deleteAction(id: number) {
    this.actionService.deleteAction(id).subscribe(
      (response: any) => {
        console.log('Réponse du backend :', response);
        this.isDeleteModalOpen = false;
        this.deletedAction = null;
        this.loadActions(this.idContact);
        
      },
      (error: any) => {
        console.error('Erreur lors de la suppression de l\'action :', error);
      }
    );
  
  }
  openDetailsActionModal(action: any) {

    this.selectedAction = action;
    this.fillActionDetailsForm(action);
    this.isActionDetailsModalOpen = true;
    
  }
   closeModal() {
      this.isModalOpen = false;
      if(this.message=='Action enregistrée avec succès')
      this.closeActionAddModal();
   
      this.closeDetailsActionModal();
          
    }
    isErrorModalOpen: boolean = false;
    globalErrorMessage: string = '';
  


  closeDetailsActionModal() {
    this.isActionDetailsModalOpen = false;
    this.DetailsActionForm.reset();
  }
   closeErrorModal() {
      
      this.isErrorModalOpen = false;
  
      this.globalErrorMessage = '';
      return
    }

  EditAction() {

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
    //console.log("eeeeeeeeeeeeeeevvvvvvvvvvvvvvvvvvv"+ this.DetailsActionForm.value.manager)

    const updatedData = this.DetailsActionForm.value;
    updatedData.besoinId = this.selectedAction.besoinId;
    updatedData.createdBy = this.selectedAction.createdBy.id;
    updatedData.dateAction = new Date(this.selectedAction.dateAction).toISOString();
    updatedData.manager=this.productionManagers.find(manager => manager.id == this.DetailsActionForm.value.manager)

    //console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh"+updatedData?.manager)

    this.actionService.modifyActionCrm(updatedData, this.selectedAction.id, this.selectedFiles).subscribe(
      (response: any) => {
        //console.log(`Action ${updatedData.id} mise à jour`);
        this.message = 'Action modifiée avec succès';
        this.isActionDetailsModalOpen = false;
        this.ngOnInit(); 
        this.modeS="actions" 
        //this.Dashboard=false;
        //this.Dashboard=true;
        
      },
      (error: any) => {
        console.error(`Erreur lors de la mise à jour de l'action ${updatedData.id}`, error);
      }
    );

  }
  fillActionDetailsForm(action: any) {
    this.DetailsActionForm.patchValue({
      id: action.id,
      description: action.description,
      typeAction: action.typeAction,
      dateAction: action.dateAction ? new Date(action.dateAction).toLocaleDateString('fr-FR') : '',
      createdBy: action.createdBy.firstname + ' ' + action.createdBy.lastname,
      contactId: action.contactId,
      manager: action.manager ? action.manager.id : null
    });
    //console.log('hahahhahahahahahahhahahaha',this.DetailsActionForm.value);
    (error: any) => {
    console.error('Erreur lors du chargement de l\'action:', error);
  }

}
retourner() {
  //console.log('return toOOOOOOOOOOOOOOOOO', this.wherefrom); 
  if (this.wherefrom == "company") {
    this.router.navigate(['/addcomp/' + this.idCompany], { queryParams: { modeS: 'contacts' } });
  }else{
    this.router.navigate(['/contact']) ; 
  }

  
 

}
 gotobesoinUpdate(besoin: any) {
    this.router.navigate(['/besoins'], {
  queryParams: {
    besoinIdContact: besoin,
    contactId: this.idContact,
  }
  
  });
  console.log('Navigating to besoin update with params::::::::::::::::::', besoin);
}

onTypeActionBlur() {
  const typeActionControl = this.actionAddForm.get('typeAction');
  if (typeActionControl) {
    typeActionControl.markAsTouched();
    if (!typeActionControl.value || typeActionControl.value === '') {
      typeActionControl.setErrors({ required: true });
    }
  }
}

onManagerBlur() {
  const managerControl = this.actionAddForm.get('manager');
  if (managerControl) {
    managerControl.markAsTouched();
    if (!managerControl.value || managerControl.value === '') {
      managerControl.setErrors({ required: true });
    }
  }
}

}