import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';
import { Material, CreateMaterial, UpdateMaterial } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = `${ApiUrl.BASE_URL}/materials`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  create(material: CreateMaterial): Observable<Material> {
    return this.http.post<Material>(this.apiUrl, material, { headers: this.getHeaders() });
  }

  findAll(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  findOne(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  update(id: string, material: UpdateMaterial): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/${id}`, material, { headers: this.getHeaders() });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
} 