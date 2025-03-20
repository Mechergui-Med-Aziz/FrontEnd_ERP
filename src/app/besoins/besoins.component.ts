import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { BesoinsService } from '../services/besoins.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../services/contacts.service';


@Component({
  selector: 'app-besoins',
  standalone: true,
  imports: [CommonModule,DragDropModule,ReactiveFormsModule],
  templateUrl: './besoins.component.html',
  styleUrl: './besoins.component.css'
})
export class BesoinsComponent implements OnInit{
  constructor(private contactsService: ContactsService ,private besoinsService:BesoinsService,private fb: FormBuilder) { }
  status:any;
  selectedBesoin: any;
  isModalOpen: boolean = false;
  isAddModalOpen: boolean = false;
  creationDate: any;
  nbBesoins: number = 0;

  contacts: any[] = [];
  


  columns: { title: string, status: string, color:string, besoins: any[] }[] = [
    { title: 'À TRAITER', status: 'A_TRAITER', color: "#FFA500", besoins: [] },
    { title: 'ABANDONNÉ', status: 'ABANDONNÉ',color : "#000080", besoins: [] },
    { title: 'OK PRÉ-QUALIFIÉ', status: 'OK_PREQUALIFIE',color: "#00FFFF", besoins: [] },
    { title: 'EN COURS', status: 'EN_COURS',color: "#80FF00", besoins: [] },
    { title: 'GAGNÉ', status: 'GAGNÉ',color: "#0096AA", besoins: [] },
    { title: 'PERDU', status: 'PERDU',color: "#FA0000", besoins: [] },
    { title: 'REPORTÉ', status: 'REPORTE',color: "#FF80FF", besoins: [] }
  ];




  ngOnInit() {
    this.nbBesoins = 0;
    this.loadBesoins();
    this.loadContacts();

  }


  loadContacts() {
    this.contactsService.findAllContacts().subscribe(
      (contacts: any) => {
        this.contacts = contacts;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des contacts:', error);
      });
    }
    

    loadContact(besoin: any) {
      console.log('besoin:',besoin);
      this.contactsService.findContactById(besoin.contact).subscribe(
        (contact: any) => {
          besoin.contact = contact;
        },
        (error: any) => {
          console.error(`Erreur lors du chargement du contact ${besoin.contact}:`, error);
        }
      );
    }


  loadBesoins() {
    this.columns.forEach(column => {
      this.besoinsService.findBesoinByStatus(column.status).subscribe(
        (besoins: any) => {
          column.besoins = besoins;
          besoins.forEach((element: any) => {
          //  console.log(element);
          if(parseInt(element.contact))
            this.loadContact(element);
            
          });
          this.nbBesoins+=besoins.length;
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
      const contactId = movedItem.contact ? movedItem.contact.id : null;
      console.log('contactId:', movedItem);
  
      movedItem.status = newStatus;
      movedItem.contact=this.contacts.find(contact => contact.id == contactId);
  
      console.log('Besoin déplacé:', movedItem);
      console.log('Nouveau statut:', newStatus);
      this.besoinsService.updateBesoin(movedItem.id,movedItem).subscribe(
        (response: any) => {
          console.log(`Besoin ${movedItem.id} mis à jour avec le statut ${newStatus}`);
          this.ngOnInit();
        },
        (error: any) => {
          console.error(`Erreur lors de la mise à jour du besoin ${movedItem.id}`, error);
        }
      );
    }
  }

  besoinForm = this.fb.group({
    id: [{ value: 0 }, Validators.required],
    title: [{value:''},Validators.required],
    description: [{value:''},Validators.required],
    creationDate: [{value:''},Validators.required],
    status:[{value:''},Validators.required],
    contact:[''],
  });

  besoinAddForm = this.fb.group({
    title: [{value:''},Validators.required],
    description: [{value:''},Validators.required],
    creationDate: [{value:new Date().toLocaleDateString('fr-FR')}],
    status:[{value:''},Validators.required],
    contact:[Validators.required],
  });
  
  
  fillForm(besoin: any) {
    if (!besoin) return;
    this.selectedBesoin = besoin;
    console.log('besoin:',besoin);
    this.creationDate = new Date(besoin.creationDate).toLocaleDateString('fr-FR');
    console.log('creationDate:',this.creationDate);
    this.besoinForm.patchValue({
      id: besoin.id,
      title: besoin.title,
      description: besoin.description,
      creationDate: this.creationDate,
      status:besoin.status,
      contact:besoin.contact.lastname+' '+besoin.contact.firstname,
  })
}

addBesoin() {
  const formValue = this.besoinAddForm.value;

  // Assurez-vous que `contact` est un objet avec un `id`
  const contactId = formValue.contact;
  const contactObject = this.contacts.find(contact => contact.id == contactId);

  if (!contactObject) {
    console.error("Contact non valide !");
    return;
  }
console.log('contactObject:',contactObject);
  const newBesoin = {
    title: formValue.title,
    description: formValue.description,
    creationDate: new Date().toISOString(), // Utilisation d'un format ISO valide
    status: formValue.status,
    contact: contactObject // Envoyer uniquement l'ID du contact
  };

  console.log('Données envoyées:', newBesoin);

  this.besoinsService.addBesoin(newBesoin).subscribe(
    (response: any) => {
      console.log('Backend response:', response);
      this.ngOnInit();
      this.isAddModalOpen = false;
    },
    (error: any) => {
      console.error('rreur lors de l\'ajout de besoin:', error);
    }
  );
  
}

  

  openModal(besoin: any) {
    this.fillForm(besoin);
    console.log('besoin:',besoin);
    this.isModalOpen = true;    
  }
  openAddModal() {
    this.besoinAddForm.reset();
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
    this.besoinAddForm.reset();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveChanges() {
    const updatedData = this.besoinForm.value;
    console.log('updatedData:',updatedData);

    updatedData.contact = this.selectedBesoin.contact;
    updatedData.creationDate = this.selectedBesoin.creationDate;
    console.log('updatedData:',updatedData);
    
    const id = Number(updatedData.id);
    this.besoinsService.updateBesoin(id, updatedData).subscribe(
      (response: any) => {
        this.ngOnInit();
        console.log(`Besoin ${updatedData.id} mis à jour`);
        this.closeModal();
      },
      (error: any) => {
        console.error(`Erreur lors de la mise à jour du besoin ${updatedData.id}`, error);
      }
    );
  }
  

}
