import { Injectable } from '@angular/core';
import { environment } from './environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(private http:HttpClient,private router:Router) { }

  private url = environment.apiUrl;
  options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };

       option= {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };


  createActionBesoin(action: any, files?: File[]): Observable<any> {
    if (files && files.length > 0) {
      // Cas avec fichiers => multipart/form-data
      const formData: FormData = new FormData();
      formData.append('action_besoin', JSON.stringify(action));
      for (const file of files) {
        formData.append('file', file, file.name);
      }
      return this.http.post(`${this.url}/action-besoin/add`, formData,this.option);
    } else {
      const formData: FormData = new FormData();
      formData.append('action_besoin', JSON.stringify(action));
      // Cas sans fichiers => application/json
      return this.http.post(`${this.url}/action-besoin/add`, formData, this.option);
    }
  }

  findActionsByBssoinId(id: number): Observable<any> {
    return this.http.get(`${this.url}/action-besoin/besoin/${id}`,this.options);
  }
  
  modifyActionBesoin(action: any, id: number,files:File[]): Observable<any> {

    console.log(action)
    if (files && files.length > 0) {
      // Cas avec fichiers => multipart/form-data
      const formData: FormData = new FormData();
      formData.append('action_besoin', JSON.stringify(action));
      for (const file of files) {
        formData.append('file', file, file.name);
      }
      return this.http.put(`${this.url}/action-besoin/update/${id}`, formData,this.option);
    } else {
      const formData: FormData = new FormData();
      formData.append('action_besoin', JSON.stringify(action));
      console.log(formData);
      console.log(id);
    return this.http.put(`${this.url}/action-besoin/update/${id}`, formData,this.option);
  
}

  }

  deleteAction(id: number): Observable<any> {
    return this.http.delete(`${this.url}/action-besoin/delete/${id}`,this.options);
  }
}
