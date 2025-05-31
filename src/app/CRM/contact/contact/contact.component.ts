import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';


import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { MessageService } from 'primeng/api';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ToastModule } from 'primeng/toast';

import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';


import { ContactsService } from '../../../services/contacts.service';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CompServiceService } from '../../../services/comp-service.service';
import { KanbanCompService } from '../../../services/kanban-comp.service';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { forEach } from 'cypress/types/lodash';

// Extend dayjs with required plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ CommonModule, DragDropModule, HttpClientModule, RouterModule, FormsModule, ReactiveFormsModule, MatTableModule,
      CommonModule, MatIconModule,
      
      MatFormFieldModule, MatIcon,
      MatInputModule,
      ToastModule, PaginatorModule, TableModule, ButtonModule, CheckboxModule, TooltipModule, MatButtonToggleModule, MatLabel, MatButtonModule, MatIconModule,
      MatButtonModule,
      MatAutocompleteModule,
      MatInputModule,
      ReactiveFormsModule,
      CommonModule,
      MatDialogModule ],
  templateUrl: './contact.component.html',
  providers: [KanbanCompService, CompServiceService, MessageService],
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  
 
  switchMode($event: MatButtonToggleChange) {
  
  }
  isModalOpen: boolean = false;
    mode: any;
      val: any;
      nbContacts: number = 0;
     
      filteredOptions: any;
      companies: any[] = [];
      statut:any;
      selectedContact: any;
      
      creationDate: any;
      userrole: any;
     
    constructor(private contactsService: ContactsService, private fb: FormBuilder,private dialog: MatDialog,
       private serv: CompServiceService,
       
       private messageService: MessageService,
          
          private router: Router,
    ) { }
     @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
    scrollKanban(direction: 'left' | 'right'): void {
      const container = this.scrollContainer.nativeElement;
      const scrollAmount = 300; // Ajuste la valeur selon tes besoins
  
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
   
    columns: { title: string, statut: string, color:string, contacts: any[] }[] = [
      { title: 'Prospect', statut: 'Prospect', color: "#FFA500", contacts: [] },
      { title: 'Client', statut: 'Client',color : "#000080", contacts: [] },
      { title: 'Client direct', statut: 'Client direct',color: "#00FFFF", contacts: [] },
      { title: 'Partenaire', statut: 'Partenaire',color: "#80FF00", contacts: [] },
      { title: 'Piste', statut: 'Piste',color: "#0096AA", contacts: [] },
      { title: 'Fournisseur', statut: 'Fournisseur',color: "#FA0000", contacts: [] },
      { title: 'Archivé', statut: 'Archivé',color: "#FF80FF", contacts: [] },
      { title: 'Intermédiaire de facturation', statut: 'Intermédiaire de facturation',color: "brown", contacts: [] },
      { title: 'Client via intermédiaire', statut: 'Client via intermédiaire',color: "gray", contacts: [] },
    ];
  ngOnInit(): void {
    this.mode="kanban";
    this.nbContacts = 0;
    const storedRole = localStorage.getItem('role');
    this.userrole = storedRole;
    this.loadContacts();
    this.listPaginate();
    this.filterForm = this.fb.group({
      
      company: [''],
      contact: [''],
      dateExact: [''],
      startDate: [''],
      endDate: ['']
    });
  }
 
  // Removed duplicate implementation of openFilterDialog
  drop(event: CdkDragDrop<any[]>) {
    
  }
  
openAddModal() {
  console.log('openAddModal');
  this.companyname = null;
  this.isModalOpen = true;
  this.serv.getComps().subscribe(
    (response: any) => {
        this.companies = response;
        
        console.log('Liste des sociétés:', this.companies);
    },
    (error: any) => { console.error('Erreur lors de la récupération des sociétés:', error); }
);  }
closeAddModal() {
  this.isModalOpen = false;
 this.companyname = null;
}

companyname :any;


create() {
  
  const company = this.companies.find(c => c.name === this.companyname);
 console.log('Selected company:', company);
  this.router.navigate([`addcontact/${company.id}`]);
  this.closeAddModal();
}


loadContacts() {
  this.columns.forEach(column => {
    console.log('Statut:', column.statut); // Debugging line
    this.serv.findCompanyByStatus(column.statut).subscribe(
      (response: any) => {
        response.forEach ((company: any) => {
this.nbContacts += company.contacts.length;
company.contacts.forEach((contact: any) => {
  contact.company = company; // Associer la société au contact
  let contactss:any[] = [];
  contactss.push(contact);
  console.log('ContactTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT:', contact); // Debugging line
 column.contacts=contactss;
})
        });
        
        
        },
      (error: any) => {
        console.error(`Erreur lors du chargement des contact pour le statut ${column.statut}:`, error);
      }
    );
  });
}























checked: any[] = [];
    columnName: string[] = ['check', 'Société', 'Secteur', 'Informations', 'État', 'Coordonnées', 'Lieu', 'Manager'];
    @Input()
    liste: any[] = [];
    interminate: boolean = false;
    allComplete: boolean = false;
    //dataSource = new MatTableDataSource<any>();
    dataSource: any[] = [];
    @Output()
    onClick = new EventEmitter<any>();

    @Output()
    refreshClick = new EventEmitter<any>();

    size: number = 10;
    page: number = 0;
    first: boolean = false;
    last: boolean = false;
    totalElements: number = 0;
    totalPages: number = 0;
    debouncedSearchValue: string = '';
    selectedFilterMethod: string = '';
    showFilterPanel: boolean = false;
    filterForm!:FormGroup;

    styleTable = 'p-datatable-sm'

performSearch() {

    
}
openFilterDialog(){

}
listPaginate() {
  this.contactsService.findAllContacts().subscribe(
      (response: any) => {
          this.liste = response;
          this.dataSource = this.liste;
          console.log('Liste des contactAAAAAAAAAAAAAAAAAAA:', this.liste);
      },
      (error: any) => { console.error('Erreur lors de la récupération des sociétés:', error); }
  );  
      
}





viewSite(url:any) {
    if (url.includes('http') == false)
        url = 'https://' + url;
    url.replace('http://', 'https://')
    window.open(url, '_blank');
}
viewPhone(phone :any) {
    let link = `tel:${phone}`;

    window.location.href = link;
}





deleted() {/*
    const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        data: {
            title: 'Voulez-vous supprimer?',
        }
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) this.deleteCompany();
        else return;
    });*/
}

paginate(event:any) {
    this.page = event.page;
    this.size = event.rows;
    this.totalPages = event.pageCount;
    this.listPaginate();
}


imageUrl(company:any) {/*
    return this.imageServ.getFile(company.pictureName);*/
}
editContact(contact: any) {
    this.router.navigate(['/updatecontact', contact.id]); // ou company._id selon votre modèle
  }
  
  deleteContact(contact: any) {
    
    if (confirm('Voulez-vous vraiment supprimer cette société ?')) {
        console.log('Suppression du contact:', contact.id);
      this.contactsService.deleteContact(contact.id).subscribe(
        (response: any) => {
          console.log('Contact supprimé avec succès:', response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Société supprimée avec succès' });
          this.listPaginate(); // Rafraîchir la liste
        },
        (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de la suppression' });
        }
      );
    }
  }





  filterContacts(): void {
    
    const { contact ,company,  dateExact, startDate, endDate } = this.filterForm.value;
    let filtered = this.liste;
    console.log('filterContacts called DDDDDDDDDDEDED  ' ,this.liste);
    console.log('filtered:', this.filterForm.value);

    if(this.selectedFilterMethod !="" && company=="" && contact=="" && dateExact=="" && startDate=="" && endDate=="") {
      this.ngOnInit()
      }
  
    if(this.selectedFilterMethod === 'company' && company && company.trim() !== '') {
  
      const searchLower = company.trim().toLowerCase();
      console.log('searchLower:',searchLower);
      filtered = filtered.filter(contact => {
        if (contact.company.name) {
          console.log('besoin.contact.company.nameEEEEEEEEEEE:',contact.company.name);
          console.log('searchLower:',searchLower);
          const companyName = (contact.company.name || '').toLowerCase();
          return companyName.includes(searchLower);
        }
        return false;
      });
    }
    if(this.selectedFilterMethod === 'contact' && contact && contact.trim() !== '') {
  
      const searchLower = contact.trim().toLowerCase();
      console.log('searchLower:',searchLower);
      filtered = filtered.filter(contact => {
        if (contact.firstnamename+contact.lastname) {
          console.log('contact.name:',contact.firstname);
          console.log('searchLower:',searchLower);
          const contactName = (contact.firstname+contact.lastname || '').toLowerCase();
          return contactName.includes(searchLower);
        }
        return false;
      });
    }
  
    
  
    if (this.selectedFilterMethod === 'dateExact' && dateExact) {
      filtered = filtered.filter(contact =>
        dayjs(contact.creationDate).format('YYYY-MM-DD') === dayjs(dateExact).format('YYYY-MM-DD')
      );
    }
  
    if (this.selectedFilterMethod === 'dateRange') {
      if (startDate && endDate) {
        filtered = filtered.filter(contact =>
          dayjs(contact.creationDate).isBetween(dayjs(startDate), dayjs(endDate), 'day', '[]')
        );
      } else if (startDate) {
        filtered = filtered.filter(contact =>
          dayjs(contact.creationDate).isSameOrAfter(dayjs(startDate), 'day')
        );
      } else if (endDate) {
        filtered = filtered.filter(contact =>
          dayjs(contact.creationDate).isSameOrBefore(dayjs(endDate), 'day')
        );
      }
    }
    this.liste = filtered;
  
  
    this.columns.forEach(column => {
      column.contacts = filtered.filter(contact => contact.company.status === column.statut);
    });
  
    
    this.nbContacts = 0;
    this.columns.forEach(column => {
      if (column.statut !== 'REPORTE' && column.statut !== 'PERDU' && column.statut !== 'GAGNÉ') {
        this.nbContacts += column.contacts.length;
      }
    });
  
    //console.log('Besoins filtrés :', filtered);
  }
  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
    
    if (!this.showFilterPanel) {
      this.selectedFilterMethod = '';
      this.filterForm.reset();
      this.ngOnInit();
    }
  }
  
  onDragMoved(event: any): void {
    // Cette méthode gère les mises à jour de l'interface utilisateur pendant l'opération de glisser-déposer
    // Elle peut être utilisée pour faire défiler le conteneur lors du glissement près des bords
  }
  
}

