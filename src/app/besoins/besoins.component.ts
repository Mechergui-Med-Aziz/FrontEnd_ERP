import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDragMove, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { BesoinsService } from '../services/besoins.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../services/contacts.service';
import { ProfileService } from '../services/profile.service';
import { HistoriqueBesoinsService } from '../services/historique-besoins.service';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
import { AuthService } from '../services/auth.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActionService } from '../services/action.service';
import { TypeActionsService } from '../services/type-actions.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';




@Component({
  selector: 'app-besoins',
  standalone: true,
  imports: [CommonModule,DragDropModule,ReactiveFormsModule,MatIconModule,MatButtonModule,MatButtonToggleModule,FormsModule],
  templateUrl: './besoins.component.html',
  styleUrl: './besoins.component.css'
})
export class BesoinsComponent implements OnInit{
  route: any;
  
  constructor(private typeAction:TypeActionsService,  private location: Location,private router: Router ,private activatedRoute: ActivatedRoute,private actionService: ActionService,private AuthSer:AuthService,private hbs:HistoriqueBesoinsService,private ps:ProfileService,private contactsService: ContactsService ,private besoinsService:BesoinsService,private fb: FormBuilder,private profileService : ProfileService) { }
 
  selectedBesoin!: any;
  isModalOpen: boolean = false;
  isAddModalOpen: boolean = false;
  isHistoricModalOpen: boolean = false;
  isAddActionModalOpen: boolean = false;
  isDeleteModalOpen=false;
  isActionDetailsModalOpen: boolean = false;
  isDetailsActionModalOpen: boolean = false;
  creationDate: any;
  nbBesoins: number = 0;
  mode: string = 'kanban';
  besoins: any[] = [];
  Dashboard:any=false;
  selectedTab: string = 'synthese';
  contacts: any[] = [];
  historiqueDuBesoin: any[] = [];
  user!: any 
  productionManagers: any[] = [];
  scrollThreshold = 50; 
  scrollStep = 10;
  filterForm!: FormGroup;
  allBesoins: any[] = []; 
  selectedFilterMethod: string = '';
  showFilterPanel: boolean = false;
  selectedFiles: File[] = [];
  message: string = '';
  selectedAction!: any;
  userr!:any;
  typeActions: any[] = [];
  BesoinActions: any[] = [];
  deletedAction:any;
  manager:  any;
  r:any;

  fullManagerInformations:{manager:any,nbrBesoins:number}[] = [];
  sortAsc: boolean = true; 


  columns: { title: string, status: string, color:string, besoins: any[] }[] = [
    { title: 'À TRAITER', status: 'A_TRAITER', color: "#FFA500", besoins: [] },
    { title: 'ABANDONNÉ', status: 'ABANDONNÉ',color : "#000080", besoins: [] },
    { title: 'OK PRÉ-QUALIFIÉ', status: 'OK_PREQUALIFIE',color: "#00FFFF", besoins: [] },
    { title: 'EN COURS', status: 'EN_COURS',color: "#80FF00", besoins: [] },
    { title: 'GAGNÉ', status: 'GAGNÉ',color: "#0096AA", besoins: [] },
    { title: 'PERDU', status: 'PERDU',color: "#FA0000", besoins: [] },
    { title: 'REPORTÉ', status: 'REPORTE',color: "#FF80FF", besoins: [] }
  ];


  besoinForm = this.fb.group({
    id: [{ value: 0 }, Validators.required],
    title: [{value:''},Validators.required],
    description: [{value:''},Validators.required],
    creationDate: [{value:''},Validators.required],
    status:['',Validators.required],
    contact:[''],
    createdBy:['',Validators.required],
    priority:['',Validators.required],
    managerResponsable:[]
  });

  besoinAddForm = this.fb.group({
    title: [{value:''},Validators.required],
    description: [{value:''},Validators.required],
    creationDate: [{value:new Date().toLocaleDateString('fr-FR')}],
    status:[''],
    contact:[Validators.required],
    createdBy:[],
    priority:[{value:''},Validators.required],
    managerResponsable:[]
  });

