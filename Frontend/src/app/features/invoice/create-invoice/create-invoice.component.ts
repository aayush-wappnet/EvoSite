import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { MaterialService } from '../../../core/services/material.service';
import { Project } from '../../../core/models/project.model';
import { Task } from '../../../core/models/task.model';
import { Material } from '../../../core/models/material.model';
import { CreateInvoiceDto, CreateInvoiceItemDto } from '../../../core/models/invoice.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  projects: Project[] = [];
  tasks: Task[] = [];
  materials: Material[] = [];
  loading: boolean = false;
  error: string = '';
  success: string = '';
  selectedMaterials: { [key: string]: Material } = {};

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private materialService: MaterialService,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      projectId: ['', Validators.required],
      taskId: [''],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadMaterials();
    this.addInvoiceItem(); // Add first item by default
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to load projects';
        console.error('Error loading projects:', error);
      }
    });
  }

  loadTasks(projectId: string): void {
    this.taskService.getTasksByProjectId(projectId).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to load tasks';
        console.error('Error loading tasks:', error);
      }
    });
  }

  loadMaterials(): void {
    this.materialService.getAllMaterial().subscribe({
      next: (materials: Material[]) => {
        this.materials = materials;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to load materials';
        console.error('Error loading materials:', error);
      }
    });
  }

  onProjectChange(projectId: string): void {
    this.invoiceForm.patchValue({ taskId: '' });
    if (projectId) {
      this.loadTasks(projectId);
    } else {
      this.tasks = [];
    }
  }

  createInvoiceItem(): FormGroup {
    return this.fb.group({
      materialId: ['', Validators.required],
      unitPrice: ['', [Validators.required, Validators.min(0)]]
    });
  }

  addInvoiceItem(): void {
    this.items.push(this.createInvoiceItem());
  }

  removeInvoiceItem(index: number): void {
    this.items.removeAt(index);
  }

  getMaterialName(materialId: string): string {
    const material = this.materials.find(m => m.id === materialId);
    return material ? material.name : 'Unknown Material';
  }

  onMaterialSelect(materialId: string, index: number): void {
    const material = this.materials.find(m => m.id === materialId);
    if (material) {
      this.selectedMaterials[index] = material;
    }
  }

  getMaterialQuantity(index: number): string {
    const material = this.selectedMaterials[index];
    if (material) {
      return `${material.quantity} ${material.unit}`;
    }
    return '';
  }

  calculateTotal(index: number): number {
    const item = this.items.at(index);
    const unitPrice = item.get('unitPrice')?.value || 0;
    const material = this.selectedMaterials[index];
    if (material) {
      return unitPrice * material.quantity;
    }
    return 0;
  }

  calculateGrandTotal(): number {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total += this.calculateTotal(i);
    }
    return total;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const invoiceData: CreateInvoiceDto = this.invoiceForm.value;

      this.invoiceService.createInvoice(invoiceData).subscribe({
        next: (response) => {
          this.success = 'Invoice created successfully';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/invoices']);
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          this.error = 'Failed to create invoice. Please try again.';
          this.loading = false;
          console.error('Error creating invoice:', error);
        }
      });
    } else {
      this.error = 'Please fill in all required fields correctly.';
    }
  }

  cancel(): void {
    this.router.navigate(['/invoices']);
  }
} 