import { Injectable } from '@angular/core';
import { environment } from './environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionCrmService {

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


  createActionCrm(action: any, files?: File[]): Observable<any> {
    if (files && files.length > 0) {
      // Cas avec fichiers => multipart/form-data
      const formData: FormData = new FormData();
      formData.append('action_crm', JSON.stringify(action));
      for (const file of files) {
        formData.append('file', file, file.name);
      }
      return this.http.post(`${this.url}/action-crm/add`, formData,this.option);
    } else {
      const formData: FormData = new FormData();
      formData.append('action_crm', JSON.stringify(action));
      // Cas sans fichiers => application/json
      return this.http.post(`${this.url}/action-crm/add`, formData,this.option);
    }
  }

  findActionsByContactId(id: number): Observable<any> {
    return this.http.get(`${this.url}/action-crm/contact/${id}`,this.options);
  }
  
  modifyActionCrm(action: any, id: number,files:File[]): Observable<any> {
    console.log(action)
    if (files && files.length > 0) {
      // Cas avec fichiers => multipart/form-data
      const formData: FormData = new FormData();
      formData.append('action_crm', JSON.stringify(action));
      for (const file of files) {
        formData.append('file', file, file.name);
      }
      return this.http.put(`${this.url}/action-crm/update/${id}`, formData,this.option);
    } else {
      const formData: FormData = new FormData();
      formData.append('action_crm', JSON.stringify(action));
      console.log(formData);
      console.log(id);
    return this.http.put(`${this.url}/action-crm/update/${id}`, formData,this.option);
  
}

  }

  deleteAction(id: number): Observable<any> {
    return this.http.delete(`${this.url}/action-crm/delete/${id}`,this.options);
  }
}