  actionAddForm= this.fb.group({
    description: ['', Validators.required],
    typeAction: ['', Validators.required],
    dateAction: [dayjs().toISOString()],
    createdBy: [''],
    besoinId: [],
    manager:[''],
  });

  DetailsActionForm = this.fb.group({
    id: [Validators.required],
    description: [{value:''},Validators.required],
    typeAction: [{value:''},Validators.required],
    dateAction: ['', Validators.required],
    createdBy:'',
    besoinId: [],
    manager:[]
  });

 compF:any;
  comp:any;
  besoinFromCompany:any;
  cont:any;
  ngOnInit() {
   
    this.activatedRoute.queryParams.subscribe(params => {
  this.r = params['c'];
  this.comp = params['id'];
  this.cont = params['idC'];
  
});

    this.profileService.findUserById(Number(localStorage.getItem('id'))).subscribe(
      (user: any) => {
        this.user = user;
      })
//take besoin from add company or addcontact component
this.activatedRoute.queryParams.subscribe(params => {
    this.besoinIdFromCompany = params['besoinId']; 
    this.besoinIdFromContact = params['besoinIdContact']
    this.compF = params['companyId'];
    this.contF =params['contactId'];
    console.log('besoinFromCompanyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY:', this.besoinIdFromCompany);
    console.log('besoinFromCompanyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY:', this.besoinIdFromContact);
    });
    if (this.besoinIdFromCompany) {
      
      this.besoinsService.findBesoinsById(this.besoinIdFromCompany).subscribe(
  (besoin: any) => {
    
    this.besoinFromCompany = besoin;
    console.log('BesoinFromCompanyYYYYYYYYYYY11111111111:', this.besoinFromCompany);
      this.ps.findUserById(besoin.createdBy).subscribe(
        (user: any) => {
          console.log('besoinn  DDDDDDDDDDDDDDDDDDDDDDDDDDDDD:', besoin);
          this.besoinFromCompany.createdBy = user;
          console.log('Besoin avec utilisateurDDDDDDDDDDDDDDDDDDDDDDDDDDDD:', this.besoinFromCompany);
          this.openModal(this.besoinFromCompany);
        },
        (error: any) => {
    console.error('Erreur lors de la récupération du besoin:', error);
  });

      
     
   
  },
  (error: any) => {
    console.error('Erreur lors de la récupération du besoin:', error);
  }
);}else if (this.besoinIdFromContact) {
  this.besoinsService.findBesoinsById(this.besoinIdFromContact).subscribe(
  (besoin: any) => {
    
    this.besoinFromContact = besoin;
    console.log('BesoinFromContactttTTTTTTTTTYYYYYYYYYYY:', this.besoinFromContact);
      this.ps.findUserById(besoin.createdBy).subscribe(
        (user: any) => {
          console.log('besoinn  DDDDDDDDDDDDDDDDDDDDDDDDDDDDD:', besoin);
          this.besoinFromContact.createdBy = user;
          console.log('Besoin avec utilisateurDDDDDDDDDDDDDDDDDDDDDDDDDDDD:', this.besoinFromContact);
          this.openModal(this.besoinFromContact);
        },
        (error: any) => {
    console.error('Erreur lors de la récupération du besoin:', error);
  });

      
     
   
  },
  (error: any) => {
    console.error('Erreur lors de la récupération du besoin:', error);
  }
);
}






    this.nbBesoins = 0;
    this.loadBesoins();
    this.loadContacts();
    this.loadProductionManagers();
    this.filterForm = this.fb.group({
      company: [''],
      contact: [''],
      dateExact: [''],
      startDate: [''],
      endDate: [''],
      managerResponsable:['']
    });
    this.loadProductionManagers();
     if(this.r =='company'|| this.r=='contact'){
      
      this.openAddModal()
    }
  

    

  }
  besoinIdFromCompany: any;
  besoinIdFromContact: any;
  contF:any;
  besoinFromContact: any;

