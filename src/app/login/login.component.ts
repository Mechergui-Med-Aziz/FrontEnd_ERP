import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private formBuilder: FormBuilder,private auth :AuthService,private router:Router,private appComponent: AppComponent) { }

    isLoading = true;
    loginForm = this.formBuilder.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(2)]]
    });
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
        if (result) {
          this.appComponent.isLoading = true; // Activer le chargement global
          setTimeout(() => {
            this.appComponent.isLoading = false;
            this.router.navigate(['/home'], { replaceUrl: true });
          }, 2000); // Attendre 2 secondes avant de naviguer
        } else {
          alert('Nom d’utilisateur ou mot de passe incorrect');
          this.loginForm.reset();
        }
      }, () => {
        alert("Erreur lors de la connexion !");
      });
    }
    goToResetPassword() {
      console.log('Reset password');
      this.router.navigate(['/reset-password']);
    }
    

}
