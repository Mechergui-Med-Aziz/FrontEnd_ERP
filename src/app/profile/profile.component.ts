import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  constructor(private router:Router,private authService: AuthService,private fb: FormBuilder,private ps:ProfileService) { }

  user:any;
  showPassword: boolean = false;  
  showConfirmPassword: boolean = false; 
  isModalOpen: boolean = false;
  isErrorModalOpen: boolean = false;
  message!:string ;
  message1:string =""

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;  
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;  
  }

  userForm: FormGroup = this.fb.group({
    id: [{ value: '', disabled: true }, Validators.required],
    username: [{ value: '', disabled: true }, Validators.required], 
    email: ['', [Validators.required, Validators.email]],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    password: [''],
    confirmPassword: [''],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],   
    status: [Validators.required],
    role: [Validators.required], 
  });

  ngOnInit(): void {
    const id = localStorage.getItem('id');
    if (id) {
      //console.log("ID:", id);
        this.ps.findUserById(parseInt(id)).subscribe(
            (response: any) => {
                //console.log('User Data:', response);
                this.user = response;
                this.fillForm();
                //console.log('User:', this.user);
            },
            (error:any) => {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            }
        );
    }
    
}


fillForm() {
  if (!this.user) return; 

  this.userForm.patchValue({
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      phone: this.user.phone,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      status: this.user.status,
      role: this.user.role
  });
}

verifyPasswords() : boolean {
  const password = this.userForm.get('password')?.value;
  const confirmPassword = this.userForm.get('confirmPassword')?.value;

  if(confirmPassword && password.length==0){
    this.message1 = "Veuillez entrer un mot de passe !";
    return false;

  }else if (password && confirmPassword && password !== confirmPassword) {
    this.message1 = "Les mots de passe ne correspondent pas !";
    return false;
  } else if (password && confirmPassword && password === confirmPassword) {
    this.message1 = "Les mots de passe correspondent !";
    return true;
  }else if (password && confirmPassword.length==0) {
    this.message1 = "Veuillez confirmer le mot de passe !";
    return false;}
   else {
    this.message1 = "";
  }

  return false;
}

 msg!:any

checkPasswords(password: string, confirmPassword: string): string {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[v+\-*$#@!])[A-Za-z\dv+\-*$#@!]{8,}$/;


  if (!password) {
    return this.msg='Veuillez entrer un mot de passe !';
  }

  if (!confirmPassword) {
    return this.msg='Veuillez confirmer le mot de passe !';
  }

  if (!passwordPattern.test(password)) {
    return this.msg='Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 symbole parmi ceci +-*$#@! et 8 caractères minimum.';
  }

  if (password !== confirmPassword) {
    return this.msg='Les mots de passe ne correspondent pas !';
  }

  return this.msg='Les mots de passe correspondent !';
}


  saveChanges() {
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;
   // console.log(password, confirmPassword);

   var text=this.checkPasswords(password, confirmPassword)
  
    if (text!='Les mots de passe correspondent !'){
      this.message=text;
      this.isErrorModalOpen = true;
      return;}
  
    let updatedData = { ...this.userForm.value };
  
    delete updatedData.confirmPassword;
  
    if (updatedData.password=="") {
      delete updatedData.password;
    }

    console.log("Updated Data:", updatedData);
  
    this.ps.updateUser(this.user.id, updatedData).subscribe(
      (response: any) => {
        if (response) {
          this.message1=""
          this.message="Modifications sauvegardées !";
          
          
        } else {
          this.message1=""
          this.message="Erreur lors de la sauvegarde des modifications !";
        }
        this.isModalOpen = true;
      },
      (error: any) => {
        console.error("Erreur API:", error);
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
    if(this.user.role=="Administrateur"){
      this.router.navigate(['/users-accounts']);
    }
    this.router.navigate(['/home']);
  }
  closeErrorModal() {
    this.isErrorModalOpen = false;
    return
  }
  }
