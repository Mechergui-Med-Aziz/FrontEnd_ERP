import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient ,private router: Router) { }
    private url = environment.apiUrl;
    options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    
  
  login(credentials:{username: string, password: string}): Observable<boolean> {
    console.log('username:', credentials.username, 'password:', credentials.password);
    return this.http.post<any>(`${this.url}/auth/login`, credentials).pipe(
      map(response => {
        if (response.token) {
          console.log('Token:', response.token);
          localStorage.setItem('token', response.token);
          // localStorage.setItem('role', response.role); // Example, store role if needed
          return true;
        }
        return false;
      }),
      tap(result => {
        // You can add side-effects here if necessary
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(false); // Use 'of' to return an observable of false
      })
    );
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Vérifie si un token existe dans localStorage
  }
}
