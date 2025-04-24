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
    
  
    login(credentials: { username: string, password: string }): Observable<any> {
      return this.http.post<any>(`${this.url}/auth/login`, credentials).pipe(
        map(response => {
          // En cas de succès, la réponse contient le token et autres informations.
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('id', response.id);
            localStorage.setItem("msg", "false");
            localStorage.setItem('role', response.role); 
            this.isAuthenticatedSubject.next(true);
            return { success: true };
          }
          return { success: false };
        }),
        catchError(error => {
          console.log(error);
          // Ici on récupère l'erreur customisée renvoyée par le backend.
          let errorMsg = "Erreur lors de la connexion !";
          if (error.error && error.error.error) {
            console.log(error.error);
            console.log(error.error.error);
            errorMsg = error.error.error;
          }
          return of({ success: false, error: errorMsg });
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
