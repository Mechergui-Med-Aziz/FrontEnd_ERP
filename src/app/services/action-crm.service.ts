import { Injectable } from '@angular/core';
import { environment } from './environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionCrmService {

  constructor(private http:HttpClient,private router:Router) { }

  private url = environment.apiUrl;


  createActionCrm(action: any, files?: File[]): Observable<any> {
    if (files && files.length > 0) {
      // Cas avec fichiers => multipart/form-data
      const formData: FormData = new FormData();
      formData.append('action_crm', JSON.stringify(action));
      for (const file of files) {
        formData.append('file', file, file.name);
      }
      return this.http.post(`${this.url}/action-crm/add`, formData);
    } else {
      const formData: FormData = new FormData();
      formData.append('action_crm', JSON.stringify(action));
      // Cas sans fichiers => application/json
      return this.http.post(`${this.url}/action-crm/add`, formData);
    }
  }

  findActionsByContactId(id: number): Observable<any> {
    return this.http.get(`${this.url}/action-crm/contact/${id}`);
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
      return this.http.put(`${this.url}/action-crm/update/${id}`, formData);
    } else {
      const formData: FormData = new FormData();
      formData.append('action_crm', JSON.stringify(action));
      console.log(formData);
      console.log(id);
    return this.http.put(`${this.url}/action-crm/update/${id}`, formData);
  
}

  }

  deleteAction(id: number): Observable<any> {
    return this.http.delete(`${this.url}/action-crm/delete/${id}`);
  }
}
