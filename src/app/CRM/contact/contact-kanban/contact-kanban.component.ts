import { Component ,ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../../../services/contacts.service';
import { RouterModule } from '@angular/router';
import { CompServiceService } from '../../../services/comp-service.service';

@Component({
  selector: 'app-contact-kanban',
  standalone: true,
  imports: [CommonModule,DragDropModule,ReactiveFormsModule,RouterModule],
  templateUrl: './contact-kanban.component.html',
  styleUrl: './contact-kanban.component.css'
})
export class ContactKanbanComponent implements OnInit{
  
  constructor(private contactsService:ContactsService,private fb: FormBuilder) { }
  statut:any;
  selectedContact: any;
  
  creationDate: any;
  nbContacts: number = 0;

 
  columns: { title: string, statut: string, color:string, contacts: any[] }[] = [
    { title: 'Prospect', statut: 'Prospect', color: "#FFA500", contacts: [] },
    { title: 'Client', statut: 'Client',color : "#000080", contacts: [] },
    { title: 'Client direct', statut: 'Client_direct',color: "#00FFFF", contacts: [] },
    { title: 'Partenaire', statut: 'Partenaire',color: "#80FF00", contacts: [] },
    { title: 'Piste', statut: 'Piste',color: "#0096AA", contacts: [] },
    { title: 'Fournisseur', statut: 'Fournisseur',color: "#FA0000", contacts: [] },
    { title: 'Archivé', statut: 'Archivé',color: "#FF80FF", contacts: [] },
    { title: 'Intermédiaire de facturation', statut: 'Intermédiaire_de_facturation',color: "#FF00FF", contacts: [] },
    { title: 'Client via intermédiaire', statut: 'Client_via_intermédiaire',color: "#FF00FF", contacts: [] },
  ];
  
  ngOnInit(): void {
    this.nbContacts = 0;
    this.loadContacts();
  }
  loadContacts() {
    this.columns.forEach(column => {
      console.log('Statut:', column.statut); // Debugging line
      this.contactsService.findContactByStatut(column.statut).subscribe(
        (response: any) => {
          console.log('Response:', response); // Debugging line
          column.contacts = response;
          this.nbContacts += response.length;
          },
        (error: any) => {
          console.error(`Erreur lors du chargement des contact pour le statut ${column.statut}:`, error);
        }
      );
    });
  }

 /* drop(event: CdkDragDrop<any[], any, any>, newStatut: string) {
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
      
  
      movedItem.statut = newStatut;
      ;
  
      console.log('contact déplacé:', movedItem);
      console.log('id du contact', movedItem.id);
      console.log('Nouveau statut:', newStatut);
      this.contactsService.updateContactStatus(movedItem.id,movedItem).subscribe(
        (response: any) => {
          console.log(`contact ${movedItem.id} mis à jour avec le statut ${newStatut}`);
          this.ngOnInit();
        },
        (error: any) => {
          console.error(`Erreur lors de la mise à jour du contact ${movedItem.id}`, error);
        }
      );
    }}*/
}
