import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { AuthService } from './services/auth.service';
import { NavbarComponent } from "./navbar/navbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FrontEnd_ERP';
  navbarOpened = true;
  constructor(private authService: AuthService, private router: Router) {}

  isLoading = false;

  showApp() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Délai de 2 secondes avant d'afficher l'app
  }

  ngOnInit(): void {
    
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.navbarOpened = isAuthenticated; 

      if (!isAuthenticated) {
        this.router.navigate(['/login']); 
      }
    });
  }
}
