import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

 constructor(private http : HttpClient ,private router: Router) { }
     private url = environment.apiUrl;
     options = {
           headers: new HttpHeaders({
             'Content-Type': 'application/json',
             'Accept': 'application/json',
             'Authorization': 'Bearer ' + localStorage.getItem('token')
           })
         };
         

         findUserById(id: number): any {
          return this.http.get(`${this.url}/user/${id}`, this.options).pipe(
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

        updateUser(id: number, user: any): any {
          return this.http.put(`${this.url}/user/update/${id}`, user, this.options).pipe(
            map(response => {
              console.log('Response:', response); 
              return response;
            }),
            catchError(error => {
              console.error('Error:', error);
              return error;
            }));}


            findUSerByRole(role: string): any {
              return this.http.get(`${this.url}/user/role/${role}`, this.options).pipe(
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

        findAllUsers(): any {
          return this.http.get(`${this.url}/user/all`, this.options).pipe(
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

        updateUserStatus(id: number, user:any): any {
          return this.http.put(`${this.url}/user/updateStatusByAdmin/${id}`,user, this.options).pipe(
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

        updateUserRole(id: number, user:any): any {
          return this.http.put(`${this.url}/user/updateRoleByAdmin/${id}`,user, this.options).pipe(
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

        addUserAccount(user: any): any {
          return this.http.post(`${this.url}/user/addUser`, user, this.options).pipe(
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
