import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';
import { Material, CreateMaterial, UpdateMaterial, OrderMaterial } from '../models/material.model';

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

  requestMaterial(material: CreateMaterial): Observable<Material> {
    return this.http.post<Material>(`${this.apiUrl}/request`, material, { headers: this.getHeaders() });
  }

  getAllMaterial(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getMaterialById(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  approveRequest(id: string): Observable<Material> {
    return this.http.patch<Material>(`${this.apiUrl}/${id}/approve`, {}, { headers: this.getHeaders() });
  }

  rejectRequest(id: string): Observable<Material> {
    return this.http.patch<Material>(`${this.apiUrl}/${id}/reject`, {}, { headers: this.getHeaders() });
  }

  orderMaterial(id: string, orderDto: OrderMaterial): Observable<Material> {
    return this.http.patch<Material>(`${this.apiUrl}/${id}/order`, orderDto, { headers: this.getHeaders() });
  }

  deliverMaterial(id: string): Observable<Material> {
    return this.http.patch<Material>(`${this.apiUrl}/${id}/deliver`, {}, { headers: this.getHeaders() });
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
} 