import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TypeActionsComponent } from './type-actions/type-actions.component';
import { CompDashComponent } from './CRM/societe/comp-dash/comp-dash.component';
import { AddCompanyComponent } from './CRM/societe/add-company/add-company.component';


export const routes: Routes = [ 
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
    { path: 'login', component: LoginComponent }, 
    { path:'reset-password', component:ResetPasswordComponent},
    {path:'type-actions',component:TypeActionsComponent},
    {path:'compDash',component:CompDashComponent},
    {path:'addcomp',component:AddCompanyComponent}
    ]
