import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice } from '../../../core/models/invoice.model';
import { InvoiceStatus } from '../../../core/constants/invoice-status.enum';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/constants';
import { PdfService } from '../../../core/services/pdf.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  loading: boolean = false;
  error: string = '';
  InvoiceStatus = InvoiceStatus; // Make enum available in template
  isAdmin: boolean = false;
  isContractor: boolean = false;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private authService: AuthService,
    private pdfService: PdfService
  ) {
    this.isAdmin = this.authService.hasRole(Role.ADMIN);
    this.isContractor = this.authService.hasRole(Role.CONTRACTOR);
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.error = '';
    
    this.invoiceService.getAllInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load invoices. Please try again.';
        this.loading = false;
        console.error('Error loading invoices:', error);
      }
    });
  }

  viewInvoice(id: string): void {
    this.router.navigate(['/invoices', id]);
  }

  createInvoice(): void {
    this.router.navigate(['/invoices/create']);
  }

  approveInvoice(id: string): void {
    this.loading = true;
    this.error = '';

    this.invoiceService.updateInvoiceStatus(id, { status: InvoiceStatus.APPROVED }).subscribe({
      next: () => {
        this.loadInvoices(); // Reload the list to show updated status
      },
      error: (error) => {
        this.error = 'Failed to approve invoice. Please try again.';
        this.loading = false;
        console.error('Error approving invoice:', error);
      }
    });
  }

  canApprove(invoice: Invoice): boolean {
    return this.isAdmin && invoice.status === InvoiceStatus.PENDING;
  }

  getStatusClass(status: InvoiceStatus): string {
    switch (status) {
      case InvoiceStatus.PENDING:
        return 'status-pending';
      case InvoiceStatus.APPROVED:
        return 'status-approved';
      case InvoiceStatus.PAID:
        return 'status-paid';
      default:
        return '';
    }
  }

  getStatusIcon(status: InvoiceStatus): string {
    switch (status) {
      case InvoiceStatus.PENDING:
        return 'fas fa-clock';
      case InvoiceStatus.APPROVED:
        return 'fas fa-check-circle';
      case InvoiceStatus.PAID:
        return 'fas fa-money-bill-wave';
      default:
        return 'fas fa-question-circle';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  downloadInvoice(invoice: Invoice): void {
    this.pdfService.generateInvoicePdf(invoice);
  }
} 