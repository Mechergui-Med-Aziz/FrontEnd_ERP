import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TypeActionsComponent } from './type-actions/type-actions.component';
import { AddCompanyComponent } from './CRM/societe/add-company/add-company.component';
import { typeActionsGuard } from './guards/type-actions.guard';
import { BesoinsComponent } from './besoins/besoins.component';


import { CompanyComponent } from './CRM/societe/company/company.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './CRM/contact/contact/contact.component';
import { AddContactComponent } from './CRM/contact/add-contact/add-contact.component';
import { UsersAccountsComponent } from './users-accounts/users-accounts.component';
import { usersAccountsGuard } from './guards/users-accounts.guard';
import { besoinsGuard } from './guards/besoins.guard';
import { DirectorDashboardComponent } from './director-dashboard/director-dashboard.component';
import { dashboardGuard } from './guards/dashboard.guard';
import { companyGuard } from './guards/company.guard';
import { contactGuard } from './guards/contact.guard';


export const routes: Routes = [ 
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', redirectTo: 'company', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, 
    { path:'reset-password', component:ResetPasswordComponent},
    
    {path:'company',component:CompanyComponent, canActivate: [AuthGuard]},
    {path:'addcomp',component:AddCompanyComponent, canActivate:[companyGuard]},
    {path:'type-actions',component:TypeActionsComponent ,canActivate:[typeActionsGuard]},
    {path:'besoins',component:BesoinsComponent,canActivate:[besoinsGuard]},
    {path:'besoins/:modeA',component:BesoinsComponent,canActivate:[besoinsGuard]},
    {path:'profile',component:ProfileComponent},
   
    { path: 'addcomp/:id', component: AddCompanyComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'addcontact', component: AddContactComponent },
    { path: 'updatecontact/:idContact', component: AddContactComponent },
    { path: 'addcontact/:idCompany', component: AddContactComponent ,canActivate:[contactGuard] },
    {path:'users-accounts',component:UsersAccountsComponent,canActivate:[usersAccountsGuard]},
    {path:'DirectorDashboard',component:DirectorDashboardComponent,canActivate:[dashboardGuard]},
    
    
    ];
