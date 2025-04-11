import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environment';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeActionsService {

  constructor(private http : HttpClient ,private router: Router) { }

  private url = environment.apiUrl;
       options = {
             headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': 'Bearer ' + localStorage.getItem('token')
             })
           };

    findTypeActionsByBelongTo(belongTo: string): any {
      return this.http.get(`${this.url}/type-actions/belong-to/${belongTo}`, this.options).pipe(
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

    modifyTypeAction(id: number, typeAction: any): any {
      return this.http.put(`${this.url}/type-actions/update/${id}`, typeAction, this.options).pipe(
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

    deleteById(id: number): Observable<any> {
      return this.http.delete(`${this.url}/type-actions/delete/${id}`, this.options).pipe(
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

    addTypeAction(typeAction: any): any {
      return this.http.post(`${this.url}/type-actions/add`, typeAction, this.options).pipe(
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

    findByNameAndBelongTo(name: string, belongTo: string): any {
      return this.http.get(`${this.url}/type-actions/exists/${name}/${belongTo}`, this.options).pipe(
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
  }
