import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TypeActionsComponent } from './type-actions/type-actions.component';
import { AddCompanyComponent } from './CRM/societe/add-company/add-company.component';
import { typeActionsGuard } from './guards/type-actions.guard';
import { BesoinsComponent } from './besoins/besoins.component';
import { CompanyListComponent } from './CRM/societe/company-list/company-list.component';
import { CompanyKanbanComponent } from './CRM/societe/company-kanban/company-kanban.component';
import { CompanyComponent } from './CRM/societe/company/company.component';

export const routes: Routes = [ 
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
    { path: 'login', component: LoginComponent }, 
    { path:'reset-password', component:ResetPasswordComponent},
    {path:'companyList',component:CompanyListComponent},
    {path:'company',component:CompanyComponent},
    {path:'addcomp',component:AddCompanyComponent},
    {path:'type-actions',component:TypeActionsComponent ,canActivate:[typeActionsGuard]},
    {path:'besoins',component:BesoinsComponent},
    {path:'companyKanban' ,component:CompanyKanbanComponent }
    ];
