import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private formBuilder: FormBuilder,private auth :AuthService,private router:Router,private appComponent: AppComponent) { }

    isLoading = true;
    message!:any;
    isDenyModalOpen = false;
    loginForm = this.formBuilder.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(2)]]
    });
    showPassword: boolean = false;
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;  
    }
    ngOnInit(): void {
        this.loginForm.patchValue({
          username:localStorage.getItem("username")
        })
    }
    
    onSubmit() {
      this.auth.login({
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!
      }).subscribe(result => {
        //console.log(result);
        if (result.success) {
          this.appComponent.isLoading = true; // Activer le chargement global
          setTimeout(() => {
            this.appComponent.isLoading = false;
            if(localStorage.getItem("role") != "Administrateur"){
            this.router.navigate(['/company'], { replaceUrl: true });
            }else{
              this.router.navigate(['/users-accounts'], { replaceUrl: true });
            }
          }, 2000); // Attendre 2 secondes avant de naviguer
        } else {
          this.message = result.error || "Nom d'utilisateur ou mot de passe incorrecte !";
          localStorage.removeItem("username");
          this.isDenyModalOpen = true;

          this.loginForm.reset();
        }
      }, () => {
        this.isDenyModalOpen = true;
        this.message = "Erreur lors de la connexion !";
      });
    }
    
    goToResetPassword() {
      //console.log('Reset password');
      this.router.navigate(['/reset-password']);
    }
    closeDenyModal(){
      this.isDenyModalOpen = false;
    }

}
