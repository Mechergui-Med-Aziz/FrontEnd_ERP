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

}
