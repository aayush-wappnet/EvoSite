import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';
import { Task, TaskDependency, AssignUserDto } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${ApiUrl.BASE_URL}/tasks`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createTask(task: Partial<Task>): Observable<Task> {
    const taskWithDefaults = {
      ...task,
      progress: task.progress ?? 0,
      status: task.status ?? 'PENDING'
    };
    return this.http.post<Task>(this.apiUrl, taskWithDefaults, { headers: this.getHeaders() });
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  assignUser(taskId: string, userId: string): Observable<Task> {
    const assignUserDto: AssignUserDto = { userId };
    return this.http.post<Task>(
      `${this.apiUrl}/${taskId}/users`, 
      assignUserDto, 
      { headers: this.getHeaders() }
    );
  }

  removeUser(taskId: string, userId: string): Observable<Task> {
    return this.http.delete<Task>(
      `${this.apiUrl}/${taskId}/users/${userId}`, 
      { headers: this.getHeaders() }
    );
  }

  createDependency(taskId: string, dependentTaskId: string): Observable<TaskDependency> {
    const dependencyDto = {
      taskId,
      dependentTaskId
    };
    return this.http.post<TaskDependency>(
      `${this.apiUrl}/dependencies`, 
      dependencyDto, 
      { headers: this.getHeaders() }
    );
  }

  getTaskDependencies(taskId: string): Observable<TaskDependency[]> {
    return this.http.get<TaskDependency[]>(
      `${this.apiUrl}/dependencies/${taskId}`, 
      { headers: this.getHeaders() }
    );
  }

  getTasksByProjectId(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/project/${projectId}`,
      { headers: this.getHeaders() }
    );
  }
} 