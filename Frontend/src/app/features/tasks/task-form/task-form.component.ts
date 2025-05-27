import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { SiteService } from '../../../core/services/site.service';
import { Task } from '../../../core/models/task.model';
import { TaskStatus } from '../../../core/constants/task-status.enum';
import { Site } from '../../../core/models/site.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  sites: Site[] = [];
  TaskStatus = TaskStatus;
  statusOptions = Object.values(TaskStatus);
  private task: Task | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private siteService: SiteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    console.log('Task ID from route:', taskId);
    
    if (taskId) {
      this.isEditMode = true;
      this.initForm();
      this.loadTask(taskId);
    } else {
      this.initForm();
    }
    
    this.loadSites();
  }

  initForm(): void {
    const formControls = {
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['PENDING', Validators.required],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    };

    if (!this.isEditMode) {
      Object.assign(formControls, {
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        siteId: ['', Validators.required]
      });
    }

    this.taskForm = this.fb.group(formControls);
  }

  loadTask(id: string): void {
    console.log('Loading task with ID:', id);
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task: Task) => {
        console.log('Task loaded:', task);
        this.task = task;
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          progress: task.progress || 0
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading task:', error);
        this.error = 'Failed to load task';
        this.loading = false;
      }
    });
  }

  loadSites(): void {
    this.loading = true;
    this.siteService.getSites().subscribe({
      next: (sites: Site[]) => {
        this.sites = sites;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load sites';
        this.loading = false;
        console.error('Error loading sites:', error);
      }
    });
  }

  onSubmit(): void {
    console.log('Form submitted', this.taskForm.value);
    console.log('Form valid:', this.taskForm.valid);
    console.log('Is edit mode:', this.isEditMode);
    console.log('Current task:', this.task);

    if (this.taskForm.valid) {
      this.loading = true;
      const formValue = this.taskForm.value;
      console.log('Form values:', formValue);

      if (this.isEditMode && this.task) {
        const updateData = {
          title: formValue.title,
          description: formValue.description,
          status: formValue.status,
          progress: formValue.progress || 0
        };
        
        console.log('Sending update data:', updateData);
        console.log('Task ID:', this.task.id);

        this.taskService.updateTask(this.task.id, updateData).subscribe({
          next: (response) => {
            console.log('Update successful:', response);
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Error updating task:', error);
            this.error = 'Failed to update task. Please try again.';
            this.loading = false;
          }
        });
      } else {
        const createData = {
          ...formValue,
          progress: formValue.progress || 0
        };
        
        console.log('Sending create data:', createData);
        this.taskService.createTask(createData).subscribe({
          next: (response) => {
            console.log('Create successful:', response);
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Error creating task:', error);
            this.error = 'Failed to create task. Please try again.';
            this.loading = false;
          }
        });
      }
    } else {
      console.log('Form is invalid');
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        if (control?.invalid) {
          console.log(`Invalid field: ${key}`, control.errors);
        }
      });
      this.taskForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
} 