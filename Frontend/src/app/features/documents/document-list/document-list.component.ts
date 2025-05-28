import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Document } from '../../../core/models/document.model';
import { DocumentService } from '../../../core/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  loading = false;
  error: string | null = null;
  showDeleteDialog = false;
  documentToDelete: Document | null = null;

  constructor(
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.documentService.getAllDocuments().subscribe({
      next: (documents: Document[]) => {
        this.documents = documents;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load documents';
        this.loading = false;
        console.error('Error loading documents:', error);
      }
    });
  }

  onCreateDocument(): void {
    this.router.navigate(['/documents/create']);
  }

  onEditDocument(document: Document): void {
    this.router.navigate(['/documents/edit', document.id]);
  }

  onViewDocument(document: Document): void {
    // Open document in new tab
    window.open(document.url, '_blank');
  }

  onDownloadDocument(document: Document): void {
    // Create a temporary link element
    const link = window.document.createElement('a');
    link.href = document.url;
    link.download = document.name; // Set the download filename
    link.target = '_blank'; // Open in new tab if download doesn't start
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  }

  onDeleteDocument(document: Document): void {
    this.documentToDelete = document;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.documentToDelete) {
      this.documentService.deleteDocument(this.documentToDelete.id).subscribe({
        next: () => {
          this.documents = this.documents.filter(d => d.id !== this.documentToDelete?.id);
          this.closeDeleteDialog();
        },
        error: (error: any) => {
          this.error = 'Failed to delete document';
          console.error('Error deleting document:', error);
          this.closeDeleteDialog();
        }
      });
    }
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.documentToDelete = null;
  }

  getDocumentTypeClass(type: string): string {
    return type.toLowerCase().replace(/\s+/g, '-');
  }

  getDocumentTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Blueprint': 'fas fa-drafting-compass',
      'Approval': 'fas fa-file-signature',
      'Report': 'fas fa-file-alt'
    };
    return icons[type] || 'fas fa-file';
  }
} 