import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice } from '../../../core/models/invoice.model';
import { InvoiceStatus } from '../../../core/constants/invoice-status.enum';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: Invoice | null = null;
  loading: boolean = false;
  error: string = '';
  InvoiceStatus = InvoiceStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInvoice(id);
    } else {
      this.error = 'Invoice ID not provided';
    }
  }

  loadInvoice(id: string): void {
    this.loading = true;
    this.error = '';

    this.invoiceService.getInvoiceById(id).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load invoice details. Please try again.';
        this.loading = false;
        console.error('Error loading invoice:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/invoices']);
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
} 