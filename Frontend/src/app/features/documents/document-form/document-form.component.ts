import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocumentService } from '../../../core/services/document.service';
import { Document } from '../../../core/models/document.model';
import { DocumentType } from '../../../core/constants/document-type.enum';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class DocumentFormComponent implements OnInit {
  documentForm!: FormGroup;
  documentTypes = Object.values(DocumentType);
  projects: Project[] = [];
  isEditMode = false;
  documentId: string | null = null;
  loading = false;
  error: string | null = null;
  selectedFile: File | null = null;
  fileError: string | null = null;
  filePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProjects();
    this.documentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.documentId;

    if (this.isEditMode && this.documentId) {
      this.loadDocument();
    }
  }

  initForm() {
    if (this.isEditMode) {
      this.documentForm = this.fb.group({
        name: ['', [Validators.minLength(3)]],
        version: ['', [Validators.pattern('^[0-9]+(\\.[0-9]+)*$')]]
      });
    } else {
      this.documentForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        version: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)*$')]],
        type: ['', Validators.required],
        projectId: ['', Validators.required]
      });
    }
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => {
        this.error = 'Failed to load projects';
        console.error(err);
      }
    });
  }

  loadDocument(): void {
    if (!this.documentId) return;

    this.loading = true;
    this.documentService.getDocumentById(this.documentId).subscribe({
      next: (document) => {
        this.documentForm.patchValue({
          name: document.name,
          type: document.type,
          version: document.version,
          projectId: document.projectId
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load document';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.validateFile(file);
    }
  }

  validateFile(file: File): void {
    this.fileError = null;
    this.filePreview = null;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.fileError = 'File size must be less than 10MB';
      return;
    }

    // Check file type
    const allowedTypes = [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx',
      '.jpg', '.jpeg', '.png', '.gif'
    ];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      this.fileError = 'Only PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, and GIF files are allowed';
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.filePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }

    this.selectedFile = file;
    this.documentForm.markAsTouched();
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileError = null;
    this.filePreview = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    if (this.documentForm.valid) {
      this.loading = true;
      this.error = null;

      const formData = new FormData();
      const formValues = this.documentForm.value;
      
      if (this.isEditMode && this.documentId) {
        // In edit mode, only append fields that have been changed
        if (formValues.name) {
          formData.append('name', formValues.name);
        }
        if (formValues.version) {
          formData.append('version', formValues.version);
        }
        if (this.selectedFile) {
          formData.append('file', this.selectedFile);
        }

        this.documentService.updateDocument(this.documentId, formData).subscribe({
          next: () => {
            this.router.navigate(['/documents']);
          },
          error: (err) => {
            this.error = err.error.message || 'Failed to update document';
            this.loading = false;
          }
        });
      } else {
        // For new documents, all fields are required
        formData.append('name', formValues.name);
        formData.append('version', formValues.version);
        formData.append('type', formValues.type);
        formData.append('projectId', formValues.projectId);
        
        if (!this.selectedFile) {
          this.fileError = 'Please select a file';
          this.loading = false;
          return;
        }
        formData.append('file', this.selectedFile);

        this.documentService.createDocument(formData).subscribe({
          next: () => {
            this.router.navigate(['/documents']);
          },
          error: (err) => {
            this.error = err.error.message || 'Failed to create document';
            this.loading = false;
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.documentForm.controls).forEach(key => {
        const control = this.documentForm.get(key);
        control?.markAsTouched();
      });
    }
  }
} 