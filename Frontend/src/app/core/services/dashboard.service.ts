import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';
import { Role } from '../constants/role.enum';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${ApiUrl.BASE_URL}/dashboard`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`, { headers: this.getHeaders() });
  }

  getContractorStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contractor`, { headers: this.getHeaders() });
  }

  getSiteEngineerStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/site-engineer`, { headers: this.getHeaders() });
  }

  getClientStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client`, { headers: this.getHeaders() });
  }

  getStatsByRole(role: Role): Observable<any> {
    switch (role) {
      case Role.ADMIN:
        return this.getAdminStats();
      case Role.CONTRACTOR:
        return this.getContractorStats();
      case Role.SITE_ENGINEER:
        return this.getSiteEngineerStats();
      case Role.CLIENT:
        return this.getClientStats();
      default:
        throw new Error('Invalid role');
    }
  }
} 