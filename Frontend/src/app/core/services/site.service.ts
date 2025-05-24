import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Site, CreateSiteDto, UpdateSiteDto } from '../models/site.model';
import { ApiUrl } from '../constants/api-url';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private apiUrl = `${ApiUrl.BASE_URL}/sites`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSites(): Observable<Site[]> {
    return this.http.get<Site[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getSite(id: string): Observable<Site> {
    return this.http.get<Site>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createSite(site: CreateSiteDto): Observable<Site> {
    return this.http.post<Site>(this.apiUrl, site, { headers: this.getHeaders() });
  }

  updateSite(id: string, site: UpdateSiteDto): Observable<Site> {
    return this.http.put<Site>(`${this.apiUrl}/${id}`, site, { headers: this.getHeaders() });
  }

  deleteSite(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
} 