import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BesoinsService {

  constructor(private http : HttpClient ,private router: Router) { }
       private url = environment.apiUrl;
       options = {
             headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': 'Bearer ' + localStorage.getItem('token')
             })
           };

           findAllBesoins(): any {
            return this.http.get(`${this.url}/besoin/all`, this.options).pipe(
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

          findBesoinsById(id: number): any {
            return this.http.get(`${this.url}/besoin/${id}`, this.options).pipe(
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

          findBesoinByStatus(status: string): any {
            return this.http.get(`${this.url}/besoin/status/${status}`, this.options).pipe(
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
findBesoinsByContactId(id: number): any {
  return this.http.get(`${this.url}/besoin/contact/${id}`, this.options).pipe(
    map(response => {
      console.log('Response:', response); 
      return response;
    }),
    catchError(error => {
      console.error('Error:', error);
      return error;  // Throw error to be caught by the subscriber
    })
  );
}

updateBesoin(id:any,besoin: any): Observable<any> {
  return this.http.put(`${this.url}/besoin/update/${id}`, besoin, this.options).pipe(
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

addBesoin(besoin: any): any {
  return this.http.post(`${this.url}/besoin/add`, besoin, this.options).pipe(
    map(response => {
      console.log('Response:', response); 
      return response;
    }),
    catchError(error => {
      console.error('Error:', error);
      return error;  // Throw error to be caught by the subscriber
    })
  );
}




              deleteBesoinById(id: any): any {
                return this.http.delete(`${this.url}/besoin/delete/${id}`, this.options).pipe(
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

              findStatus(): any {
                return this.http.get(`${this.url}/besoin/status`, this.options).pipe(
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

              findBesoinByCreationDate(date: any): any {
                return this.http.get(`${this.url}/besoin/date/${date}`, this.options).pipe(
                  map(response => {
                    console.log('Response du service:', response);
                    return response;
                  }),
                  catchError(error => {
                    console.error('Error:', error);
                    return error;
                  })
                );
              }

            }
