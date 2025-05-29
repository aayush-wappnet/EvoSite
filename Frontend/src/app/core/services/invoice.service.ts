import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';
import { 
  Invoice, 
  CreateInvoiceDto, 
  UpdateInvoiceDto 
} from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly baseUrl = `${ApiUrl.BASE_URL}/invoices`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Create a new invoice
  createInvoice(createInvoiceDto: CreateInvoiceDto): Observable<Invoice> {
    return this.http.post<Invoice>(this.baseUrl, createInvoiceDto, { headers: this.getHeaders() });
  }

  // Get all invoices
  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  // Get a single invoice by ID
  getInvoiceById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Update an invoice status
  updateInvoiceStatus(id: string, updateInvoiceDto: UpdateInvoiceDto): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.baseUrl}/${id}`, updateInvoiceDto, { headers: this.getHeaders() });
  }

  // Delete an invoice
  deleteInvoice(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
} 