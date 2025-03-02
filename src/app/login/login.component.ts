import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private formBuilder: FormBuilder,private auth :AuthService,private router:Router) { }
    
    loginForm = this.formBuilder.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(2)]]
    });
    
    onSubmit() {
      console.log(this.loginForm.value);  // Log the form values
      this.auth.login({
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!
      }).subscribe(result => {
        if (result) {
          alert("Connexion réussie: " +result);
           this.router.navigate(['/home']); // Redirection logic here
        } else {
          alert('Incorrect username or password');
          this.loginForm.reset();
        }
      });
    }
    

}
