import { Component , EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { KanbanCompService } from '../../../services/kanban-comp.service';

import { RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';

import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ToastModule } from 'primeng/toast';
import { CompServiceService } from '../../../services/comp-service.service';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { CompanyKanbanComponent } from "../company-kanban/company-kanban.component";
import { CompanyListComponent } from "../company-list/company-list.component";
@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, DragDropModule, HttpClientModule, RouterModule, FormsModule, ReactiveFormsModule, MatTableModule,
    CommonModule, MatIconModule,
    MatButton, MatCheckbox,
    MatTooltip,
    MatFormFieldModule, MatIcon,
    MatInputModule,
    ToastModule, PaginatorModule, TableModule, ButtonModule, CheckboxModule, TooltipModule, MatButtonToggleModule, MatLabel, MatButtonModule, CompanyKanbanComponent, CompanyListComponent],
   
   
  templateUrl: './company.component.html',
  styleUrl: './company.component.css',
  providers: [KanbanCompService, CompServiceService, MessageService]  
})
export class CompanyComponent implements OnInit {
switchMode($event: MatButtonToggleChange) {

}
  mode: any;
  nbCompanies: number = 0;
  constructor(private companyService: CompServiceService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.mode="kanban";
    this.nbCompanies = 0;
    this.loadCompanies();
  }
 
  openFilterDialog(){

  }
  loadCompanies() {
  
    this.companyService.findAllCompanies().subscribe(
      (response: any) => {
        console.log('Response:', response); // Debugging line
        
        this.nbCompanies = response.length;
        },
      (error: any) => {
        console.error(`Erreur lors du chargement des contact`, error);
      }
    );
  }
}
