import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';


import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ContactListComponent } from '../contact-list/contact-list.component';
import { ContactKanbanComponent } from '../contact-kanban/contact-kanban.component';

import { ContactsService } from '../../../services/contacts.service';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CompServiceService } from '../../../services/comp-service.service';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactKanbanComponent, ContactListComponent ,CommonModule, DragDropModule, HttpClientModule, RouterModule, FormsModule, ReactiveFormsModule, MatTableModule,
      CommonModule, MatIconModule,
      MatButton, MatCheckbox,
      MatTooltip,
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
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
 
  switchMode($event: MatButtonToggleChange) {
  
  }
  isModalOpen: boolean = false;
    mode: any;
      val: any;
     
      filteredOptions: any;
      companies: any[] = [];
     
    constructor(private contactsService: ContactsService, private fb: FormBuilder,private dialog: MatDialog,
       private serv: CompServiceService,
          
          private router: Router,
    ) { }
  ngOnInit(): void {
    this.mode="kanban";
  }
 
  openFilterDialog(){

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
  
  const company = this.companies.find(c => c.nom === this.companyname);
 console.log('Selected company:', company);
  this.router.navigate([`addcontact/${company.id}`]);
  this.closeAddModal();
}
}
