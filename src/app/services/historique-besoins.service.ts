import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueBesoinsService {

  constructor(private http : HttpClient ,private router: Router) { }
         private url = environment.apiUrl;
         options = {
               headers: new HttpHeaders({
                 'Content-Type': 'application/json',
                 'Accept': 'application/json',
                 'Authorization': 'Bearer ' + localStorage.getItem('token')
               })
             };

             findHistoriqueBesoinsById(id: number): any {
               return this.http.get(`${this.url}/historique_besoin/besoin/${id}`, this.options).pipe(
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

              addHistoriqueBesoin(besoin: any): any {
                return this.http.post(`${this.url}/historique_besoin/add`, besoin, this.options).pipe(
                  map(response => {
                    console.log('Response du service hist:', response);
                    return response;
                  }),
                  catchError(error => {
                    console.error('Error:', error);
                    return error;
                  })
                );
}

        findHistoriqueBesoinsByActionBy(id: number): any {
          return this.http.get(`${this.url}/historique_besoin/actionBy/${id}`, this.options).pipe(
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

        existsHitoriqueBesoinsById(id: number): any {
          return this.http.get(`${this.url}/historique_besoin/exists/${id}`, this.options).pipe(
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
