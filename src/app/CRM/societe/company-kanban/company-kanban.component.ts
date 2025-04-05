import { Component ,ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../../../services/contacts.service';
import { RouterModule } from '@angular/router';
import { CompServiceService } from '../../../services/comp-service.service';


@Component({
  selector: 'app-company-kanban',
  standalone: true,
  imports: [CommonModule,DragDropModule,ReactiveFormsModule,RouterModule],
  templateUrl: './company-kanban.component.html',
  styleUrl: './company-kanban.component.css'
})
export class CompanyKanbanComponent implements OnInit{
  constructor(private companyService:CompServiceService,private fb: FormBuilder) { }
  statut:any;
  selectedCompany: any;
  
  creationDate: any;
  nbCompanies: number = 0;

  
  


  columns: { title: string, statut: string, color:string, companies: any[] }[] = [
    { title: 'Prospect', statut: 'Prospect', color: "#FFA500", companies: [] },
    { title: 'Client', statut: 'Client',color : "#000080", companies: [] },
    { title: 'Client direct', statut: 'Client_direct',color: "#00FFFF", companies: [] },
    { title: 'Partenaire', statut: 'Partenaire',color: "#80FF00", companies: [] },
    { title: 'Piste', statut: 'Piste',color: "#0096AA", companies: [] },
    { title: 'Fournisseur', statut: 'Fournisseur',color: "#FA0000", companies: [] },
    { title: 'Archivé', statut: 'Archivé',color: "#FF80FF", companies: [] },
    { title: 'Intermédiaire de facturation', statut: 'Intermédiaire_de_facturation',color: "#FF00FF", companies: [] },
    { title: 'Client via intermédiaire', statut: 'Client_via_intermédiaire',color: "#FF00FF", companies: [] },
  ];


  ngOnInit() {
    this.nbCompanies = 0;
    this.loadCompanies();
   

  }


 

   


  loadCompanies() {
    this.columns.forEach(column => {
      this.companyService.findCompanyByStatut(column.statut).subscribe(
        (response: any) => {
          column.companies = response;
          this.nbCompanies += response.length;
          },
        (error: any) => {
          console.error(`Erreur lors du chargement des besoins pour le statut ${column.statut}:`, error);
        }
      );
    });
  }

  drop(event: CdkDragDrop<any[], any, any>, newStatut: string) {
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
  
      console.log('Besoin déplacé:', movedItem);
      console.log('Nouveau statut:', newStatut);
      this.companyService.updateCompany(movedItem.id,movedItem).subscribe(
        (response: any) => {
          console.log(`Besoin ${movedItem.id} mis à jour avec le statut ${newStatut}`);
          this.ngOnInit();
        },
        (error: any) => {
          console.error(`Erreur lors de la mise à jour du besoin ${movedItem.id}`, error);
        }
      );
    }
  }




  
  
 



  

  

  

}

