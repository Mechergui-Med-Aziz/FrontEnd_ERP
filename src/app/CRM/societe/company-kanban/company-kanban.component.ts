import { Component ,ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../../../services/contacts.service';
import { RouterModule } from '@angular/router';
import { CompServiceService } from '../../../services/comp-service.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-company-kanban',
  standalone: true,
  imports: [CommonModule,DragDropModule,ReactiveFormsModule,RouterModule,MatIconModule,MatButtonModule],
  templateUrl: './company-kanban.component.html',
  styleUrl: './company-kanban.component.css'
})
export class CompanyKanbanComponent implements OnInit{
  companycontacts: any;
  constructor(private companyService:CompServiceService,private fb: FormBuilder,private contactsService: ContactsService) { }
  statut:any;
  selectedCompany: any;
  
  creationDate: any;
  nbCompanies: number = 0;
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

  
  


  columns: { title: string, status: string, color:string, companies: any[] }[] = [
    { title: 'Prospect', status: 'Prospect', color: "#FFA500", companies: [] },
    { title: 'Client', status: 'Client',color : "#000080", companies: [] },
    { title: 'Client direct', status: 'Client_direct',color: "#00FFFF", companies: [] },
    { title: 'Partenaire', status: 'Partenaire',color: "#80FF00", companies: [] },
    { title: 'Piste', status: 'Piste',color: "#0096AA", companies: [] },
    { title: 'Fournisseur', status: 'Fournisseur',color: "#FA0000", companies: [] },
    { title: 'Archivé', status: 'Archivé',color: "#FF80FF", companies: [] },
    { title: 'Intermédiaire de facturation', status: 'Intermédiaire_de_facturation',color: "#FF00FF", companies: [] },
    { title: 'Client via intermédiaire', status: 'Client_via_intermédiaire',color: "#FF00FF", companies: [] },
  ];


  ngOnInit() {
    this.nbCompanies = 0;
    this.loadCompanies();
   

  }


 

   


  loadCompanies() {
    this.columns.forEach(column => {
      this.companyService.findCompanyByStatus(column.status).subscribe(
        (response: any) => {
          column.companies = response;
          this.nbCompanies += response.length;
          },
        (error: any) => {
          console.error(`Erreur lors du chargement des besoins pour le statut ${column.status}:`, error);
        }
      );
    });
  }

  drop(event: CdkDragDrop<any[], any, any>, newStatus: string) {
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
      
  
      movedItem.status = newStatus;
      this.companycontacts = movedItem.contacts;
  
      console.log('societe déplacé:', movedItem);
      console.log('Nouveau statut:', newStatus);
      this.companyService.updateCompanystatus(movedItem.id,movedItem).subscribe(
        (response: any) => {
          console.log(`societe ${movedItem.id} mis à jour avec le statuttttttttttttttttttttttttttttttttttttt ${newStatus}`);
          this.companycontacts.forEach((element: any) => {
            console.log('Contact hahah :', element);
            console.log('ID du contact:', element.id); // Debugging line
            console.log('Statut du societe :', newStatus); // Debugging line
            this.contactsService.updateContactStatut(element.id,newStatus).subscribe(
              (response: any) => {
                console.log(`contact ${element.lastname} mis à jour avec le statut ${newStatus}`);
                this.ngOnInit();
              },
              (error: any) => {
                console.error(`Erreur lors de la mise à jour du contact ${element.id}`, error);
              }
            );
           
      
            
          });
          this.ngOnInit();
        },
        (error: any) => {
          console.error(`Erreur lors de la mise à jour le la societe ${movedItem.id}`, error);
        }
      );
      
    }
  }




  
  
 



  

  

  

}

