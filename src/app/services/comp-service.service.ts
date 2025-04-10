import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';

import { catchError, map, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CompServiceService {
  constructor(private http: HttpClient,private router: Router) { }
   private apiUrl = environment.apiUrl; // Backend API URL
   options = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              })
            };

//                  console.log('token:', this.options.headers.get('Authorization'));

  // Create a new task
  createComp(comp: any): any {
    return this.http.post(`${this.apiUrl}/company/add`, comp, this.options).pipe(
                map(response => {
                  console.log('company in the service:', comp);
                  console.log('token:', this.options);
                  console.log('Response:', response); 
                  return response;
                }),
                catchError(error => {
                  console.error('Error:', error);
                  return error;
                }));
  }

 
  
  updateComp(id: number, comp: any): any {
    return this.http.put(`${this.apiUrl}/company/${id}`, comp, this.options).pipe(
                map(response => {
                  console.log('Response:', response); 
                  return response;
                }),
                catchError(error => {
                  console.error('Error:', error);
                  return error;
                }));
  }
  findCompanyByStatut(statut: any): any {
    return this.http.get(`${this.apiUrl}/company/statut/${statut}`, this.options).pipe(
      map(response => {
        console.log('Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error:', error);
        return error;
      })
    );
  }
  // Get all tasks
  getComps(): any {
    return this.http.get(`${this.apiUrl}/company/all`, this.options).pipe(
                map(response => {
                  console.log('Response:', response);
                  return response;
                }),
                catchError(error => {
                  console.error('Error:', error);
                  return error;
                }));
  }
  updateCompany(id:any,company: any): any {
    return this.http.put(`${this.apiUrl}/company/update/${id}`, company, this.options).pipe(
      map(response => {
        console.log('Response:', response); 
        return response;
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;  // Utilise throw error pour rejeter l'erreur de manière propre
      })
    );
  }
}

