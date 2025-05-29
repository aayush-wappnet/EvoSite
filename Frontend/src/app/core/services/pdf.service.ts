import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Invoice, InvoiceItem } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  generateInvoicePdf(invoice: Invoice): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Add company logo/header
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 128); // Dark blue color
    doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;

    // Invoice details section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice #${invoice.id}`, margin, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(`Created: ${new Date(invoice.createdAt).toLocaleDateString()}`, margin, yPos);
    yPos += 10;

    // Status with color
    const statusColor = this.getStatusColor(invoice.status);
    doc.setTextColor(statusColor.r, statusColor.g, statusColor.b);
    doc.text(`Status: ${invoice.status}`, margin, yPos);
    yPos += 20;

    // Project Details section
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Project Details', margin, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(`Project: ${invoice.project?.name || 'N/A'}`, margin, yPos);
    yPos += 10;

    if (invoice.task) {
      doc.text(`Task: ${invoice.task.title}`, margin, yPos);
      yPos += 10;
    }

    doc.text(`Contractor: ${invoice.contractor?.name || 'N/A'}`, margin, yPos);
    yPos += 20;

    // Materials table header
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Items', margin, yPos);
    yPos += 10;

    // Table headers with background
    doc.setFillColor(240, 240, 240); // Light gray background
    doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 10, 'F');
    
    const headers = ['Material', 'Quantity', 'Unit Price', 'Total'];
    const colWidths = [70, 30, 40, 40];
    let xPos = margin;

    headers.forEach((header, index) => {
      doc.text(header, xPos, yPos);
      xPos += colWidths[index];
    });
    yPos += 10;

    // Table content
    doc.setFont('helvetica', 'normal');
    if (invoice.items) {
      invoice.items.forEach((item: InvoiceItem) => {
        // Add subtle row background
        if (yPos % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 10, 'F');
        }

        xPos = margin;
        doc.text(item.material?.name || 'N/A', xPos, yPos);
        xPos += colWidths[0];
        doc.text(`${item.quantity} ${item.material?.unit || ''}`, xPos, yPos);
        xPos += colWidths[1];
        doc.text(item.unitPrice.toFixed(2), xPos, yPos);
        xPos += colWidths[2];
        doc.text(item.total.toFixed(2), xPos, yPos);
        yPos += 10;

        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Total amount with background
    yPos += 5;
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 15, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', margin + colWidths[0] + colWidths[1], yPos);
    doc.text(invoice.amount.toFixed(2), margin + colWidths[0] + colWidths[1] + colWidths[2], yPos);

    // Add footer
    const footerText = 'Thank you for your business!';
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128); // Gray color
    doc.text(footerText, pageWidth / 2, 280, { align: 'center' });

    // Save the PDF
    doc.save(`invoice-${invoice.id}.pdf`);
  }

  private getStatusColor(status: string): { r: number; g: number; b: number } {
    switch (status) {
      case 'Pending':
        return { r: 255, g: 193, b: 7 }; // Yellow
      case 'Approved':
        return { r: 40, g: 167, b: 69 }; // Green
      case 'Paid':
        return { r: 0, g: 123, b: 255 }; // Blue
      default:
        return { r: 0, g: 0, b: 0 }; // Black
    }
  }
} 