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
  constructor(private ps:ProfileService,private fb:FormBuilder) { }

  usersAccounts :any[] = [];
  isUserAccountDetailsModalOpen = false;
  isUserAccountAddModalOpen = false;
  RoleSuccessmessage:string = '';
  RoleErrormessage:string = '';
  StatusSuccessmessage:string = '';
  StatusErrormessage:string = '';
  globalErrorMessage:string = '';
  globalSuccessMessage:string = '';
  isErrorModalOpen = false;
  isSuccessModalOpen = false;
  selectedUser:any;


  ngOnInit(): void {
    this.ps.findAllUsers().subscribe((data:any)=>{
      this.usersAccounts = data.filter((user:any) => user.id !== Number(localStorage.getItem('id')));
      //console.log(this.usersAccounts);
    })
  }

  userAddForm = this.fb.group({
    username: ['',Validators.required],
    firstname: ['',Validators.required],
    lastname: ['',Validators.required],
    email: ['',Validators.required],
    phone: ['',Validators.required],
    role: ['',Validators.required],
    status: '',
    password:''
  });


  addUserAccount() {
    const userData = this.userAddForm.value;
    if(this.usersAccounts.find((user:any) => user.username === userData.username || user.email === userData.email || user.phone === userData.phone)) {
      this.globalErrorMessage ="vous ne pouvez pas ajouter un utilisateur qui a le même username, email ou telephone qu'un utilisateur existant !";
      this.isErrorModalOpen = true;
      return;
    }
    userData.status = 'Activé'; 
    userData.password="123"
    //console.log(userData);
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
updateUserAccount() {
  const updatedData = { ...this.userForm.value };

  if (this.selectedUser.role !== updatedData.role) {
    this.ps.updateUserRole(this.selectedUser.id, updatedData).subscribe((response: any) => {
      if (response) {
        this.RoleSuccessmessage = "Modifications sauvegardées pour le rôle !";
      } else {
        this.RoleErrormessage = "Erreur lors de la sauvegarde des modifications du rôle !";
      }
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
      this.checkAndDisplayModals();
    });
  }
}

checkAndDisplayModals() {
  if (this.RoleErrormessage || this.StatusErrormessage) {
    this.globalErrorMessage = "Erreur lors de la sauvegarde des modifications !";
    this.isErrorModalOpen = true;
  }
  else if (this.RoleSuccessmessage || this.StatusSuccessmessage) {
    this.globalSuccessMessage = "Modifications sauvegardées !";
    this.isSuccessModalOpen = true;
    this.userForm.reset();
  this.isUserAccountDetailsModalOpen = false;
  this.ngOnInit();
  }
  
}


    closeErrorModal() {
      
      this.isErrorModalOpen = false;
      this.RoleErrormessage = '';
      this.StatusErrormessage = '';
      this.globalErrorMessage = '';
      return
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

    onRoleBlur() {
      const roleControl = this.userAddForm.get('role');
      if (roleControl) {
        roleControl.markAsTouched();
        if (!roleControl.value || roleControl.value === '') {
          roleControl.setErrors({ required: true });
        }
      }
    }
}
