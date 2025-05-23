import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants';
import { Project } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${ApiUrl.BASE_URL}/projects`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project, { headers: this.getHeaders() });
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project, { headers: this.getHeaders() });
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  assignUserToProject(projectId: string, userId: string): Observable<Project> {
    return this.http.post<Project>(
      `${this.apiUrl}/${projectId}/users`, 
      { userId }, 
      { headers: this.getHeaders() }
    );
  }

  removeUserFromProject(projectId: string, userId: string): Observable<Project> {
    return this.http.delete<Project>(
      `${this.apiUrl}/${projectId}/users/${userId}`, 
      { headers: this.getHeaders() }
    );
  }
} 