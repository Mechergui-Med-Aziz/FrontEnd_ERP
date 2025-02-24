import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { JwtResponse } from 'app/modules/auth/models/jwt-response';
import { LoginRequest } from 'app/modules/auth/login-request';
import { LocalStorageService } from 'app/services/local-storage.service';
import { environment } from 'environments/environment';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService
{
    private _authenticated: boolean =false ;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _localStorageService=inject(LocalStorageService);
    private baseURL = environment.apiUrl + "auth/";
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }
    constructor() {
        this._authenticated = this._localStorageService.isLoggedIn();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(data: LoginRequest): Observable<any>
    {
        return this._httpClient.post(this.baseURL +'forgot-password', data);
    }
    /**
     * Change password
     *
     * @param data
     * @returns {Observable<any>}
     */
    changePassword(data: LoginRequest): Observable<any>
    {
        return this._httpClient.post(this.baseURL +'change-password', data);
    }
    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(data: LoginRequest): Observable<any>
    {
        return this._httpClient.post(this.baseURL + 'reset-password', data);
    }

    /**
     * Sign in
     *
     * @param credentials
     */

    signIn(loginRequest: LoginRequest): Observable<JwtResponse> {
        return this._httpClient.post<JwtResponse>(
          this.baseURL + "signin",
          loginRequest
        ).pipe(
            tap(response => {
              // Parcourir la réponse ici si nécessaire
              this.accessToken = response.token;
             // Set the authenticated flag to true
              this._authenticated = true;
              this._localStorageService.markAsLoggedIn();
              this._localStorageService.saveUser(response.user);
              // Store the user on the user service
              this._userService.user = response.user;
             
            }),
            map(response => {
              return response;
            })
          );;
      }
   

    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;
        this._localStorageService.removeAll();
        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {

        
        // Check if the user is logged in
        if ( this._authenticated  )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
           return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        //return this.signInUsingToken();
    }
}
