import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { KanbanCompService } from '../../../services/kanban-comp.service';

import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';

import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ToastModule } from 'primeng/toast';
import { CompServiceService } from '../../../services/comp-service.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, DragDropModule, HttpClientModule,RouterModule,FormsModule,ReactiveFormsModule,MatTableModule,
    CommonModule, MatIconModule,
    MatButton, MatCheckbox,
    MatTooltip,
    MatFormFieldModule,MatIcon,
    MatInputModule,
    ToastModule, PaginatorModule, TableModule, ButtonModule, CheckboxModule, TooltipModule,MatButtonToggleModule,MatLabel,MatButtonModule ],
  providers: [KanbanCompService, CompServiceService, MessageService],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent  implements OnInit {
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

    styleTable = 'p-datatable-sm'
mode: any;
    

  constructor(
    private contactService: ContactsService,
        private messageService: MessageService,
        private router: Router,
        private dialog: MatDialog,
        
  ) {}

  ngOnInit(): void {
  this.listPaginate();
        
   
  }
  performSearch() {

    
}
openFilterDialog(){

}
listPaginate() {
  this.contactService.findAllContacts().subscribe(
      (response: any) => {
          this.liste = response;
          this.dataSource = this.liste;
          console.log('Liste des contact:', this.liste);
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
      this.contactService.deleteContact(contact.id).subscribe(
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
}
