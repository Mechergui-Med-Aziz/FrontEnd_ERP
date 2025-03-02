import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login/login.component';

export const routes: Routes = [ 
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirection par défaut
    { path: 'home', component: HomeComponent}, // Protégé
    { path: 'login', component: LoginComponent }, // Page publique
    { path: '**', redirectTo: 'login' } // Rediriger si la route n'existe pas];
    ]
