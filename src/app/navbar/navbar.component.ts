import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  user:any;
  constructor(private router:Router,private authService: AuthService,private fb: FormBuilder,private ps:ProfileService) { }

  showPassword: boolean = false;  
  showConfirmPassword: boolean = false; 

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;  
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;  
  }

  isModalOpen: boolean = false;
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
    if(id){
    this.ps.findUserById(parseInt(id)).subscribe((response:any) => {
     // console.log('Response:', response);
      this.user = response;});
    
    
  }
  }

  fillForm() {
    this.userForm.patchValue({
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      phone: this.user.phone,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }


  saveChanges() {
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;
   // console.log(password, confirmPassword);
  
    if ((password!=""&& confirmPassword=="") || (confirmPassword!="" && password=="")|| password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
  
    let updatedData = { ...this.userForm.value };
  
    delete updatedData.confirmPassword;
  
    if (updatedData.password=="") {
      delete updatedData.password;
    }
  
    this.ps.updateUser(this.user.id, updatedData).subscribe(
      (response: any) => {
        if (response) {
          alert("Modifications sauvegardées !");
          this.userForm.reset();
          this.closeModal();
        } else {
          alert("Erreur lors de la sauvegarde des modifications !");
        }
      },
      (error: any) => {
        console.error("Erreur API:", error);
        alert("Une erreur s'est produite !");
      }
    );
  }

  openEditModal() {
    this.fillForm();
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  
  }
