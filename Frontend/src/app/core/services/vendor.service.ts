import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';
import { Vendor, CreateVendorDto, UpdateVendorDto } from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = `${ApiUrl.BASE_URL}/vendors`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createVendor(createVendorDto: CreateVendorDto): Observable<Vendor> {
    return this.http.post<Vendor>(this.apiUrl, createVendorDto, { headers: this.getHeaders() });
  }

  getAllVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getVendorById(id: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateVendor(id: string, updateVendorDto: UpdateVendorDto): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/${id}`, updateVendorDto, { headers: this.getHeaders() });
  }

  deleteVendor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
} 