import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environment';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http : HttpClient ,private router: Router) { }
    private url = environment.apiUrl;
    options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };

    resetPassword(data: { username: string, email: string }): Observable<any> {
      return this.http.post(`${this.url}/auth/reset-password`, data);
    }
    
  
  login(credentials:{username: string, password: string}): Observable<boolean> {
    
    return this.http.post<any>(`${this.url}/auth/login`, credentials).pipe(
      map(response => {
     //   console.log('Response:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('id', response.id);
          localStorage.setItem("msg","false");
          localStorage.setItem('role', response.role); 
          this.isAuthenticatedSubject.next(true);
          return true;
        }
        return false;
      }),
      tap(result => {
        
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(false); 
      })
    );
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); 
  }

  logout() {
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isAuthenticatedSubject.next(false); 
  }

 

}
