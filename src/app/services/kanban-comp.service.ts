import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
@Injectable({
  providedIn: 'root'
})
export class KanbanCompService {
  private apiUrl = environment.apiUrl; // Backend API URL

  constructor(private http: HttpClient) {}

  // Get all tasks
  getComps(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/company/all`);
  }

  // Create a new task
  createComp(comp: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/company/add`, comp);
  }

  // Update a task
  updateComp(id: number, comp: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/company/${id}`, comp);
  }
}
