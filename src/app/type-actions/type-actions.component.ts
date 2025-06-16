import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypeActionsService } from '../services/type-actions.service';

@Component({
  selector: 'app-type-actions',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './type-actions.component.html',
  styleUrl: './type-actions.component.css'
})
export class TypeActionsComponent implements OnInit {
  constructor(private fb: FormBuilder, private type_action:TypeActionsService) { }
  
  actionsCRM :{ id: number; name: string; belongTo:string }[] = [];
  actionsBesoins: { id: number; name: string; belongTo:string }[] = [];
  isModalOpen: boolean = false;
  isErrorModalOpen: boolean = false;
  isModalOpen2: boolean = false;
  isDeleteModalOpen: boolean = false;
  isAddModalOpen: boolean = false;
  message!:string ;
  action!:any;
  id!:number;
  deletedAction:any;
  userRole:any

  acion={
    name: 'Email',
    belongTo: 'CRM'
  }

  typeActionForm = this.fb.group({
    id: [''],
    name: ['',[Validators.required]],
    belongTo: ['',[Validators.required]]
  });

  AddTypeActionForm = this.fb.group({
    typeActionName: ['', Validators.required],
    typeActionbelongTo: ['', Validators.required],
  });
  
  ngOnInit(): void {
    this.userRole=localStorage.getItem("role")!;

    this.type_action.findTypeActionsByBelongTo("CRM").subscribe(
      (response: any) => {
        this.actionsCRM = response;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des actions CRM :', error);
      }
    );
    this.type_action.findTypeActionsByBelongTo("Besoin").subscribe(
      (response: any) => {
        this.actionsBesoins = response;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des actions besoins :', error);
      });

  }


  modifyTypeAction() {
    this.type_action.findByNameAndBelongTo(this.typeActionForm.get('name')!.value!, this.typeActionForm.get('belongTo')!.value!).subscribe(
      (response: any) => {
        if (response.message) {
          this.message = "Action déjà existante !";
          this.isErrorModalOpen = true;
        } else {
          this.updateTypeAction();
        }
      }
    );
  }

  updateTypeAction() {
    this.id=Number(this.typeActionForm.get('id')?.value);
    this.action=this.typeActionForm.value;
    
    this.type_action.modifyTypeAction(this.id, this.action).subscribe(
      (response: any) => {
        if(response){
          this.message="Modifications sauvegardées !";
          this.isModalOpen2 = true;
        }
        else{
        this.message="Erreur lors de la sauvegarde des modifications !";
        //console.log('Réponse du backend :', response);
        this.isErrorModalOpen = true;
        }
       
      },
      (error: any) => {
        console.error('Erreur lors de la modification de l\'action :', error);
      }
    );
  }

  addTypeAction() {
  this.type_action.findByNameAndBelongTo(this.AddTypeActionForm.get('typeActionName')!.value!, this.AddTypeActionForm.get('typeActionbelongTo')!.value!).subscribe(
    (response: any) => {
      if (response.message) {
        this.message = "Action déjà existante !";
        this.isErrorModalOpen = true;
      } else {
        this.addNewTypeAction();
      }
    }
  );
}

  addNewTypeAction() {
    const actionToAdd = {
      name: this.AddTypeActionForm.get('typeActionName')?.value,
      belongTo: this.AddTypeActionForm.get('typeActionbelongTo')?.value
    };
  
    //console.log(actionToAdd);  
  
    this.type_action.addTypeAction(actionToAdd).subscribe(
      (response: any) => {
        if (response) {
          this.message = "Action ajoutée !";
          this.isModalOpen2 = true;
        } else {
          this.message = "Erreur lors de l'ajout de l'action !";
          this.isErrorModalOpen = true;
        }
      },
      (error: any) => {
        console.error('Erreur lors de l\'ajout de l\'action :', error);
      }
    );
  }
  

  fillForm(action: any) {
    this.typeActionForm.patchValue({
      id: action.id,
      name: action.name, 
      belongTo: action.belongTo
    });
  }


  openDeleteModal(action: any) {
    this.deletedAction=action;
    this.isDeleteModalOpen = true;
  }

  deleteTypeAction(id: number) {
    this.type_action.deleteById(id).subscribe(
      (response: any) => {
        //console.log('Réponse du backend :', response);
        this.isDeleteModalOpen = false;
        this.ngOnInit();
      },
      (error: any) => {
        console.error('Erreur lors de la suppression de l\'action :', error);
      }
    );
  }

  openEditModal(action: any) {
    this.fillForm(action);
    this.isModalOpen = true;
  }

  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  closeAddModal() {
    this.isAddModalOpen = false;
    this.AddTypeActionForm.reset();
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }
  closeModal2() {
    this.isModalOpen2 = false;
    this.AddTypeActionForm.reset();
    this.closeAddModal();
    this.typeActionForm.reset();
    this.closeModal();
    this.ngOnInit();
  }

  closeErrorModal() {
    this.isErrorModalOpen = false;
    return
  }

  onBelongToBlur() {
    const belongToControl = this.AddTypeActionForm.get('typeActionbelongTo');
    if (belongToControl) {
      belongToControl.markAsTouched();
      if (!belongToControl.value || belongToControl.value.length === 0) {
        belongToControl.setErrors({ required: true });
      }
    }
  }
}
