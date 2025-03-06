import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  isModalOpen: boolean = true;
  username!:string;

  ngOnInit(): void {
    this.username=localStorage.getItem("username")?.toUpperCase()|| "";
    if(localStorage.getItem("msg")=="false"){
      this.isModalOpen=true;
    }
    else
    this.isModalOpen=false;
      
  }

  closeModal() {
    this.isModalOpen = false;
    localStorage.setItem("msg","true");
  }
}
