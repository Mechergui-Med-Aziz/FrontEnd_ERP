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
  user:any;
  constructor(private router:Router,private authService: AuthService,private fb: FormBuilder,private ps:ProfileService) { }

  showPassword: boolean = false;  
  showConfirmPassword: boolean = false; 

  isModalOpen: boolean = false;

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
  });

  ngOnInit(): void {
    const id = localStorage.getItem('id');
    if (id) {
      console.log("ID:", id);
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


message!:string ;
message1:string =""
  saveChanges() {
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;
   // console.log(password, confirmPassword);
  
    if ((password!=""&& confirmPassword=="") || (confirmPassword!="" && password=="")|| password !== confirmPassword) {
      this.message="Les mots de passe ne correspondent pas !";
      this.isModalOpen = true;
      return;}
  
    let updatedData = { ...this.userForm.value };
  
    delete updatedData.confirmPassword;
  
    if (updatedData.password=="") {
      delete updatedData.password;
    }
  
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
        alert("Une erreur s'est produite !");
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
    if(this.message=="Modifications sauvegardées !"){
    this.router.navigate(['/home']);
    }else{
      return;
    }
  }
  
  }
