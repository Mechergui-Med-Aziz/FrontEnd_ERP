import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-users-accounts',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './users-accounts.component.html',
  styleUrl: './users-accounts.component.css'
})
export class UsersAccountsComponent implements OnInit {
  usersAccounts :any[] = [];
  isUserAccountDetailsModalOpen = false;
  isUserAccountAddModalOpen = false;
  constructor(private ps:ProfileService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.ps.findAllUsers().subscribe((data:any)=>{
      this.usersAccounts = data.filter((user:any) => user.id !== Number(localStorage.getItem('id')));
      console.log(this.usersAccounts);
    })
  }

  userAddForm = this.fb.group({
    username: [Validators.required],
    firstname: [Validators.required],
    lastname: [Validators.required],
    email: [Validators.required],
    phone: [Validators.required],
    role: [Validators.required],
    status: '',
    password:''
  });


  addUserAccount() {
    const userData = this.userAddForm.value;
    userData.status = 'Activé'; 
    userData.password="123"
    console.log(userData);
    this.ps.addUserAccount(userData).subscribe((response:any)=>{
      if (response) {
        this.globalSuccessMessage="Utilisateur ajouté avec succès !";
        this.isSuccessModalOpen = true;
        this.userAddForm.reset();
      } else {
        this.globalErrorMessage ="Erreur lors de l'ajout de l'utilisateur !";
        this.isErrorModalOpen = true;
      }
    });
  }

  userForm = this.fb.group({
    id: [Validators.required],
    username: [],
    firstname: [],
    lastname: [],
    email: [],
    password: [],
    phone: [],
    status: [{value:''},Validators.required],
    role: [{value:''},Validators.required],
});

selectedUser:any;
fillUserForm(user:any){
  this.userForm.patchValue({
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      phone: user.phone,
      status: user.status,
      role: user.role
    });
  }


  openEditUserAccountModal(user:any){
    this.selectedUser = user;
    this.fillUserForm(user);
    this.isUserAccountDetailsModalOpen = true;
  }

  closeUserAccountAddModal() {
    this.isUserAccountAddModalOpen = false;
  }

  openAddUserAccountModal() {
    this.userAddForm.reset();
    this.isUserAccountAddModalOpen = true;
  }

  closeUserAccountModal(){
    this.isUserAccountDetailsModalOpen = false;
  }
RoleSuccessmessage:string = '';
RoleErrormessage:string = '';
StatusSuccessmessage:string = '';
StatusErrormessage:string = '';
globalErrorMessage:string = '';
globalSuccessMessage:string = '';
isErrorModalOpen = false;
isSuccessModalOpen = false;


updateUserAccount() {
  const updatedData = { ...this.userForm.value };
  updatedData.password = this.selectedUser.password;

  if (this.selectedUser.role !== updatedData.role) {
    this.ps.updateUserRole(this.selectedUser.id, updatedData).subscribe((response: any) => {
      if (response) {
        this.RoleSuccessmessage = "Modifications sauvegardées pour le rôle !";
      } else {
        this.RoleErrormessage = "Erreur lors de la sauvegarde des modifications du rôle !";
      }
      // Affichage immédiat du modal si un message est défini
      this.checkAndDisplayModals();
    });
  }

  if (this.selectedUser.status !== updatedData.status) {
    this.ps.updateUserStatus(this.selectedUser.id, updatedData).subscribe((response: any) => {
      if (response) {
        this.StatusSuccessmessage = "Modifications sauvegardées pour le status !";
      } else {
        this.StatusErrormessage = "Erreur lors de la sauvegarde des modifications du status !";
      }
      // Affichage immédiat du modal si un message est défini
      this.checkAndDisplayModals();
    });
  }
}

checkAndDisplayModals() {
  // Affiche le modal d'erreur si l'un des messages d'erreur est défini
  if (this.RoleErrormessage || this.StatusErrormessage) {
    this.globalErrorMessage = "Erreur lors de la sauvegarde des modifications !";
    this.isErrorModalOpen = true;
  }
  // Sinon, si un message de succès existe, afficher le modal de succès.
  else if (this.RoleSuccessmessage || this.StatusSuccessmessage) {
    this.globalSuccessMessage = "Modifications sauvegardées !";
    this.isSuccessModalOpen = true;
    this.userForm.reset();
  this.isUserAccountDetailsModalOpen = false;
  this.ngOnInit();
  }
  
}


    closeErrorModal() {
      this.isUserAccountAddModalOpen = false;
      this.isErrorModalOpen = false;
      this.RoleErrormessage = '';
      this.StatusErrormessage = '';
      this.globalErrorMessage = '';
    }

    closeSuccessModal() {
      this.userAddForm.reset();
      this.isUserAccountAddModalOpen = false;
      this.isSuccessModalOpen = false;
      this.RoleSuccessmessage = '';
      this.StatusSuccessmessage = '';
      this.globalSuccessMessage = '';
      this.userForm.reset();
      this.ngOnInit();
    }
    








}
