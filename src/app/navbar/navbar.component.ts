import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  user:any;
  constructor(private router:Router,private authService: AuthService,private fb: FormBuilder,private ps:ProfileService) { }


  ngOnInit(): void {
    const id = localStorage.getItem('id');
    if (id) {
        this.ps.findUserById(parseInt(id)).subscribe(
            (response: any) => {
                //console.log('User Data:', response);
                this.user = response;
               // console.log('User:', this.user);
            },
            (error:any) => {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            }
        );
    }
}





  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }



  
  
  }