  loadBesoins() {
    this.allBesoins = [];
    this.nbBesoins = 0;
    this.columns.forEach(column => {
      this.besoinsService.findBesoinByStatus(column.status).subscribe(
        (besoins: any) => {
          besoins.sort((a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
          column.besoins = besoins;
          besoins.forEach((element: any) => {
            this.allBesoins.push(element);
            if (parseInt(element.contact)) {
              this.loadContact(element);
            }
          });
          if (column.status !== 'REPORTE' && column.status !== 'PERDU' && column.status !== 'GAGNÉ') {
            this.nbBesoins += besoins.length;
          }
          this.besoins = this.allBesoins;
          this.besoins.forEach((element: any) => {
            if(Number(element.createdBy)){
            this.profileService.findUserById(element.createdBy).subscribe(
              (user: any) => {
                element.createdBy = user;
              },
              (error: any) => {
                console.error('Erreur lors du chargement de l\'utilisateur:', error);
              }
            );}
          })
        },
        (error: any) => {
          console.error(`Erreur lors du chargement des besoins pour le statut ${column.status}:`, error);
        }
      );
    });
  }

  loadProductionManagers() {
    this.profileService.findUSerByRole("Manager De Production").subscribe(
      (users: any) => {
        this.productionManagers = users.filter((user: any) => user.status === 'Activé');
  
        this.fullManagerInformations = [];
  
        this.productionManagers.forEach(manager => {
          const nbrBesoins = this.besoins.filter(
            (besoin: any) => besoin.managerResponsable?.id === manager.id && besoin.status !== 'PERDU' && besoin.status !== 'GAGNÉ' && besoin.status !== 'REPORTE'
          ).length;
          console.log()
          this.fullManagerInformations.push({
            manager: manager,
            nbrBesoins: nbrBesoins
          });
        });
      },
      (error: any) => {
        console.error('Erreur lors du chargement des managers de production:', error);
      }
    );
  }
  

  loadContacts() {
    this.contactsService.findAllContacts().subscribe(
      (contacts: any) => {
        console.log('ContactsRRRRRRRRRRRRRRRRR:', contacts); // Debugging line
        console.log('this.compRRRRRRRR:', this.comp); // Debugging line
       if(this.comp){
        this.contacts=contacts.filter((contact: any) => contact.company.id == this.comp);
        console.log('Filtered contactsRRRRRRRR:', this.contacts); // Debugging line
       }else{
        this.contacts = contacts;}

      },
      (error: any) => {
        console.error('Erreur lors du chargement des contacts:', error);
      });
    }

    loadContact(besoin: any) {
      //console.log('besoin:',besoin);
      this.contactsService.findContactById(besoin.contact).subscribe(
        (contact: any) => {
          besoin.contact = contact;
        },
        (error: any) => {
          console.error(`Erreur lors du chargement du contact ${besoin.contact}:`, error);
        }
      );
    }


    onDragMoved(event: CdkDragMove<any>): void {
      const container = this.scrollContainer.nativeElement;
      const containerRect = container.getBoundingClientRect();
      const pointerX = event.pointerPosition.x;
  
      if (pointerX < containerRect.left + this.scrollThreshold) {
        container.scrollLeft -= this.scrollStep;
      }
      else if (pointerX > containerRect.right - this.scrollThreshold) {
        container.scrollLeft += this.scrollStep;
      }
    }

    drop(event: CdkDragDrop<any[], any, any>, newStatus: string) {
      if(this.user.role=='Manager De Production')
        return
      const previousContainer = event.previousContainer;
      const currentContainer = event.container;
    
      if (previousContainer === currentContainer) {
        moveItemInArray(currentContainer.data, event.previousIndex, event.currentIndex);
      } else {
        const movedItem = previousContainer.data[event.previousIndex];
    
        transferArrayItem(
          previousContainer.data,
          currentContainer.data,
          event.previousIndex,
          event.currentIndex
        );
        const contactId = movedItem.contact ? movedItem.contact.id : null;
        //console.log('contactId:', movedItem);
    
        movedItem.status = newStatus;
        movedItem.contact=this.contacts.find(contact => contact.id == contactId);
    
        //console.log('Besoin déplacé:', movedItem);
        //console.log('Nouveau statut:', newStatus);
        if(movedItem.status=='PERDU' || movedItem.status=='GAGNÉ' || movedItem.status=='REPORTE'){
          movedItem.priority='RIEN';
        }
        movedItem.createdBy=movedItem.createdBy.id;
        this.besoinsService.updateBesoin(movedItem.id,movedItem).subscribe(
          (response: any) => {
            //console.log(`Besoin ${movedItem.id} mis à jour avec le statut ${newStatus}`);
            this.ngOnInit();
  
            const movedHistoricBesoin = {
              besoinId: movedItem.id,
              title: movedItem.title,
              description: "Changement de statut",
              actionDate: dayjs().toISOString(),
              status: movedItem.status,
              actionBy: this.user.id,
            };
            
           // console.log('Historique besoin changé:', movedHistoricBesoin);
            this.hbs.addHistoriqueBesoin(movedHistoricBesoin).subscribe(
              (response: any) => {
               // console.log('Statut d\'historique changé avec succès:', response);
              },
              (error: any) => {
                console.error('Erreur lors du changement du statut de l\'historique:', error);
              }
            );
          },
          (error: any) => {
            console.error(`Erreur lors de la mise à jour du besoin ${movedItem.id}`, error);
          }
        );
      }
    }


    addBesoin() {
      console.log('contttacctt ', this.cont);
    if(this.r=='contact'){
      this.besoinAddForm.patchValue({
        contact:this.cont,

      });
    }

    const formValue = this.besoinAddForm.value;
    console.log('formValueEEEEEEEE:', formValue);
      const contactId = formValue.contact;
      const contactObject = this.contacts.find(contact => contact.id == contactId);
    
      if (!contactObject) {
        console.error("Contact non valide !");
        return;
      }
    //console.log('contactObject:',contactObject);
      const newBesoin = {
        title: formValue.title,
        description: formValue.description,
        creationDate: new Date().toISOString(), 
        status: "A_TRAITER",
        contact: contactObject, 
        createdBy:this.user.id,
        priority: formValue.priority,
        managerResponsable:null
      };
    
      if(formValue.managerResponsable!=null && this.user.role=='Directeur Associé'){ 
        newBesoin.managerResponsable=this.productionManagers.find(manager => manager.id == formValue.managerResponsable);
      }
    
      //console.log('Données envoyées:', newBesoin);
    
      this.besoinsService.addBesoin(newBesoin).subscribe(
        (response: any) => {
          //console.log('Backend response:', response);
          this.ngOnInit();
          this.isAddModalOpen = false;
          //console.log(newBesoin.creationDate);
          this.besoinsService
      .findBesoinByCreationDate(dayjs(newBesoin.creationDate).format('YYYY-MM-DD HH:mm:ss'))
      .subscribe(
        (besoin: any) => {
          //console.log('Besoin récupéré:', besoin);
          const newHistoricBesoin = {
            besoinId: besoin.id,
            title: besoin.title,
            description: "Creation",
            actionDate: besoin.creationDate,
            status: "A_TRAITER",
            actionBy: this.user.id,
          };
          //console.log('Historique besoin:', newHistoricBesoin);
          this.hbs.addHistoriqueBesoin(newHistoricBesoin).subscribe(
            (response: any) => {
              //console.log('Historique ajouté avec succès:', response);
            },
            (error: any) => {
              console.error('Erreur lors de l\'ajout de l\'historique:', error);
            }
          );
        },
        (error: any) => {
          console.error('Erreur lors de la récupération du besoin:', error);
        }
      );
        },
        (error: any) => {
          console.error('erreur lors de l\'ajout de besoin:', error);
        }
      );
      if (this.r =='company'||this.r=='contact') {
        this.location.back();
      }
      if (this.r =='company') {  
                  this.router.navigate(['/addcomp/'+this.comp], { queryParams: { modeS: 'besoin' } });
                }else if (this.r=='contact') {
                  this.router.navigate(['/updatecontact/'+this.cont], { queryParams: { modeS: 'besoin' } });
                }
    }

    saveChanges() {
      //this.loadManager(this.besoinForm.value.managerResponsable);  
      //console.log ("idddddddddddd"+this.besoinForm.value.managerResponsable);
      const updatedData = this.besoinForm.value;
      //console.log('updatedData:',updatedData);
      updatedData.contact = this.selectedBesoin.contact;
      updatedData.managerResponsable=this.productionManagers.find(manager => manager.id == this.besoinForm.value.managerResponsable);
      //console.log('updatedData.managerResponsable:',updatedData.managerResponsable);
      updatedData.creationDate = this.selectedBesoin.creationDate;
      
      if(updatedData.status=='PERDU' || updatedData.status=='GAGNÉ' || updatedData.status=='REPORTE'){
        updatedData.priority='RIEN';
      }
      //console.log('updatedData:',updatedData);
      updatedData.createdBy= this.userr.id;
      
      updatedData.createdBy = this.selectedBesoin.createdBy.id;
      
      const id = Number(updatedData.id);
      
      this.besoinsService.updateBesoin(id, updatedData).subscribe(
        (response: any) => {
          
        //  console.log(`Besoin ${updatedData.id} mis à jour`);
          this.ngOnInit();
          this.closeModal();
          const movedHistoricBesoin = {
            besoinId: updatedData.id,
            title: updatedData.title,
            description: "Changement de statut",
            actionDate: dayjs().toISOString(), // Format ISO 8601, par exemple "2025-04-09T15:30:06.000+01:00"
            status: updatedData.status,
            actionBy: this.user.id,
          };
            //console.log('Historique besoin changé:', movedHistoricBesoin);
          if(this.selectedBesoin.status!=movedHistoricBesoin.status){
            // Wait for both update and history operations to complete before navigating
            this.hbs.addHistoriqueBesoin(movedHistoricBesoin).subscribe(
              (historyResponse: any) => {
                //console.log('Statut d\'historique changé avec succès:', historyResponse);
                // Only navigate after history is updated
                if (this.besoinIdFromCompany) {  
                  this.router.navigate(['/addcomp/'+this.compF], { queryParams: { modeS: 'besoin' } });
                }else if (this.besoinIdFromContact) {
                  this.router.navigate(['/updatecontact/'+this.contF], { queryParams: { modeS: 'besoin' } });
                }
                this.closeDashboard();
              },
              (error: any) => {
                console.error('Erreur lors du changement du statut de l\'historique:', error);
                this.closeDashboard();
              }
            );
          } else {
            // If no history update needed, navigate immediately after besoin update
            if (this.besoinIdFromCompany) {  
              this.router.navigate(['/addcomp/'+this.compF], { queryParams: { modeS: 'besoin' } });
            }
            else if (this.besoinIdFromContact) {
              this.router.navigate(['/updatecontact/'+this.contF], { queryParams: { modeS: 'besoin' } });
            }
            this.closeDashboard();
          }
          
        },
        (error: any) => {
          console.error(`Erreur lors de la mise à jour du besoin ${updatedData.id}`, error);
        }
      );
          
    }


    fillForm(besoin: any) {
      this.ps.findUserById(besoin.createdBy.id).subscribe(

        (user: any) => {
          console.log('User DDDDDDDDDDDDDDDDDDDDDDDDDDDDD:', user);
          this.userr = user;
        }
      );
    
      this.selectedBesoin = besoin;
      this.creationDate = new Date(besoin.creationDate).toLocaleDateString('fr-FR');
    
      this.besoinForm.patchValue({
        id: besoin.id,
        title: besoin.title,
        description: besoin.description,
        creationDate: this.creationDate,
        status: besoin.status,
        contact: besoin.contact ? besoin.contact.firstname + ' ' + besoin.contact.lastname : '',
        createdBy: besoin.createdBy.firstname + ' ' + besoin.createdBy.lastname,
        priority: besoin.priority,
        managerResponsable: besoin.managerResponsable ? besoin.managerResponsable.id : null
      });
    }

    openAddModal() {
      this.besoinAddForm.reset();
      this.isAddModalOpen = true;
    }
    closeAddModal() {
      this.isAddModalOpen = false;
      this.besoinAddForm.reset();
     
      if (this.r =='company') {  
                  this.router.navigate(['/addcomp/'+this.comp], { queryParams: { modeS: 'besoin' } });
                }else if (this.r=='contact') {
                  this.router.navigate(['/updatecontact/'+this.cont], { queryParams: { modeS: 'besoin' } });
                }
    }

    openModal(besoin: any) {
      console.log('Besoin ouvertTTTTTTTTTTT:', besoin);
      this.fillForm(besoin);
      this.Dashboard=true;
      this.getHistoricBesoin(besoin);
      this.selectTab("synthese");   
    }
    closeModal() {
      this.isModalOpen = false;
      if(this.message=='Action enregistrée avec succès')
      this.closeActionAddModal();
      this.closeDetailsActionModal();
    }

    closeDashboard() {
      this.Dashboard=false;
      if (this.r =='company'||this.besoinIdFromCompany) {  
                   if(this.compF){
                  this.router.navigate(['/addcomp/'+this.compF], { queryParams: { modeS: 'besoin' } });
                }else{
                    this.router.navigate(['/addcomp/'+this.comp], { queryParams: { modeS: 'besoin' } });
                  }}else if (this.r=='contact'||this.besoinIdFromContact) {
                  if(this.contF){
                  this.router.navigate(['/updatecontact/'+this.contF], { queryParams: { modeS: 'besoin' } });}else{
                    this.router.navigate(['/updatecontact/'+this.cont], { queryParams: { modeS: 'besoin' } });
                  }
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
      this.actionAddForm.patchValue({
        besoinId: this.selectedBesoin.id,
        createdBy: this.user.id,
        manager:this.productionManagers.find(manager => manager.id == this.actionAddForm.value.manager)
      });
      if (this.actionAddForm.valid) {
        const actionData = this.actionAddForm.value;
        console.log('actionData:',actionData);
        //console.log('selectedFiles:',this.selectedFiles);
        actionData.manager=this.selectedBesoin.managerResponsable;
        this.actionService.createActionBesoin(actionData, this.selectedFiles).subscribe(
          response => {
  
            this.message = 'Action enregistrée avec succès';
            this.isModalOpen=true
            //this.Dashboard=false;
            this.selectTab("actions")
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

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        this.selectedFiles = Array.from(input.files);
      }
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
  
      this.actionService.modifyActionBesoin(updatedData, this.selectedAction.id, this.selectedFiles).subscribe(
        (response: any) => {
          //console.log(`Action ${updatedData.id} mise à jour`);
          this.message = 'Action modifiée avec succès';
          this.isActionDetailsModalOpen = false;
          this.isModalOpen=true
          //this.Dashboard=false;
          //this.Dashboard=true;
          this.selectTab("actions")
        },
        (error: any) => {
          console.error(`Erreur lors de la mise à jour de l'action ${updatedData.id}`, error);
        }
      );
  
    }

    deleteAction(id: number) {
      this.actionService.deleteAction(id).subscribe(
        (response: any) => {
          //console.log('Réponse du backend :', response);
          this.isDeleteModalOpen = false;
          this.deletedAction = null;
          this.loadActions(this.selectedBesoin);
          this.selectTab("actions");
        },
        (error: any) => {
          console.error('Erreur lors de la suppression de l\'action :', error);
        }
      );
    
    }

    openActionAddModal(){
      this.loadTypeActions();
      this.isAddActionModalOpen = true;
    }

    closeActionAddModal(){
      this.isAddActionModalOpen = false;
      this.actionAddForm.reset();
    }

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
     // console.log(this.DetailsActionForm.value.manager);
      (error: any) => {
      console.error('Erreur lors du chargement de l\'action:', error);
    }

}

openDetailsActionModal(action: any) {

  this.selectedAction = action;
  this.fillActionDetailsForm(action);
  this.isActionDetailsModalOpen = true;
}

closeDetailsActionModal() {
  this.isActionDetailsModalOpen = false;
  this.DetailsActionForm.reset();
}

openDeleteModal(action: any) {
  this.deletedAction=action;
  this.isDeleteModalOpen = true;
}

closeDeleteModal() {
  this.isDeleteModalOpen = false;
}

loadManager(id:any){
  this.profileService.findUserById(id).subscribe(
  (user: any) => {
    this.manager= user;
    //console.log('selectedBesoin.managerResponsable:',this.manager);
  },
  (error: any) => {
    console.error('Erreur lors du chargement du manager responsable:', error);
  }
);
}

loadActions(besoin: any) {
  this.actionService.findActionsByBssoinId(besoin.id).subscribe(
    (actions: any) => {
      //console.log(actions)
      this.BesoinActions = actions.sort(
        (a:any, b:any) => new Date(b.dateAction).getTime() - new Date(a.dateAction).getTime()
      );

      this.BesoinActions.forEach(element => {
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

loadTypeActions() {
  this.typeAction.findTypeActionsByBelongTo("Besoin").subscribe(
    (typeActions: any) => {
      this.typeActions = typeActions;
    },
    (error: any) => {
      console.error('Erreur lors du chargement des typeActions:', error);
    }
  );
}

filterBesoins(): void {
  const { company, contact, dateExact, startDate, endDate,managerResponsable } = this.filterForm.value;
  let filtered = this.allBesoins;
  console.log('filtered:', this.filterForm.value);

  if(this.selectedFilterMethod=="nonAffectedbesoin"){
    filtered = filtered.filter(besoin => !besoin.managerResponsable);
  }

  if(this.selectedFilterMethod === 'managerResponsable' && managerResponsable && managerResponsable.trim() !== '') {
    const searchLower = managerResponsable.trim().toLowerCase();
    console.log('searchLower:',searchLower);
    filtered = filtered.filter(besoin => {
      if (besoin.managerResponsable) {
        console.log('besoin.contact.company.name:',besoin.managerResponsable.firstname);
        console.log('searchLower:',searchLower);
        const firstname = (besoin.managerResponsable.firstname || '').toLowerCase();
        const lastname = (besoin.managerResponsable.lastname || '').toLowerCase();
        return firstname.includes(searchLower) || lastname.includes(searchLower);
      }
      return false;
    });
  }


  if(this.selectedFilterMethod === 'company' && company && company.trim() !== '') {
    const searchLower = company.trim().toLowerCase();
    console.log('searchLower:',searchLower);
    filtered = filtered.filter(besoin => {
      if (besoin.contact.company.name) {
        console.log('besoin.contact.company.name:',besoin.contact.company.name);
        console.log('searchLower:',searchLower);
        const companyName = (besoin.contact.company.name || '').toLowerCase();
        return companyName.includes(searchLower);
      }
      return false;
    });
  }

  if (this.selectedFilterMethod === 'contact' && contact && contact.trim() !== '') {
    const searchLower = contact.trim().toLowerCase();
    filtered = filtered.filter(besoin => {
      if (besoin.contact) {
        const firstname = (besoin.contact.firstname || '').toLowerCase();
        const lastname = (besoin.contact.lastname || '').toLowerCase();
        return firstname.includes(searchLower) || lastname.includes(searchLower);
      }
      return false;
    });
  }

  if (this.selectedFilterMethod === 'dateExact' && dateExact) {
    filtered = filtered.filter(besoin =>
      dayjs(besoin.creationDate).format('YYYY-MM-DD') === dayjs(dateExact).format('YYYY-MM-DD')
    );
  }

  if (this.selectedFilterMethod === 'dateRange') {
    if (startDate && endDate) {
      filtered = filtered.filter(besoin =>
        dayjs(besoin.creationDate).isBetween(dayjs(startDate), dayjs(endDate), 'day', '[]')
      );
    } else if (startDate) {
      filtered = filtered.filter(besoin =>
        dayjs(besoin.creationDate).isSameOrAfter(dayjs(startDate), 'day')
      );
    } else if (endDate) {
      filtered = filtered.filter(besoin =>
        dayjs(besoin.creationDate).isSameOrBefore(dayjs(endDate), 'day')
      );
    }
  }
  this.besoins = filtered;


  this.columns.forEach(column => {
    column.besoins = filtered.filter(besoin => besoin.status === column.status);
  });

  
  this.nbBesoins = 0;
  this.columns.forEach(column => {
    if (column.status !== 'REPORTE' && column.status !== 'PERDU' && column.status !== 'GAGNÉ') {
      this.nbBesoins += column.besoins.length;
    }
  });

  //console.log('Besoins filtrés :', filtered);
}


  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.loadActions(this.selectedBesoin);
  }

  switchMode($event: MatButtonToggleChange) {
  
  }

  
  
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  scrollKanban(direction: 'left' | 'right'): void {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = 300;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }


  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
    
    if (!this.showFilterPanel) {
      this.selectedFilterMethod = '';
      this.filterForm.reset();
      this.ngOnInit();
    }
  }


  getPriorityColor(priority: string): string {
    // console.log('priority:',priority);
     switch (priority) {
       case 'TRÉS_HAUTE':
         return '#e10303'; // rouge
       case 'HAUTE':
         return '#df7104'; // orange
       case 'MOYENNE':
         return '#eae40f'; // jaune
       case 'BASSE':
         return '#26cc05'; // vert
       default:
         return '#CCCCCC'; // gris par défaut
     }
   }

   getStatusColor(status: string): string {
    const column = this.columns.find(col => col.status === status);
    return column ? column.color : '#999999'; // couleur par défaut si non trouvé
  }
  
 
   getHistoricBesoin(besoin :any){
     //console.log('besoin:',besoin);
     this.hbs.findHistoriqueBesoinsById(besoin.id).subscribe(
       (historique: any) => {
        // console.log('Historique:', historique);
         historique.sort((a: any, b: any) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
         this.historiqueDuBesoin = historique;
         this.historiqueDuBesoin.forEach(element => {
           this.profileService.findUserById(element.actionBy).subscribe(
             (user: any) => {
          //     console.log('User:', user);
               element.actionBy = user.firstname + ' ' + user.lastname;
             }
           );
           
         });
       },
       (error: any) => {
         console.error('Erreur lors du chargement de l\'historique:', error);
       }
     );
     //console.log('historiqueDuBesoin:',this.historiqueDuBesoin);
     this.isHistoricModalOpen = true;
   }
   
   closeHistoricModal() {
     this.isHistoricModalOpen = false;
   }
   

   sortPriority() {
     const priorityOrder: { [key: string]: number } = {
       'BASSE': 1,
       'MOYENNE': 2,
       'HAUTE': 3,
       'TRÉS_HAUTE': 4
     };
   
     this.besoins.sort((a, b) => {
       const valueA = priorityOrder[a.priority] || 0;
       const valueB = priorityOrder[b.priority] || 0;
   
       return this.sortAsc ? valueA - valueB : valueB - valueA;
     });
   
     this.sortAsc = !this.sortAsc;
   }

   sortDate() {
     this.besoins.sort((a, b) => {
       const dateA = new Date(a.creationDate).getTime();
       const dateB = new Date(b.creationDate).getTime();
   
       return this.sortAsc ? dateA - dateB : dateB - dateA;
     });
   
     this.sortAsc = !this.sortAsc;
   }
   
 }
