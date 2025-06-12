import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isModalOpen: boolean = false;
  isErrorModalOpen: boolean = false;
  message!:string ;
  rep!:boolean;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
        const formValues = this.resetPasswordForm.value;
        this.authService.resetPassword(formValues).subscribe(
            response => {
                //console.log('Réponse du backend :', response); 
                if (response.success) { 
                  this.rep=response.success;
                    this.message=response.message;
                    this.isModalOpen = true;
                    
                } else {
                  this.message=response.message;
                  this.isErrorModalOpen = true; 
                   
                }
                
            },
            error => {
                console.error('Erreur API:', error);
                this.message= 'Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.';
                this.isErrorModalOpen = true;
            }
        );
    }
}
closeModal() {
  this.isModalOpen = false;
  if(this.rep)
    this.router.navigate(['/login'], { replaceUrl: true });
}

closeErrorModal() {
  this.isErrorModalOpen = false;
  return
}

}