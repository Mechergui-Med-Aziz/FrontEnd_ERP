import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit{
  constructor(private formBuilder: FormBuilder,private auth :AuthService,private router:Router) { }
    rememberMe=false;
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
     // console.log(this.loginForm.value);  
      this.auth.login({
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!
      }).subscribe(result => {
        if (result) {
          //alert("Connexion réussie: " +result);
           this.router.navigate(['/home']);
        } else {
          alert('Incorrect username or password');
          this.loginForm.reset();
        }
      });
    }
    

}
