import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http : HttpClient ,private router: Router) { }
         private url = environment.apiUrl;
         options = {
               headers: new HttpHeaders({
                 'Content-Type': 'application/json',
                 'Accept': 'application/json',
                 'Authorization': 'Bearer ' + localStorage.getItem('token')
               })
             };

             findContactById(id: number): any {
               return this.http.get(`${this.url}/contact/${id}`, this.options).pipe(
                 map(response => {
                   //console.log('Response:', response);
                   return response;
                 }),
                 catchError(error => {
                   console.error('Error:', error);
                   return error;
                 })
               );
}

findAllContacts(): any {
  return this.http.get(`${this.url}/contact/all`, this.options).pipe(
    map(response => {
      //console.log('Response:', response);
      return response;
    }),
    catchError(error => {
      console.error('Error:', error);
      return error;
    })
  );

}
findContactByStatut(statut: any): any {
  console.log('Statut service:', statut); // Debugging line
  return this.http.get(`${this.url}/contact/statut/${statut}`, this.options).pipe(
   
    map(response => {
      //console.log('Response:', response);
      return response;
    }),
    catchError(error => {
      console.error('Error:', error);
      return error;
    })
  );
}

updateContactStatus(id:any,contact: any): any {
  return this.http.put(`${this.url}/contact/updatestatus/${id}`, contact, this.options).pipe(
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

updateContact(id: number, contact: any): any {
  return this.http.put(`${this.url}/contact/update/${id}`, contact, this.options).pipe(
    map(response => {
      //console.log('Response:', response);
      return response;
    }),
    catchError(error => {
      console.error('Error:', error);
      return error;
    })
  );
}


createContact(contact: any): any {
  console.log('Creating contact:', contact); // Debugging line
  return this.http.post(`${this.url}/contact/add`, contact, this.options).pipe(
    map(response => {
      //console.log('Response:', response);
      return response;
    }),
    catchError(error => {
      console.error('Error:', error);
      return error;
    })
  );
}
deleteContact(id: any): any {
  return this.http.delete(`${this.url}/contact/delete/${id}`, this.options).pipe(
    map(response => {
      console.log('response in service', response);
      return response;
    }),
    catchError(error => {
      console.error('Error:', error);
      return error;
    })
  );

}}
